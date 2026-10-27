import React from "react";
import { getGameImage } from "../data/gameImages";

export default function GameCard({
  game,
  language,
  isFavorite,
  onToggleFavorite,
  onOpen
}) {
  const fa = language === "fa";
  const image = getGameImage(game);

  return (
    <article className="game-card">
      <button
        className="game-cover"
        onClick={onOpen}
        aria-label={fa ? `جزئیات ${game.fa}` : `Details for ${game.name}`}
      >
        {image ? (
          <img
            src={image}
            alt={game.name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.nextElementSibling.style.display = "grid";
            }}
          />
        ) : null}

        <span
          className="cover-fallback"
          style={{ display: image ? "none" : "grid" }}
        >
          {game.emoji}
        </span>

        <span className="cover-rating">★ {game.rating.toFixed(1)}</span>
      </button>

      <div className="game-card-content">
        <div className="game-card-topline">
          <span className="game-year">{game.year}</span>

          <button
            className={`favorite-button ${isFavorite ? "favorited" : ""}`}
            onClick={onToggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? "♥" : "♡"}
          </button>
        </div>

        <h3>{fa ? game.fa : game.name}</h3>
        {fa && <p className="english-name">{game.name}</p>}

        <p className="game-description">
          {fa ? game.descFa : game.desc}
        </p>

        <div className="game-card-bottom">
          <span className="platform-label">{game.platform}</span>
          <button className="details-button" onClick={onOpen}>
            {fa ? "جزئیات ←" : "Details →"}
          </button>
        </div>
      </div>
    </article>
  );
}