
import { useEffect, useMemo, useState } from "react";

import Header from "./Components/Header";
import GameCard from "./Components/GameCard";
import GameModal from "./Components/GameModal";

import { games, categories } from "./data/games";

import "./App.css";

function App() {
  const [language, setLanguage] = useState("fa");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("gameyab-favorites") || "[]"
      );
    } catch {
      return [];
    }
  });

  const isPersian = language === "fa";

  const t = {
    fa: {
      eyebrow: "دنیای بازی‌ها، به انتخاب تو",
      title: "بازی بعدی خودت رو پیدا کن",
      subtitle:
        "بازی‌های محبوب رو کشف کن، مشخصاتشون رو ببین و بازی مناسب خودت رو انتخاب کن.",
      library: "کتابخانه بازی‌ها",
      all: "همه بازی‌ها",
      favorites: "علاقه‌مندی‌ها",
      search: "جست‌وجوی نام بازی...",
      count: "بازی",
      noResults: "بازی‌ای پیدا نشد!",
      noResultsDescription:
        "عبارت جست‌وجو یا دسته‌بندی رو تغییر بده.",
      noFavorites: "هنوز بازی‌ای به علاقه‌مندی‌هات اضافه نکردی.",
      reset: "نمایش همه بازی‌ها",
      explore: "مشاهده بازی‌ها",
      backToTop: "رفتن به بالای صفحه",
    },
    en: {
      eyebrow: "GAMES, YOUR WAY",
      title: "Find your next game",
      subtitle:
        "Discover popular games, explore their details, and find your next favorite.",
      library: "Game Library",
      all: "All Games",
      favorites: "Favorites",
      search: "Search games...",
      count: "games",
      noResults: "No games found!",
      noResultsDescription:
        "Try another search term or category.",
      noFavorites: "You haven't added any favorite games yet.",
      reset: "Show all games",
      explore: "Explore games",
      backToTop: "Back to top",
    },
  }[isPersian ? "fa" : "en"];

  const categoryName = (item) => {
    if (item.id === "all") return t.all;
    return isPersian ? item.fa : item.en;
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function toggleFavorite(gameId) {
    setFavorites((previous) => {
      const updated = previous.includes(gameId)
        ? previous.filter((id) => id !== gameId)
        : [...previous, gameId];

      try {
        localStorage.setItem(
          "gameyab-favorites",
          JSON.stringify(updated)
        );
      } catch {
        // Favorites still work during this session.
      }

      return updated;
    });
  }

  const filteredGames = useMemo(() => {
    const query = search.trim().toLowerCase();

    return games.filter((game) => {
      const matchesSearch =
        !query ||
        [
          game.name,
          game.fa,
          game.desc,
          game.descFa,
          game.category,
          game.platform,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesCategory =
        category === "all" || game.category === category;

      const matchesFavorites =
        !showFavorites || favorites.includes(game.id);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesFavorites
      );
    });
  }, [search, category, showFavorites, favorites]);

  function resetFilters() {
    setSearch("");
    setCategory("all");
    setShowFavorites(false);
  }

  function handleFavoritesClick() {
    setShowFavorites((previous) => !previous);
    setCategory("all");
    setSearch("");
  }

  return (
    <div
      className={`App ${isPersian ? "app-fa" : "app-en"}`}
      dir={isPersian ? "rtl" : "ltr"}
    >
      <Header
        language={language}
        setLanguage={setLanguage}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        favoritesCount={favorites.length}
      />

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="hero-eyebrow">
              {t.eyebrow}
            </span>

            <h1>{t.title}</h1>

            <p>{t.subtitle}</p>

            <a className="hero-cta" href="#game-library">
              {t.explore}
              <span aria-hidden="true"> ↙</span>
            </a>
          </div>
        </section>

        <section
          className="library-section"
          id="game-library"
        >
          <div className="library-heading">
            <div>
              <h2>{t.library}</h2>
              <p>
                {filteredGames.length} {t.count}
              </p>
            </div>
          </div>

          <div className="library-controls">
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder={t.search}
                aria-label={t.search}
              />
            </label>

            <button
              type="button"
              className={`favorites-filter ${
                showFavorites ? "active" : ""
              }`}
              onClick={handleFavoritesClick}
              aria-pressed={showFavorites}
            >
              ♥ {t.favorites}
            </button>
          </div>

          <div className="category-list">
            {categories.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`category-chip ${
                  category === item.id ? "active" : ""
                }`}
                onClick={() => {
                  setCategory(item.id);
                  setShowFavorites(false);
                }}
              >
                {categoryName(item)}
              </button>
            ))}
          </div>

          {filteredGames.length > 0 ? (
            <div className="games-grid">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  language={language}
                  isFavorite={favorites.includes(game.id)}
                  onToggleFavorite={() =>
                    toggleFavorite(game.id)
                  }
                  onOpen={() => setSelectedGame(game)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">🎮</span>

              <h3>
                {showFavorites && favorites.length === 0
                  ? t.noFavorites
                  : t.noResults}
              </h3>

              <p>{t.noResultsDescription}</p>

              <button
                type="button"
                onClick={resetFilters}
              >
                {t.reset}
              </button>
            </div>
          )}
        </section>
      </main>

      {selectedGame && (
        <GameModal
          game={selectedGame}
          language={language}
          isFavorite={favorites.includes(selectedGame.id)}
          onToggleFavorite={() =>
            toggleFavorite(selectedGame.id)
          }
          onClose={() => setSelectedGame(null)}
        />
      )}

      {showBackToTop && (
        <button
          type="button"
          className="back-to-top"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          aria-label={t.backToTop}
          title={t.backToTop}
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default App;
