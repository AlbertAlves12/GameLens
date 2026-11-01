"""
==============================================================================
Dashboard de Análise de Biblioteca e Mercado de Jogos (Steam API & Dados)
Back-end construído em Python com FastAPI e Jinja2 Templates.

Autor: Engenheiro Full-Stack
Compatível com: Render, Vercel, Railway, Fly.io, GitHub e execução local.
==============================================================================
"""

import os
from typing import Dict, List, Optional
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request, Query
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

# Inicialização da aplicação FastAPI
app = FastAPI(
    title="Steam Analytics Dashboard API",
    description="API de análise de biblioteca de jogos e métricas de mercado estilo Steam",
    version="1.0.0"
)

# Habilitar CORS para permitir consumo por qualquer front-end ou ferramentas externas
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuração de diretórios de templates e arquivos estáticos
BASE_DIR = Path(__file__).resolve().parent
TEMPLATES_DIR = BASE_DIR / "templates"
STATIC_DIR = BASE_DIR / "static"

# Garante que as pastas existam para evitar exceções
TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)

templates = Jinja2Templates(directory=str(TEMPLATES_DIR))
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# ==============================================================================
# PALETA DE CORES POR NICHO / GÊNERO E POR JOGO
# Proporciona contraste imediato e identidade visual a cada título e categoria
# ==============================================================================
GENRE_COLORS = {
    "Ação": "#ef4444",        # Vermelho carmesim / Combate
    "RPG": "#a855f7",         # Púrpura épico / Fantasia
    "Estratégia": "#f59e0b",  # Âmbar ouro / Tático
    "Indie": "#10b981",       # Verde esmeralda / Autoral
    "Simulação": "#06b6d4",   # Ciano / Gestão
    "Aventura": "#3b82f6",    # Azul safira / Exploração
    "Soulslike": "#f97316",   # Laranja chama / Desafio
    "Competitivo": "#ec4899", # Pink / Precisão
    "Sandbox": "#14b8a6",     # Turquesa / Criação
    "Outros": "#94a3b8"
}

# ==============================================================================
# BASE DE DADOS MOCKADA (SIMULADA) DE ALTA FIDELIDADE
# Cada jogo possui sua cor temática única para diferenciação visual nos gráficos
# ==============================================================================
GAMES_DATABASE: Dict[str, dict] = {
    "730": {
        "id": "730",
        "name": "Counter-Strike 2",
        "color": "#f97316",  # Laranja tático CS
        "hours_played": 845.2,
        "genres": ["Ação", "Tiro", "Competitivo"],
        "user_rating": 88,
        "rating_label": "Muito Positivas",
        "peak_24h_players": 1420850,
        "current_price_brl": 0.00,
        "price_formatted": "Gratuito para Jogar",
        "discount_percent": 0,
        "developer": "Valve",
        "release_year": 2023,
        "achievements_unlocked": 1,
        "total_achievements": 1,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
        "short_description": "Durante mais de duas décadas, Counter-Strike ofereceu uma experiência competitiva de elite formada por milhões de jogadores em todo o mundo."
    },
    "1091500": {
        "id": "1091500",
        "name": "Cyberpunk 2077",
        "color": "#facc15",  # Amarelo Neon Night City
        "hours_played": 182.5,
        "genres": ["RPG", "Ação", "Mundo Aberto"],
        "user_rating": 89,
        "rating_label": "Muito Positivas",
        "peak_24h_players": 48200,
        "current_price_brl": 199.90,
        "price_formatted": "R$ 199,90",
        "discount_percent": 50,
        "developer": "CD PROJEKT RED",
        "release_year": 2020,
        "achievements_unlocked": 44,
        "total_achievements": 44,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
        "short_description": "Um RPG de ação e aventura em mundo aberto ambientado em Night City, uma megalópole obcecada por poder, glamour e modificações corporais."
    },
    "1245620": {
        "id": "1245620",
        "name": "Elden Ring",
        "color": "#eab308",  # Dourado da Graça da Térvore
        "hours_played": 264.8,
        "genres": ["RPG", "Ação", "Soulslike"],
        "user_rating": 93,
        "rating_label": "Extremamente Positivas",
        "peak_24h_players": 85400,
        "current_price_brl": 229.90,
        "price_formatted": "R$ 229,90",
        "discount_percent": 0,
        "developer": "FromSoftware Inc.",
        "release_year": 2022,
        "achievements_unlocked": 38,
        "total_achievements": 42,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
        "short_description": "O NOVO RPG DE AÇÃO E FANTASIA. Levante-se, Maculado, e seja guiado pela graça para portar o poder do Anel Prístino e se tornar um Lorde Prístino."
    },
    "1086940": {
        "id": "1086940",
        "name": "Baldur's Gate 3",
        "color": "#a855f7",  # Púrpura épico Ilitide
        "hours_played": 312.4,
        "genres": ["RPG", "Estratégia", "Aventura"],
        "user_rating": 96,
        "rating_label": "Extremamente Positivas",
        "peak_24h_players": 98120,
        "current_price_brl": 199.99,
        "price_formatted": "R$ 199,99",
        "discount_percent": 20,
        "developer": "Larian Studios",
        "release_year": 2023,
        "achievements_unlocked": 48,
        "total_achievements": 54,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg",
        "short_description": "Reúna seu grupo e retorne aos Reinos Esquecidos em uma história de companheirismo, traição, sacrifício e a atração pelo poder supremo."
    },
    "292030": {
        "id": "292030",
        "name": "The Witcher 3: Wild Hunt",
        "color": "#f43f5e",  # Carmesim Lobo Branco
        "hours_played": 195.0,
        "genres": ["RPG", "Aventura", "Mundo Aberto"],
        "user_rating": 97,
        "rating_label": "Extremamente Positivas",
        "peak_24h_players": 27300,
        "current_price_brl": 129.99,
        "price_formatted": "R$ 129,99",
        "discount_percent": 75,
        "developer": "CD PROJEKT RED",
        "release_year": 2015,
        "achievements_unlocked": 68,
        "total_achievements": 78,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg",
        "short_description": "Você é Geralt de Rívia, mercenário matador de monstros. Seu caminho é um continente em guerra, repleto de monstros e intrigas políticas."
    },
    "413150": {
        "id": "413150",
        "name": "Stardew Valley",
        "color": "#10b981",  # Verde Vale da Colheita
        "hours_played": 145.6,
        "genres": ["Indie", "Simulação", "RPG"],
        "user_rating": 98,
        "rating_label": "Extremamente Positivas",
        "peak_24h_players": 52100,
        "current_price_brl": 24.99,
        "price_formatted": "R$ 24,99",
        "discount_percent": 0,
        "developer": "ConcernedApe",
        "release_year": 2016,
        "achievements_unlocked": 35,
        "total_achievements": 40,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg",
        "short_description": "Você herdou a antiga fazenda do seu avô em Stardew Valley. Com ferramentas de segunda mão e algumas moedas, você parte para começar sua nova vida!"
    },
    "367520": {
        "id": "367520",
        "name": "Hollow Knight",
        "color": "#38bdf8",  # Azul Alma Etéreo
        "hours_played": 98.3,
        "genres": ["Indie", "Metroidvania", "Ação"],
        "user_rating": 97,
        "rating_label": "Extremamente Positivas",
        "peak_24h_players": 14900,
        "current_price_brl": 46.99,
        "price_formatted": "R$ 46,99",
        "discount_percent": 50,
        "developer": "Team Cherry",
        "release_year": 2017,
        "achievements_unlocked": 53,
        "total_achievements": 63,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg",
        "short_description": "Forje seu próprio caminho em Hollow Knight! Uma aventura épica através de um reino arruinado de insetos e heróis repleto de segredos."
    },
    "570": {
        "id": "570",
        "name": "Dota 2",
        "color": "#dc2626",  # Vermelho Carmesim Dota
        "hours_played": 430.7,
        "genres": ["Estratégia", "MOBA", "Competitivo"],
        "user_rating": 82,
        "rating_label": "Muito Positivas",
        "peak_24h_players": 710500,
        "current_price_brl": 0.00,
        "price_formatted": "Gratuito para Jogar",
        "discount_percent": 0,
        "developer": "Valve",
        "release_year": 2013,
        "achievements_unlocked": 0,
        "total_achievements": 0,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg",
        "short_description": "Todos os dias, milhões de jogadores em todo o mundo entram em batalha como um dos mais de cem heróis do Dota."
    },
    "1145360": {
        "id": "1145360",
        "name": "Hades",
        "color": "#e11d48",  # Vermelho Lava Submundo
        "hours_played": 118.0,
        "genres": ["Ação", "Roguelike", "Indie"],
        "user_rating": 98,
        "rating_label": "Extremamente Positivas",
        "peak_24h_players": 16400,
        "current_price_brl": 73.99,
        "price_formatted": "R$ 73,99",
        "discount_percent": 60,
        "developer": "Supergiant Games",
        "release_year": 2020,
        "achievements_unlocked": 49,
        "total_achievements": 49,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/1145360/header.jpg",
        "short_description": "Desafie o deus dos mortos enquanto você corta e batalha para escapar do Submundo neste jogo rogue-like estilo dungeon crawler."
    },
    "553850": {
        "id": "553850",
        "name": "HELLDIVERS™ 2",
        "color": "#fb923c",  # Laranja/Amarelo Democracia
        "hours_played": 142.1,
        "genres": ["Ação", "Tiro", "Cooperativo"],
        "user_rating": 83,
        "rating_label": "Muito Positivas",
        "peak_24h_players": 74800,
        "current_price_brl": 199.50,
        "price_formatted": "R$ 199,50",
        "discount_percent": 0,
        "developer": "Arrowhead Game Studios",
        "release_year": 2024,
        "achievements_unlocked": 31,
        "total_achievements": 38,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/553850/header.jpg",
        "short_description": "A última linha de ataque da galáxia. Aliste-se nos Helldivers e junte-se à luta pela liberdade em uma galáxia hostil em um jogo de tiro frenético."
    },
    "105600": {
        "id": "105600",
        "name": "Terraria",
        "color": "#22c55e",  # Verde Pixel Floresta
        "hours_played": 210.5,
        "genres": ["Ação", "Aventura", "Sandbox"],
        "user_rating": 98,
        "rating_label": "Extremamente Positivas",
        "peak_24h_players": 41200,
        "current_price_brl": 32.99,
        "price_formatted": "R$ 32,99",
        "discount_percent": 50,
        "developer": "Re-Logic",
        "release_year": 2011,
        "achievements_unlocked": 89,
        "total_achievements": 115,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg",
        "short_description": "Cave, lute, explore, construa! Nada é impossível neste jogo de aventura cheio de ação. O mundo é a sua tela e o chão é a sua tinta."
    },
    "289070": {
        "id": "289070",
        "name": "Sid Meier's Civilization® VI",
        "color": "#0284c7",  # Azul Imperial
        "hours_played": 178.4,
        "genres": ["Estratégia", "Turnos", "Simulação"],
        "user_rating": 86,
        "rating_label": "Muito Positivas",
        "peak_24h_players": 32600,
        "current_price_brl": 129.00,
        "price_formatted": "R$ 129,00",
        "discount_percent": 90,
        "developer": "Firaxis Games",
        "release_year": 2016,
        "achievements_unlocked": 62,
        "total_achievements": 120,
        "header_image": "https://cdn.akamai.steamstatic.com/steam/apps/289070/header.jpg",
        "short_description": "Civilization VI oferece novas maneiras de interagir com seu mundo: cidades se expandem fisicamente pelo mapa e pesquisas ativas em tecnologia destravam novos potenciais."
    }
}


# ==============================================================================
# FUNÇÃO AUXILIAR DE CÁLCULO DE ESTATÍSTICAS
# ==============================================================================
def calculate_library_stats(games_dict: Dict[str, dict]) -> dict:
    """Calcula estatísticas agregadas a partir do catálogo de jogos incluindo mapa de cores."""
    games_list = list(games_dict.values())
    if not games_list:
        return {
            "total_games": 0,
            "total_hours": 0.0,
            "avg_rating": 0,
            "most_played_game": None,
            "total_library_value_brl": 0.00,
            "genre_distribution": {},
            "genre_colors": {},
            "top_games": []
        }

    total_hours = round(sum(g["hours_played"] for g in games_list), 1)
    avg_rating = round(sum(g["user_rating"] for g in games_list) / len(games_list), 1)
    total_value = round(sum(g["current_price_brl"] for g in games_list), 2)

    # Identificar jogo mais jogado
    most_played = max(games_list, key=lambda g: g["hours_played"])

    # Distribuição de horas por gênero
    genre_hours: Dict[str, float] = {}
    for game in games_list:
        primary_genre = game["genres"][0] if game["genres"] else "Outros"
        genre_hours[primary_genre] = round(genre_hours.get(primary_genre, 0.0) + game["hours_played"], 1)

    # Ordenar gêneros por maior número de horas
    sorted_genres = dict(sorted(genre_hours.items(), key=lambda item: item[1], reverse=True))

    # Mapear cores para cada gênero presente
    genre_colors = {genre: GENRE_COLORS.get(genre, "#66c0f4") for genre in sorted_genres}

    # Top jogos ordenados por horas
    top_games = sorted(games_list, key=lambda g: g["hours_played"], reverse=True)

    # Tendência dos últimos 6 meses (Maio a Outubro de 2026)
    months = ["Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro"]
    monthly_weights = [0.105, 0.125, 0.205, 0.155, 0.175, 0.235]
    monthly_hours = [round(total_hours * w, 1) for w in monthly_weights]
    growth_rate = round(((monthly_hours[-1] - monthly_hours[0]) / monthly_hours[0]) * 100, 1) if monthly_hours[0] > 0 else 0.0
    semester_avg = round(sum(monthly_hours) / len(monthly_hours), 1)

    monthly_trend = {
        "months": months,
        "hours": monthly_hours,
        "growth_rate_pct": growth_rate,
        "semester_average": semester_avg,
        "peak_month": months[monthly_hours.index(max(monthly_hours))],
        "top_games": [
            top_games[0]["name"] if len(top_games) > 0 else "Nenhum",
            top_games[1]["name"] if len(top_games) > 1 else "Nenhum",
            top_games[3]["name"] if len(top_games) > 3 else "Nenhum",
            top_games[2]["name"] if len(top_games) > 2 else "Nenhum",
            top_games[4]["name"] if len(top_games) > 4 else "Nenhum",
            top_games[0]["name"] if len(top_games) > 0 else "Nenhum",
        ]
    }

    return {
        "total_games": len(games_list),
        "total_hours": total_hours,
        "avg_rating": avg_rating,
        "most_played_game": {
            "id": most_played["id"],
            "name": most_played["name"],
            "color": most_played.get("color", "#f97316"),
            "hours_played": most_played["hours_played"],
            "header_image": most_played["header_image"],
            "rating_label": most_played["rating_label"]
        },
        "total_library_value_brl": total_value,
        "genre_distribution": sorted_genres,
        "genre_colors": genre_colors,
        "monthly_trend": monthly_trend,
        "top_games": top_games
    }


# ==============================================================================
# ROTAS DA API
# ==============================================================================

@app.get("/", response_class=HTMLResponse)
async def serve_home(request: Request):
    """
    Renderiza a interface principal HTML com Jinja2.
    """
    stats = calculate_library_stats(GAMES_DATABASE)
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "request": request,
            "stats": stats,
            "games": list(GAMES_DATABASE.values())
        }
    )


@app.get("/api/stats")
async def get_library_stats():
    """
    Retorna métricas consolidadas da biblioteca com mapeamento cromático:
    - Total de horas jogadas
    - Jogo mais jogado e sua cor tema
    - Avaliação média da biblioteca
    - Distribuição de horas por gênero e suas respectivas cores
    - Top jogos ordenados por horas com cores individuais
    """
    try:
        return calculate_library_stats(GAMES_DATABASE)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar estatísticas da biblioteca: {str(e)}")


@app.get("/api/game/{game_id}")
async def get_game_details(game_id: str):
    """
    Retorna detalhes completos de um jogo específico pelo seu ID (AppID):
    - Nome, cor tema e capa
    - Avaliação e percentual de recomendação
    - Pico de jogadores simultâneos nas últimas 24h
    - Preço atual e desconto
    - Conquistas desbloqueadas
    """
    game = GAMES_DATABASE.get(game_id)
    if not game:
        raise HTTPException(
            status_code=404,
            detail=f"Jogo com ID '{game_id}' não encontrado na base de dados."
        )
    return game


@app.get("/api/games")
async def list_games(
    search: Optional[str] = Query(None, description="Filtrar por nome do jogo"),
    genre: Optional[str] = Query(None, description="Filtrar por gênero"),
    sort_by: Optional[str] = Query("hours", description="Ordenar por: hours, rating, price, name, players")
):
    """
    Lista todos os jogos cadastrados com suporte a busca, filtro por gênero e ordenação.
    """
    games = list(GAMES_DATABASE.values())

    if search:
        search_lower = search.lower().strip()
        games = [g for g in games if search_lower in g["name"].lower() or search_lower in g["developer"].lower()]

    if genre and genre != "Todos":
        games = [g for g in games if genre in g["genres"]]

    # Ordenação
    if sort_by == "hours":
        games.sort(key=lambda x: x["hours_played"], reverse=True)
    elif sort_by == "rating":
        games.sort(key=lambda x: x["user_rating"], reverse=True)
    elif sort_by == "price":
        games.sort(key=lambda x: x["current_price_brl"], reverse=True)
    elif sort_by == "name":
        games.sort(key=lambda x: x["name"].lower())
    elif sort_by == "players":
        games.sort(key=lambda x: x["peak_24h_players"], reverse=True)

    return {"total": len(games), "games": games}


@app.get("/api/health")
async def health_check():
    """Endpoint de checagem de integridade para monitoramento (Render/UptimeRobot)."""
    return {"status": "ok", "service": "steam-analytics-api", "version": "1.0.0"}


# ==============================================================================
# PONTO DE ENTRADA PARA EXECUÇÃO DIRETA (python main.py)
# ==============================================================================
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"[*] Iniciando Steam Analytics Dashboard em http://0.0.0.0:{port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
