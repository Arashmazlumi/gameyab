export function getGameImage(game) {
  if (!game?.steamId) return "";

  return `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.steamId}/header.jpg`;
}