import React, { useMemo, useState } from "react";
import Header from "./Components/Header";
import GameCard from "./Components/GameCard";
import GameModal from "./Components/GameModal";
import { games, categories } from "./data/games";
import "./App.css";

export default function App() {
  const [language, setLanguageState] = useState(
    () => localStorage.getItem("gameyab-language") || "fa"
  );

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gameyab-favorites") || "[]");
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [selectedGame, setSelectedGame] = useState(null);

  const fa = language === "fa";

  function setLanguage(value) {
    setLanguageState(value);
    localStorage.setItem("gameyab-language", value);
  }

  function toggleFavorite(gameId) {
    setFavorites((current) => {
      const next = current.includes(gameId)
        ? current.filter((id) => id !== gameId)
        : [...current, gameId];

      localStorage.setItem("gameyab-favorites", JSON.stringify(next));
      return next;
    });
  }

  const filteredGames = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = games.filter((game) => {
      const matchesSearch =
        !query ||
        game.name.toLowerCase().includes(query) ||
        game.fa.toLowerCase().includes(query) ||
        game.desc.toLowerCase().includes(query) ||
        game.descFa.toLowerCase().includes(query) ||
        game.platform.toLowerCase().includes(query) ||
        String(game.year).includes(query);

      const matchesCategory =
        activeCategory === "all" || game.category === activeCategory;

      const matchesFavorites =
        !showFavorites || favorites.includes(game.id);

      return matchesSearch && matchesCategory && matchesFavorites;
    });

    return result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return b.year - a.year;
      if (sortBy === "oldest") return a.year - b.year;

      return (fa ? a.fa : a.name).localeCompare(
        fa ? b.fa : b.name,
        fa ? "fa" : "en"
      );
    });
  }, [
    search,
    activeCategory,
    showFavorites,
    favorites,
    sortBy,
    fa
  ]);

  return (
    <div className={`app-shell ${fa ? "lang-fa" : "lang-en"}`} dir={fa ? "rtl" : "ltr"}>
      <Header
        language={language}
        setLanguage={setLanguage}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        favoritesCount={favorites.length}
      />

      <main id="home">
        <section className="hero-section">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />

          <div className="hero-content">
            <span className="eyebrow">
              {fa ? "دنیای بازی، یک‌جا" : "YOUR GAMING UNIVERSE"}
            </span>

            <h1>
              {fa ? (
                <>بازی بعدی‌ات رو <span>پیدا کن.</span></>
              ) : (
                <>Find your next <span>adventure.</span></>
              )}
            </h1>

            <p>
              {fa
                ? "بازی‌های محبوبت رو کشف کن، جست‌وجو کن و لیست علاقه‌مندی‌هات رو بساز."
                : "Discover games, explore new worlds, and build your personal favorites list."}
            </p>

            <a href="#game-library" className="primary-button hero-button">
              {fa ? "کشف بازی‌ها ↓" : "Explore games ↓"}
            </a>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="hero-controller">🎮</div>
            <span className="floating-symbol symbol-one">✦</span>
            <span className="floating-symbol symbol-two">＋</span>
            <span className="floating-symbol symbol-three">◈</span>
          </div>

          <div className="hero-bottom-label">
            <span className="status-dot" />
            {fa ? `${games.length} بازی برای کشف` : `${games.length} games to explore`}
          </div>
        </section>

        <section className="library-section" id="game-library">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {fa ? "کتابخانه بازی‌ها" : "THE COLLECTION"}
              </span>
              <h2>
                {showFavorites
                  ? (fa ? "علاقه‌مندی‌های من" : "My Favorites")
                  : (fa ? "بازی‌ها رو کشف کن" : "Explore Games")}
              </h2>
            </div>

            <span className="result-count">
              {filteredGames.length} {fa ? "بازی" : "games"}
            </span>
          </div>

          <div className="search-toolbar">
            <label className="search-box">
              <span>⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={fa ? "نام بازی یا سال انتشار..." : "Search games or release year..."}
                aria-label={fa ? "جست‌وجوی بازی" : "Search games"}
              />
              {search && (
                <button onClick={() => setSearch("")} aria-label="Clear search">
                  ×
                </button>
              )}
            </label>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label={fa ? "مرتب‌سازی" : "Sort games"}
            >
              <option value="rating">{fa ? "بالاترین امتیاز" : "Top rated"}</option>
              <option value="newest">{fa ? "جدیدترین" : "Newest"}</option>
              <option value="oldest">{fa ? "قدیمی‌ترین" : "Oldest"}</option>
              <option value="name">{fa ? "ترتیب نام" : "Name A–Z"}</option>
            </select>
          </div>

          {!showFavorites && (
            <div className="category-list">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-chip ${
                    activeCategory === category.id ? "selected" : ""
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {fa ? category.fa : category.en}
                </button>
              ))}
            </div>
          )}

          {filteredGames.length > 0 ? (
            <div className="games-grid">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  language={language}
                  isFavorite={favorites.includes(game.id)}
                  onToggleFavorite={() => toggleFavorite(game.id)}
                  onOpen={() => setSelectedGame(game)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">
                {showFavorites ? "♡" : "⌕"}
              </span>
              <h3>
                {showFavorites
                  ? (fa ? "هنوز بازی‌ای ذخیره نکردی" : "No favorites yet")
                  : (fa ? "بازی‌ای پیدا نشد!" : "No games found")}
              </h3>
              <p>
                {showFavorites
                  ? (fa ? "با زدن قلب روی کارت بازی‌ها، اون‌ها رو اینجا ذخیره کن." : "Tap the heart on a game card to save it here.")
                  : (fa ? "عبارت جست‌وجو یا دسته‌بندی رو تغییر بده." : "Try another search or category.")}
              </p>

              <button
                className="secondary-button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                  setShowFavorites(false);
                }}
              >
                {fa ? "نمایش همه بازی‌ها" : "Show all games"}
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">G</span>
          <span>Game<span className="brand-accent">Yab</span></span>
        </a>

        <p>
          {fa
            ? "برای گیمرها ساخته شده؛ با عشق به بازی‌ها."
            : "Made for gamers, powered by a love of games."}
        </p>

        <span className="footer-copy">© {new Date().getFullYear()} GameYab</span>
      </footer>

      {selectedGame && (
        <GameModal
          game={selectedGame}
          language={language}
          isFavorite={favorites.includes(selectedGame.id)}
          onToggleFavorite={() => toggleFavorite(selectedGame.id)}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
}