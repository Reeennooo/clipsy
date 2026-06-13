export function checkReelUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    const isInstagram =
      parsed.hostname === "www.instagram.com" ||
      parsed.hostname === "instagram.com";

    if (!isInstagram) return false;

    // убираем возможные query-параметры и нормализуем путь
    const path = parsed.pathname;

    // строго проверяем формат /reel/{id}/
    const reelRegex = /^\/reel\/[A-Za-z0-9_-]+\/?$/;

    return reelRegex.test(path);
  } catch {
    return false;
  }
}