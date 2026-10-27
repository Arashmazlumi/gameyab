import React, { useEffect } from "react";
import { getGameImage } from "../data/gameImages";

export default function GameModal({
  game,
  language,
  isFavorite,
  onToggleFavorite,
  onClose
}) {
  const fa = language === "fa";
  const image = getGameImage(game);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="game-modal"
        role="dialog"
        aria-modal="true"
        aria-label={fa ? game.fa : game.name}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-cover">
          {image ? (
            <img
              src={image}
              alt={game.name}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span className="modal-emoji">{game.emoji}</span>
          )}
        </div>

        <div className="modal-content">
          <span className="eyebrow">
            {fa ? "معرفی بازی" : "GAME OVERVIEW"}
          </span>

          <h2>{fa ? game.fa : game.name}</h2>

          {fa && <p className="english-name">{game.name}</p>}

          <div className="modal-stats">
            <span>★ {game.rating.toFixed(1)} / 10</span>
            <span>{game.year}</span>
            <span>{game.platform}</span>
          </div>

          <p className="modal-description">
            {fa ? game.descFa : game.desc}
          </p>

          <div className="modal-actions">
            <button className="primary-button" onClick={onToggleFavorite}>
              {isFavorite
                ? (fa ? "♥ حذف از علاقه‌مندی‌ها" : "♥ Remove favorite")
                : (fa ? "♡ افزودن به علاقه‌مندی‌ها" : "♡ Add to favorites")}
            </button>

            {game.steamId && (
              <a
                className="secondary-button"
                href={`https://store.steampowered.com/app/${game.steamId}/`}
                target="_blank"
                rel="noreferrer"
              >
                {fa ? "مشاهده در Steam ↗" : "View on Steam ↗"}
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}