export function stripEmojis(str: string | undefined | null): string {
  if (!str) return '';
  return str.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
}
