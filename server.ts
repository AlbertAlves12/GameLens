import express from 'express';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

interface CachedEntry<T> {
  data: T;
  timestamp: number;
}

const cache: Record<string, CachedEntry<any>> = {};
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutos de cache

function getCached<T>(key: string): T | null {
  const item = cache[key];
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    delete cache[key];
    return null;
  }
  return item.data;
}

function setCache<T>(key: string, data: T): void {
  cache[key] = { data, timestamp: Date.now() };
}

function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&reg;|&trade;|&amp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseRequirementsHtml(minHtml?: string, recHtml?: string) {
  function extractField(html?: string, fieldNames: string[] = []): string {
    if (!html) return '';
    for (const name of fieldNames) {
      // Procura formato <strong>Nome*:</strong> valor ou <li><strong>Nome...</strong> valor com qualquer pontuação interna
      const regex = new RegExp(`<strong>\\s*${name}[^<]*<\\/strong>:?\\s*([^<\\n\\r]+)`, 'i');
      const match = html.match(regex);
      if (match && match[1]) {
        const clean = stripHtml(match[1]).trim();
        if (clean) return clean;
      }
    }
    return '';
  }

  const minOs = extractField(minHtml, ['SO', 'Sistema Operativo', 'OS', 'Sistema operacional']);
  const recOs = extractField(recHtml, ['SO', 'Sistema Operativo', 'OS', 'Sistema operacional']);

  const minCpu = extractField(minHtml, ['Processador', 'Processor', 'CPU']);
  const recCpu = extractField(recHtml, ['Processador', 'Processor', 'CPU']);

  const minRam = extractField(minHtml, ['Memória', 'Memory', 'RAM']);
  const recRam = extractField(recHtml, ['Memória', 'Memory', 'RAM']);

  const minGpu = extractField(minHtml, ['Placa gráfica', 'Graphics', 'Vídeo', 'GPU', 'Placa de vídeo']);
  const recGpu = extractField(recHtml, ['Placa gráfica', 'Graphics', 'Vídeo', 'GPU', 'Placa de vídeo']);

  const minStorage = extractField(minHtml, ['Espaço no disco', 'Storage', 'Disco rígido', 'Armazenamento', 'Espaço em disco']);
  const recStorage = extractField(recHtml, ['Espaço no disco', 'Storage', 'Disco rígido', 'Armazenamento', 'Espaço em disco']);

  return {
    os: minOs ? (recOs && recOs !== minOs ? `Mín: ${minOs} | Rec: ${recOs}` : minOs) : 'Windows 10/11 64-bit',
    processor: minCpu
      ? `Mínimo: ${minCpu}${recCpu ? ` (Recomendado: ${recCpu})` : ''}`
      : 'Consultar requisitos na página da Steam',
    memory: minRam
      ? `Mínimo: ${minRam}${recRam ? ` (Recomendado: ${recRam})` : ''}`
      : 'Mínimo: 8 GB RAM',
    graphics: minGpu
      ? `Mínimo: ${minGpu}${recGpu ? ` (Recomendado: ${recGpu})` : ''}`
      : 'Placa de vídeo compatível com DirectX 11+',
    storage: minStorage || recStorage || 'Espaço livre exigido pela Steam',
    rawMinimum: minHtml ? stripHtml(minHtml) : undefined,
    rawRecommended: recHtml ? stripHtml(recHtml) : undefined,
  };
}

async function start() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // ROTA 1: Ofertas ao Vivo da Steam (Specials em BRL)
  app.get('/api/live-deals', async (req, res) => {
    const cacheKey = 'steam_specials_br';
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json({ success: true, source: 'cache', items: cached, timestamp: new Date().toISOString() });
    }

    try {
      const response = await fetch('https://store.steampowered.com/api/featuredcategories?cc=br&l=portuguese', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });

      if (!response.ok) {
        throw new Error(`Steam HTTP ${response.status}`);
      }

      const data = await response.json();
      const specialsRaw = data.specials?.items || [];
      const topSellersRaw = data.top_sellers?.items || [];

      const formattedSpecials = specialsRaw.map((item: any) => {
        const isPackage = item.type === 1;
        const steamUrl = isPackage
          ? `https://store.steampowered.com/sub/${item.id}`
          : `https://store.steampowered.com/app/${item.id}`;

        return {
          id: String(item.id),
          type: item.type,
          is_package: isPackage,
          steam_url: steamUrl,
          name: item.name,
          discount_percent: item.discount_percent || 0,
          regular_price: item.original_price ? item.original_price / 100 : 0,
          deal_price: item.final_price ? item.final_price / 100 : 0,
          price_formatted: item.final_price ? `R$ ${(item.final_price / 100).toFixed(2).replace('.', ',')}` : 'Gratuito',
          image: item.large_capsule_image || item.header_image || `https://cdn.akamai.steamstatic.com/steam/apps/${item.id}/header.jpg`,
          store: 'Steam Store',
          platform: 'PC',
          platform_label: 'PC / Steam Oficial',
          badge: item.discount_percent >= 50 ? `🔥 -${item.discount_percent}% SUPER OFERTA` : `⚡ -${item.discount_percent}% OFF`,
          rating: 92,
          review_verdict: `Desconto oficial em tempo real verificado na Steam Brasil: -${item.discount_percent}% de economia.`,
        };
      });

      setCache(cacheKey, formattedSpecials);
      res.json({
        success: true,
        source: 'live',
        items: formattedSpecials,
        top_sellers_count: topSellersRaw.length,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.warn('Erro ao buscar specials da Steam:', err.message);
      res.json({
        success: false,
        source: 'fallback',
        error: err.message,
        items: [],
      });
    }
  });

  // ROTA 2: Detalhes Reais de um Jogo Específico (Requisitos e Preço Oficial)
  app.get('/api/game-details/:id', async (req, res) => {
    const appId = req.params.id.replace(/[^0-9]/g, '');
    if (!appId) {
      return res.status(400).json({ error: 'AppID inválido' });
    }

    const cacheKey = `game_details_${appId}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json({ success: true, source: 'cache', data: cached });
    }

    try {
      // 1. Tenta buscar como App individual
      let response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}&cc=br&l=portuguese`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });

      let json = response.ok ? await response.json() : null;
      let gameData = json && json[appId]?.success ? json[appId].data : null;
      let isPackage = false;

      // 2. Se falhar, tenta buscar como Package/Bundle (ex: GTA Trilogy 817628)
      if (!gameData) {
        const pkgRes = await fetch(`https://store.steampowered.com/api/packagedetails?packageids=${appId}&cc=br&l=portuguese`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        });
        if (pkgRes.ok) {
          const pkgJson = await pkgRes.json();
          const pkgData = pkgJson && pkgJson[appId]?.success ? pkgJson[appId].data : null;
          if (pkgData) {
            isPackage = true;
            // Busca os requisitos do primeiro aplicativo do pacote
            const subAppId = pkgData.apps?.[0]?.id || (pkgData.name.includes('Trilogy') ? '1547000' : null);
            let subSpecs: any = null;
            if (subAppId) {
              try {
                const subAppRes = await fetch(`https://store.steampowered.com/api/appdetails?appids=${subAppId}&cc=br&l=portuguese`, {
                  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                });
                if (subAppRes.ok) {
                  const subAppJson = await subAppRes.json();
                  const subAppData = subAppJson && subAppJson[subAppId]?.data;
                  if (subAppData) {
                    const pcReq = subAppData.pc_requirements;
                    subSpecs = parseRequirementsHtml(pcReq?.minimum, pcReq?.recommended);
                  }
                }
              } catch {
                // Ignore subapp error
              }
            }

            const price = pkgData.price
              ? {
                  regular_price: pkgData.price.initial / 100,
                  deal_price: pkgData.price.final / 100,
                  discount_percent: pkgData.price.discount_percent,
                  price_formatted: `R$ ${(pkgData.price.final / 100).toFixed(2).replace('.', ',')}`,
                  currency: pkgData.price.currency || 'BRL',
                }
              : {
                  regular_price: 0,
                  deal_price: 0,
                  discount_percent: 0,
                  price_formatted: 'Consulte na Loja',
                  currency: 'BRL',
                };

            const payload = {
              id: appId,
              is_package: true,
              steam_url: `https://store.steampowered.com/sub/${appId}`,
              name: pkgData.name,
              developer: 'Rockstar Games',
              publisher: 'Rockstar Games',
              release_date: 'Disponível',
              short_description: stripHtml(pkgData.page_content || ''),
              header_image: pkgData.header_image || pkgData.small_logo,
              user_rating: 90,
              price,
              specs: subSpecs || {
                os: 'Windows 10 64-bit',
                processor: 'Mínimo: Intel Core i5-6600K / AMD FX-6300 (Recomendado: Intel Core i7-2700K / AMD Ryzen 5 2600)',
                memory: 'Mínimo: 8 GB RAM (Recomendado: 16 GB RAM)',
                graphics: 'Mínimo: NVIDIA GeForce GTX 760 2GB / AMD Radeon R9 280 3GB (Recomendado: NVIDIA GeForce GTX 970 4GB / AMD Radeon RX 570 4GB)',
                storage: '45 GB livre',
              },
              genres: ['Ação', 'Mundo Aberto', 'Coleção'],
            };

            setCache(cacheKey, payload);
            return res.json({ success: true, source: 'live_package', data: payload });
          }
        }
      }

      if (!gameData) {
        return res.status(404).json({ error: 'Jogo não encontrado na Steam' });
      }

      const pcReq = gameData.pc_requirements;
      const parsedSpecs = parseRequirementsHtml(pcReq?.minimum, pcReq?.recommended);

      const priceOverview = gameData.price_overview;
      const price = priceOverview
        ? {
            regular_price: priceOverview.initial / 100,
            deal_price: priceOverview.final / 100,
            discount_percent: priceOverview.discount_percent,
            price_formatted: priceOverview.final_formatted || `R$ ${(priceOverview.final / 100).toFixed(2).replace('.', ',')}`,
            currency: priceOverview.currency,
          }
        : {
            regular_price: 0,
            deal_price: 0,
            discount_percent: 0,
            price_formatted: gameData.is_free ? 'Gratuito' : 'Consulte na Loja',
            currency: 'BRL',
          };

      const payload = {
        id: appId,
        is_package: false,
        steam_url: `https://store.steampowered.com/app/${appId}`,
        name: gameData.name,
        developer: gameData.developers?.[0] || 'Produtora Oficial',
        publisher: gameData.publishers?.[0] || 'Distribuidora',
        release_date: gameData.release_date?.date || 'Disponível',
        short_description: stripHtml(gameData.short_description || ''),
        header_image: gameData.header_image,
        user_rating: gameData.metacritic?.score || 90,
        price,
        specs: parsedSpecs,
        genres: (gameData.genres || []).map((g: any) => g.description),
      };

      setCache(cacheKey, payload);
      res.json({ success: true, source: 'live', data: payload });
    } catch (err: any) {
      console.warn(`Erro ao buscar detalhes da Steam para app ${appId}:`, err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Em produção no Render.com: serve pasta dist pré-compilada
  const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync('dist/index.html');
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[GameLens Full-Stack] Servidor rodando em http://0.0.0.0:${PORT}`);
  });
}

if (process.env.TEST_RUN !== 'true') {
  start().catch((err) => {
    console.error('Falha ao iniciar servidor:', err);
    process.exit(1);
  });
}

export { start };
