import React from "react";

export default function Header({
  language,
  setLanguage,
  showFavorites,
  setShowFavorites,
  favoritesCount
}) {
  const fa = language === "fa";

  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="GameYab home">
        <span className="brand-icon">G</span>
        <span>Game<span className="brand-accent">Yab</span></span>
      </a>

      <nav className="header-nav">
        <button
          className={!showFavorites ? "nav-link active" : "nav-link"}
          onClick={() => setShowFavorites(false)}
        >
          {fa ? "بازی‌ها" : "Games"}
        </button>

        <button
          className={showFavorites ? "nav-link active" : "nav-link"}
          onClick={() => setShowFavorites(true)}
        >
          {fa ? "علاقه‌مندی‌ها" : "Favorites"}
          <span className="favorite-count">{favoritesCount}</span>
        </button>
      </nav>

      <button
        className="language-button"
        onClick={() => setLanguage(fa ? "en" : "fa")}
        aria-label="Change language"
      >
        <span>◎</span> {fa ? "English" : "فارسی"}
      </button>
    </header>
  );
}