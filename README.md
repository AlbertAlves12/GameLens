# 🎮 GameLens - Portal & Dashboard de Análise Gamer (Analytics, Reviews & Afiliados)

**GameLens** é uma plataforma Full-Stack profissional e moderna para análise de biblioteca Steam, monitoramento de horas jogadas, distribuição por nicho, críticas de jogos geradas com assistência editorial de IA, comparador de preços com links de afiliados (Nuuvem, Amazon, Green Man Gaming) e sistema de doação direta via Pix.

Construída para ser **100% funcional imediatamente sem necessidade de chaves de API pagas** e **ultrafácil de hospedar** no Render, Vercel ou qualquer provedor em nuvem.

---

## 🚀 Arquitetura do Projeto

```
├── main.py              # Back-end em Python com FastAPI (Rotas /api/stats, /api/game/{id}, Jinja2)
├── templates/
│   └── index.html       # Front-end estilizado em Dark Mode Steam (Tailwind CSS + Chart.js CDN)
├── static/              # Diretório para ativos estáticos opcionais (CSS/JS adicionais)
├── requirements.txt     # Dependências essenciais em Python (FastAPI, Uvicorn, Jinja2)
├── vercel.json          # Configuração pronta para deploy Serverless na Vercel
└── README.md            # Documentação e instruções de execução e deploy
```

---

## ⚡ Como Rodar Localmente

### 1. Pré-requisitos
- Python 3.9 ou superior instalado.

### 2. Clonar ou Baixar o Repositório
```bash
git clone https://github.com/seu-usuario/steam-analytics-dashboard.git
cd steam-analytics-dashboard
```

### 3. Criar e Ativar Ambiente Virtual (Recomendado)
```bash
# No Linux/macOS:
python3 -m venv venv
source venv/bin/activate

# No Windows:
python -m venv venv
venv\Scripts\activate
```

### 4. Instalar as Dependências
```bash
pip install -r requirements.txt
```

### 5. Iniciar a Aplicação
Você pode iniciar via `python main.py` ou diretamente via `uvicorn`:
```bash
# Opção 1 (Direto pelo script):
python main.py

# Opção 2 (Com hot-reload ativo para desenvolvimento):
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Abra seu navegador em: **[http://localhost:8000](http://localhost:8000)**.  
A documentação interativa OpenAPI/Swagger estará disponível em: **[http://localhost:8000/docs](http://localhost:8000/docs)**.

---

## 🌐 Como Subir no GitHub

```bash
git init
git add .
git commit -m "feat: inicializando dashboard steam com FastAPI e Chart.js"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/steam-analytics-dashboard.git
git push -u origin main
```

---

## ☁️ Como Fazer Deploy no Render (100% Gratuito)

O Render reconhece aplicações Python com FastAPI nativamente:

1. Acesse o **[Render Dashboard](https://dashboard.render.com/)** e faça login com seu GitHub.
2. Clique no botão **New +** e selecione **Web Service**.
3. Conecte o repositório que você acabou de subir no GitHub.
4. Preencha as configurações do serviço:
   - **Name**: `steam-analytics-dashboard`
   - **Environment**: `Python 3`
   - **Region**: Qualquer uma de sua preferência (ex: Ohio / Frankfurt)
   - **Branch**: `main`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Clique em **Create Web Service**.
6. Em menos de 2 minutos, sua aplicação estará online com certificado SSL automático (HTTPS)!

---

## ▲ Como Fazer Deploy na Vercel (Front-end Completo Vite/React)

O GameLens utiliza React 19 + Vite com Tailwind CSS. Na Vercel, o deploy é automático:

1. Acesse **[vercel.com](https://vercel.com)** e importe seu repositório do GitHub.
2. Nas configurações do projeto (**Build & Development Settings**):
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. O arquivo `vercel.json` na raiz garante que todas as rotas redirecionem para o `index.html`:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
4. Clique em **Deploy**. Seu site estará no ar em segundos com domínio `*.vercel.app`!

---

## 📡 Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/` | Página principal do dashboard renderizada via Jinja2 |
| `GET` | `/api/stats` | Métricas gerais: total de horas, tendência dos últimos 6 meses, jogo mais jogado, avaliação média e distribuição por gênero |
| `GET` | `/api/game/{game_id}` | Detalhes específicos de um jogo (horas, pico 24h de jogadores, preço, conquistas) |
| `GET` | `/api/games` | Lista de jogos com suporte a filtros: `?search=cyber&genre=RPG&sort_by=hours` |
| `GET` | `/api/health` | Checagem de integridade para monitoramento de uptime |

---

## 🔑 Integração Opcional com a Steam Web API Real

A aplicação já vem com um catálogo mockado completo e fidelíssimo, utilizando os identificadores oficiais (AppIDs) da Steam para carregar capas e dados autênticos.

Caso deseje sincronizar com uma conta Steam pessoal no futuro:
1. Obtenha uma chave gratuita em: [https://steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey)
2. Defina as variáveis de ambiente:
   ```bash
   export STEAM_API_KEY="SUA_CHAVE_AQUI"
   export STEAM_ID="SEU_STEAM_ID64_AQUI"
   ```
3. O `main.py` está arquitetado para permitir carregar os dados ao vivo mantendo o fallback seguro.
