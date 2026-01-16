import { describe, it, expect } from 'vitest';

import {
  normalizeString,
  convertHalfWidthKatakanaToFullWidth,
  convertFullWidthAlphanumericToHalfWidth,
} from './string-utils';

describe('convertHalfWidthKatakanaToFullWidth', () => {
  describe('basic katakana conversion', () => {
    it('should convert half-width katakana to full-width', () => {
      expect(convertHalfWidthKatakanaToFullWidth('ｳﾏ')).toBe('ウマ');
      expect(convertHalfWidthKatakanaToFullWidth('ﾍﾋﾞ')).toBe('ヘビ');
      expect(convertHalfWidthKatakanaToFullWidth('ﾋﾂｼﾞ')).toBe('ヒツジ');
    });

    it('should preserve full-width katakana', () => {
      expect(convertHalfWidthKatakanaToFullWidth('ウマ')).toBe('ウマ');
      expect(convertHalfWidthKatakanaToFullWidth('ヘビ')).toBe('ヘビ');
    });

    it('should handle small katakana characters', () => {
      expect(convertHalfWidthKatakanaToFullWidth('ｧｨｩｪｫ')).toBe('ァィゥェォ');
      expect(convertHalfWidthKatakanaToFullWidth('ｬｭｮ')).toBe('ャュョ');
      expect(convertHalfWidthKatakanaToFullWidth('ｯ')).toBe('ッ');
    });
  });

  describe('dakuten and handakuten combination', () => {
    it('should combine dakuten with base characters', () => {
      expect(convertHalfWidthKatakanaToFullWidth('ｶﾞｷﾞｸﾞｹﾞｺﾞ')).toBe(
        'ガギグゲゴ',
      );
      expect(convertHalfWidthKatakanaToFullWidth('ｻﾞｼﾞｽﾞｾﾞｿﾞ')).toBe(
        'ザジズゼゾ',
      );
      expect(convertHalfWidthKatakanaToFullWidth('ﾀﾞﾁﾞﾂﾞﾃﾞﾄﾞ')).toBe(
        'ダヂヅデド',
      );
      expect(convertHalfWidthKatakanaToFullWidth('ﾊﾞﾋﾞﾌﾞﾍﾞﾎﾞ')).toBe(
        'バビブベボ',
      );
    });

    it('should combine handakuten with base characters', () => {
      expect(convertHalfWidthKatakanaToFullWidth('ﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ')).toBe(
        'パピプペポ',
      );
    });
  });

  describe('mixed content', () => {
    it('should handle mixed Japanese and other characters', () => {
      expect(convertHalfWidthKatakanaToFullWidth('馬ｳﾏ')).toBe('馬ウマ');
      expect(convertHalfWidthKatakanaToFullWidth('UMAｳﾏ')).toBe('UMAウマ');
    });

    it('should preserve non-katakana characters', () => {
      expect(convertHalfWidthKatakanaToFullWidth('ABC123')).toBe('ABC123');
      expect(convertHalfWidthKatakanaToFullWidth('こんにちは')).toBe(
        'こんにちは',
      );
    });
  });
});

describe('convertFullWidthAlphanumericToHalfWidth', () => {
  describe('uppercase letters', () => {
    it('should convert full-width uppercase to half-width', () => {
      expect(convertFullWidthAlphanumericToHalfWidth('ＵＭＡ')).toBe('UMA');
      expect(convertFullWidthAlphanumericToHalfWidth('ＨＯＲＳＥ')).toBe(
        'HORSE',
      );
      expect(convertFullWidthAlphanumericToHalfWidth('ＡＢＣＤＥＦＧ')).toBe(
        'ABCDEFG',
      );
    });

    it('should preserve half-width uppercase', () => {
      expect(convertFullWidthAlphanumericToHalfWidth('UMA')).toBe('UMA');
      expect(convertFullWidthAlphanumericToHalfWidth('HORSE')).toBe('HORSE');
    });
  });

  describe('lowercase letters', () => {
    it('should convert full-width lowercase to half-width', () => {
      expect(convertFullWidthAlphanumericToHalfWidth('ｕｍａ')).toBe('uma');
      expect(convertFullWidthAlphanumericToHalfWidth('ｈｏｒｓｅ')).toBe(
        'horse',
      );
    });

    it('should preserve half-width lowercase', () => {
      expect(convertFullWidthAlphanumericToHalfWidth('uma')).toBe('uma');
      expect(convertFullWidthAlphanumericToHalfWidth('horse')).toBe('horse');
    });
  });

  describe('numbers', () => {
    it('should convert full-width numbers to half-width', () => {
      expect(convertFullWidthAlphanumericToHalfWidth('１２３')).toBe('123');
      expect(convertFullWidthAlphanumericToHalfWidth('４５６７８９０')).toBe(
        '4567890',
      );
    });

    it('should preserve half-width numbers', () => {
      expect(convertFullWidthAlphanumericToHalfWidth('123')).toBe('123');
      expect(convertFullWidthAlphanumericToHalfWidth('4567890')).toBe(
        '4567890',
      );
    });
  });

  describe('mixed content', () => {
    it('should handle mixed alphanumeric characters', () => {
      expect(convertFullWidthAlphanumericToHalfWidth('ＡＢＣ１２３')).toBe(
        'ABC123',
      );
      expect(convertFullWidthAlphanumericToHalfWidth('ｕｍａ４５６')).toBe(
        'uma456',
      );
    });

    it('should preserve non-alphanumeric characters', () => {
      expect(convertFullWidthAlphanumericToHalfWidth('ウマ')).toBe('ウマ');
      expect(convertFullWidthAlphanumericToHalfWidth('漢字')).toBe('漢字');
      expect(convertFullWidthAlphanumericToHalfWidth('!@#$%')).toBe('!@#$%');
    });
  });
});

describe('normalizeString', () => {
  describe('half-width katakana to full-width katakana conversion', () => {
    it('should convert half-width katakana to full-width', () => {
      expect(normalizeString('ｳﾏ')).toBe('ウマ');
      expect(normalizeString('ﾍﾋﾞ')).toBe('ヘビ');
      expect(normalizeString('ﾋﾂｼﾞ')).toBe('ヒツジ');
    });

    it('should preserve full-width katakana', () => {
      expect(normalizeString('ウマ')).toBe('ウマ');
      expect(normalizeString('ヘビ')).toBe('ヘビ');
    });
  });

  describe('full-width alphanumeric to half-width conversion', () => {
    it('should convert full-width alphabets to half-width', () => {
      expect(normalizeString('ＵＭＡ')).toBe('uma');
      expect(normalizeString('ＨＯＲＳＥ')).toBe('horse');
      expect(normalizeString('ｕｍａ')).toBe('uma');
    });

    it('should convert full-width numbers to half-width', () => {
      expect(normalizeString('１２３')).toBe('123');
      expect(normalizeString('４５６７８９０')).toBe('4567890');
    });

    it('should preserve half-width alphanumeric', () => {
      expect(normalizeString('uma')).toBe('uma');
      expect(normalizeString('123')).toBe('123');
    });
  });

  describe('case conversion', () => {
    it('should convert uppercase to lowercase', () => {
      expect(normalizeString('UMA')).toBe('uma');
      expect(normalizeString('HORSE')).toBe('horse');
      expect(normalizeString('Snake')).toBe('snake');
    });

    it('should preserve lowercase', () => {
      expect(normalizeString('uma')).toBe('uma');
      expect(normalizeString('horse')).toBe('horse');
    });
  });

  describe('combined transformations', () => {
    it('should handle full-width alphabet + half-width katakana', () => {
      expect(normalizeString('ＵＭＡｳﾏ')).toBe('umaウマ');
    });

    it('should handle mixed case + full-width numbers + katakana', () => {
      expect(normalizeString('Snake１２３ｳﾏ')).toBe('snake123ウマ');
    });

    it('should handle complex real-world examples', () => {
      expect(normalizeString('ＨＯＲＳＥ')).toBe('horse');
      expect(normalizeString('ｳﾏ')).toBe('ウマ');
      expect(normalizeString('ﾋﾂｼﾞ')).toBe('ヒツジ');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      expect(normalizeString('')).toBe('');
    });

    it('should handle strings with no transformable characters', () => {
      expect(normalizeString('こんにちは')).toBe('こんにちは');
      expect(normalizeString('漢字')).toBe('漢字');
    });

    it('should handle mixed Japanese and English', () => {
      expect(normalizeString('馬ＨＯＲＳＥ')).toBe('馬horse');
      expect(normalizeString('蛇ｳﾏ')).toBe('蛇ウマ');
    });

    it('should handle symbols and special characters', () => {
      expect(normalizeString('🐴')).toBe('🐴');
      expect(normalizeString('🐍')).toBe('🐍');
      expect(normalizeString('!@#$%')).toBe('!@#$%');
    });
  });

  describe('idempotency', () => {
    it('should produce same result when applied twice', () => {
      const input = 'ＵＭＡｳﾏ123';
      const firstPass = normalizeString(input);
      const secondPass = normalizeString(firstPass);
      expect(firstPass).toBe(secondPass);
    });

    it('should be idempotent for various inputs', () => {
      const inputs = ['ＵＭＡ', 'ｳﾏ', 'ＨＯＲＳＥ', '１２３', 'Snake'];
      inputs.forEach((input) => {
        const first = normalizeString(input);
        const second = normalizeString(first);
        expect(first).toBe(second);
      });
    });
  });
});
