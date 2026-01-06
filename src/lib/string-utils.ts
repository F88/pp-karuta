/**
 * @fileoverview String normalization utilities for text matching
 * Provides functions to normalize Japanese and alphanumeric characters for consistent text comparison.
 */

/**
 * Convert half-width katakana to full-width katakana
 *
 * Handles the conversion of half-width katakana characters (U+FF61-U+FF9F) to their
 * full-width equivalents, including proper combination of dakuten (゛) and handakuten (゜)
 * with preceding characters.
 *
 * @param str - String containing half-width katakana
 * @returns String with full-width katakana
 *
 * @example
 * ```typescript
 * convertHalfWidthKatakanaToFullWidth('ｳﾏ'); // returns 'ウマ'
 * convertHalfWidthKatakanaToFullWidth('ﾍﾋﾞ'); // returns 'ヘビ'
 * convertHalfWidthKatakanaToFullWidth('ﾋﾂｼﾞ'); // returns 'ヒツジ'
 * ```
 */
export function convertHalfWidthKatakanaToFullWidth(str: string): string {
  const halfToFullMap: Record<string, string> = {
    ｦ: 'ヲ',
    ｧ: 'ァ',
    ｨ: 'ィ',
    ｩ: 'ゥ',
    ｪ: 'ェ',
    ｫ: 'ォ',
    ｬ: 'ャ',
    ｭ: 'ュ',
    ｮ: 'ョ',
    ｯ: 'ッ',
    ｰ: 'ー',
    ｱ: 'ア',
    ｲ: 'イ',
    ｳ: 'ウ',
    ｴ: 'エ',
    ｵ: 'オ',
    ｶ: 'カ',
    ｷ: 'キ',
    ｸ: 'ク',
    ｹ: 'ケ',
    ｺ: 'コ',
    ｻ: 'サ',
    ｼ: 'シ',
    ｽ: 'ス',
    ｾ: 'セ',
    ｿ: 'ソ',
    ﾀ: 'タ',
    ﾁ: 'チ',
    ﾂ: 'ツ',
    ﾃ: 'テ',
    ﾄ: 'ト',
    ﾅ: 'ナ',
    ﾆ: 'ニ',
    ﾇ: 'ヌ',
    ﾈ: 'ネ',
    ﾉ: 'ノ',
    ﾊ: 'ハ',
    ﾋ: 'ヒ',
    ﾌ: 'フ',
    ﾍ: 'ヘ',
    ﾎ: 'ホ',
    ﾏ: 'マ',
    ﾐ: 'ミ',
    ﾑ: 'ム',
    ﾒ: 'メ',
    ﾓ: 'モ',
    ﾔ: 'ヤ',
    ﾕ: 'ユ',
    ﾖ: 'ヨ',
    ﾗ: 'ラ',
    ﾘ: 'リ',
    ﾙ: 'ル',
    ﾚ: 'レ',
    ﾛ: 'ロ',
    ﾜ: 'ワ',
    ﾝ: 'ン',
    ﾞ: '゛',
    ﾟ: '゜',
  };

  const dakutenMap: Record<string, string> = {
    カ: 'ガ',
    キ: 'ギ',
    ク: 'グ',
    ケ: 'ゲ',
    コ: 'ゴ',
    サ: 'ザ',
    シ: 'ジ',
    ス: 'ズ',
    セ: 'ゼ',
    ソ: 'ゾ',
    タ: 'ダ',
    チ: 'ヂ',
    ツ: 'ヅ',
    テ: 'デ',
    ト: 'ド',
    ハ: 'バ',
    ヒ: 'ビ',
    フ: 'ブ',
    ヘ: 'ベ',
    ホ: 'ボ',
  };

  const handakutenMap: Record<string, string> = {
    ハ: 'パ',
    ヒ: 'ピ',
    フ: 'プ',
    ヘ: 'ペ',
    ホ: 'ポ',
  };

  return str
    .replace(/[\uFF61-\uFF9F]/g, (ch) => halfToFullMap[ch] || ch)
    .replace(
      /([カ-コサ-ソタ-トハ-ホ])゛/g,
      (_, base) => dakutenMap[base] || base + '゛',
    )
    .replace(/([ハ-ホ])゜/g, (_, base) => handakutenMap[base] || base + '゜');
}

/**
 * Convert full-width alphanumeric characters to half-width
 *
 * Converts full-width alphanumeric characters (U+FF10-U+FF5A) to their half-width
 * ASCII equivalents. Handles uppercase letters (A-Z), lowercase letters (a-z),
 * and digits (0-9).
 *
 * @param str - String containing full-width alphanumeric characters
 * @returns String with half-width alphanumeric characters
 *
 * @example
 * ```typescript
 * convertFullWidthAlphanumericToHalfWidth('ＵＭＡ'); // returns 'UMA'
 * convertFullWidthAlphanumericToHalfWidth('１２３'); // returns '123'
 * convertFullWidthAlphanumericToHalfWidth('ＡＢＣ１２３'); // returns 'ABC123'
 * ```
 */
export function convertFullWidthAlphanumericToHalfWidth(str: string): string {
  return str.replace(/[\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A]/g, (ch) => {
    return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
  });
}

/**
 * Normalize string for text matching
 *
 * Performs comprehensive string normalization to enable consistent text matching
 * across different character encodings and cases:
 * 1. Converts full-width alphanumeric characters to half-width (ＵＭＡ → UMA)
 * 2. Converts half-width katakana to full-width with dakuten/handakuten combination (ｳﾏ → ウマ, ﾋﾞ → ビ)
 * 3. Converts all characters to lowercase (UMA → uma)
 *
 * This function is idempotent - applying it multiple times produces the same result.
 *
 * @param str - String to normalize
 * @returns Normalized string suitable for case-insensitive matching
 *
 * @example
 * ```typescript
 * normalizeString('ＵＭＡ'); // returns 'uma'
 * normalizeString('ｳﾏ'); // returns 'ウマ'
 * normalizeString('ＵＭＡｳﾏ'); // returns 'umaウマ'
 * normalizeString('Snake１２３ｳﾏ'); // returns 'snake123ウマ'
 * ```
 */
export function normalizeString(str: string): string {
  return convertHalfWidthKatakanaToFullWidth(
    convertFullWidthAlphanumericToHalfWidth(str),
  ).toLowerCase();
}

/**
 * Truncate a string to a specified maximum length and append ellipsis if truncated
 *
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation
 * @param ellipsis - String to append when truncated (defaults to '...')
 * @returns Truncated string with ellipsis if needed, or original string if within limit
 *
 * @example
 * ```typescript
 * truncateString('Hello World', 5); // returns 'Hello...'
 * truncateString('Short', 10); // returns 'Short'
 * truncateString('プレイヤー名前', 6); // returns 'プレイヤー名前...'
 * truncateString('Test', 5, '…'); // returns 'Test'
 * ```
 */
export function truncateString(
  str: string,
  maxLength: number,
  ellipsis: string = '...',
): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + ellipsis;
}
