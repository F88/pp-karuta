/**
 * @fileoverview ETO (Chinese zodiac) themed deck recipes
 *
 * This module provides deck recipes based on Chinese zodiac animals.
 * Each recipe filters prototypes containing zodiac-related keywords.
 *
 * @module DeckRecipeETO
 */

import { ALL_PROTOTYPES } from './deck-recipe';
import { createKeywordFilter } from './filter-factory';

import type { DeckRecipe } from '@/models/karuta';

/**
 * Base configuration for ETO (Chinese zodiac) themed recipes
 * - Fetches all prototypes for filtering
 * - Intermediate difficulty level
 * - Tagged with '干支' (zodiac)
 */
const DECK_ETO_BASE: Pick<DeckRecipe, 'apiParams' | 'difficulty' | 'tags'> = {
  apiParams: { ...ALL_PROTOTYPES },
  difficulty: 'intermediate',
  tags: ['干支'],
};

/**
 * ETO recipe for Rat (子) themed prototypes
 * Filters prototypes containing rat/mouse-related keywords in Japanese and English
 */
export const DECK_ETO_NE: DeckRecipe = {
  ...DECK_ETO_BASE,
  id: 'eto-ne',
  title: '🐁 子',
  description: 'ねずみにちなむ',
  filter: createKeywordFilter([
    //
    '🐁',
    '🐭',
    '🪤',
    '🖱️',
    '子',
    '鼠',
    'ねずみ',
    'ネズミ',
    'チュー',
    'チュウ',
    'ハムスター',
    'モルモット',
    'MOUSE',
    'MICKY',
  ]),
};

/**
 * ETO recipe for Ox (丑) themed prototypes
 * Filters prototypes containing ox/cow-related keywords in Japanese and English
 */
export const DECK_ETO_USHI: DeckRecipe = {
  ...DECK_ETO_BASE,
  id: 'eto-ushi',
  title: '🐄 丑',
  description: 'うしにちなむ',
  filter: createKeywordFilter([
    //
    '🐄',
    '🐮',
    '丑',
    '牛',
    'うし',
    'ウシ',
    'モー',
    'MOW',
    'COW',
    'BULL',
    'OX',
  ]),
};

/**
 * ETO recipe for Tiger (寅) themed prototypes
 * Filters prototypes containing tiger-related keywords in Japanese and English
 */
export const DECK_ETO_TORA: DeckRecipe = {
  ...DECK_ETO_BASE,
  id: 'eto-tora',
  title: '🐅 寅',
  description: 'とらにちなむ',
  filter: createKeywordFilter([
    '🐅',
    '🐯',
    '寅',
    '虎',
    'とら',
    'トラ',
    'タイガー',
    'TIGER',
    'TORA',
  ]),
};

/**
 * ETO recipe for Rabbit (卯) themed prototypes
 * Filters prototypes containing rabbit-related keywords in Japanese and English
 */
export const DECK_ETO_U: DeckRecipe = {
  ...DECK_ETO_BASE,
  id: 'eto-u',
  title: '🐇 卯',
  description: 'うさぎにちなむ',
  filter: createKeywordFilter([
    '🐇',
    '🐰',
    '卯',
    '兎',
    '兔',
    'うさぎ',
    'ウサギ',
    'とにかく',
    'ラビット',
    'ピョン',
    'ミッフィー',
    'バニー',
    'RABBIT',
    'USAGI',
    'BUNNY',
  ]),
};

/**
 * ETO recipe for Dragon (辰) themed prototypes
 * Filters prototypes containing dragon-related keywords in Japanese and English
 */
export const DECK_ETO_TATSU: DeckRecipe = {
  ...DECK_ETO_BASE,
  id: 'eto-tatsu',
  title: '🐉 辰',
  description: 'りゅうにちなむ',
  filter: createKeywordFilter([
    '🐉',
    '🐲',
    '辰',
    '竜',
    '龍',
    'たつ',
    'タツ',
    'りゅう',
    'リュウ',
    'ドラゴン',
    '立つ',
    'DRAGON',
    'RYU',
    'TATSU',
  ]),
};

/**
 * ETO recipe for Snake (巳) themed prototypes
 * Filters prototypes containing snake-related keywords in Japanese and English
 */
export const DECK_ETO_MI: DeckRecipe = {
  ...DECK_ETO_BASE,
  id: 'eto-mi',
  title: '🐍 巳',
  description: 'へびにちなむ',
  filter: createKeywordFilter([
    '🐍',
    '巳',
    '蛇',
    'へび',
    'ヘビ',
    'スネーク',
    '〜',
    'SNAKE',
    'HEBI',
    'HEAVY',
  ]),
};

/**
 * ETO recipe for Horse (午) themed prototypes
 * Filters prototypes containing horse-related keywords in Japanese and English
 */
export const DECK_ETO_UMA: DeckRecipe = {
  ...DECK_ETO_BASE,
  id: 'eto-uma',
  title: '🐴 午',
  description: 'うまにちなむ',
  filter: createKeywordFilter([
    '🐴',
    '🎠',
    '🐎',
    '🐪',
    'HORSE',
    'UMA',
    'うま',
    'ウマ',
    'ホース',
    '午',
    '馬',
    '旨',
    '宇摩',
    '上手',
    '美味',
  ]),
};

/**
 * ETO recipe for Sheep (未) themed prototypes
 * Filters prototypes containing sheep-related keywords in Japanese and English
 */
export const DECK_ETO_HITSUJI: DeckRecipe = {
  ...DECK_ETO_BASE,
  id: 'eto-hitsuji',
  title: '🐏 未',
  description: 'ひつじにちなむ',
  filter: createKeywordFilter([
    '🐏',
    '🐑',
    '未',
    '羊',
    'ひつじ',
    'ヒツジ',
    'ラム',
    'ジンギスカン',
    'メェ',
    'SHEEP',
    'HITSUJI',
  ]),
};

/**
 * ETO recipe for Monkey (申) themed prototypes
 * Filters prototypes containing monkey-related keywords in Japanese and English
 */
export const DECK_ETO_SARU: DeckRecipe = {
  ...DECK_ETO_BASE,
  id: 'eto-saru',
  title: '🐒 申',
  description: 'さるにちなむ',
  filter: createKeywordFilter([
    '🐒',
    '🐵',
    '🙈',
    '🙉',
    '🙊',
    '🦍',
    '🦧',
    '申',
    '猿',
    'さる',
    'サル',
    'ゴリラ',
    'モンキー',
    '去る',
    'うき',
    'ウキ',
    'MONKEY',
    'SARU',
    'LEAVE',
    '',
  ]),
};

/**
 * ETO recipe for Rooster (酉) themed prototypes
 * Filters prototypes containing rooster-related keywords in Japanese and English
 */
export const DECK_ETO_TORI: DeckRecipe = {
  ...DECK_ETO_BASE,
  id: 'eto-tori',
  title: '🐓 酉',
  description: 'とりにちなむ',
  filter: createKeywordFilter([
    '🐓',
    '🐔',
    '🐣',
    '🐤',
    '🐥',
    '🐦',
    '🐧',
    '酉',
    '鳥',
    '鶏',
    'とり',
    'トリ',
    'ニワトリ',
    'ひよこ',
    'ヒヨコ',
    'コケコッコー',
    'ぺんぎん',
    'ペンギン',
    'TORI',
    'BIRD',
    'ROOSTER',
    'CHICKEN',
  ]),
};

/**
 * ETO recipe for Dog (戌) themed prototypes
 * Filters prototypes containing dog-related keywords in Japanese and English
 */
export const DECK_ETO_INU: DeckRecipe = {
  ...DECK_ETO_BASE,
  id: 'eto-inu',
  title: '🐕 戌',
  description: 'いぬにちなむ',
  filter: createKeywordFilter([
    '🐕',
    '🐶',
    '戌',
    '犬',
    'いぬ',
    'イヌ',
    'ドッグ',
    'わん',
    'ワン',
    'DOG',
    'INU',
    'ONE',
    'BOW',
  ]),
};

/**
 * ETO recipe for Boar (亥) themed prototypes
 * Filters prototypes containing boar-related keywords in Japanese and English
 */
export const DECK_ETO_I: DeckRecipe = {
  ...DECK_ETO_BASE,
  id: 'eto-i',
  title: '🐗 亥',
  description: 'いのししにちなむ',
  filter: createKeywordFilter([
    '🐗',
    '🐖',
    '🐷',
    '🐽',
    '亥',
    '猪',
    '豚',
    'いのしし',
    'イノシシ',
    'ぶた',
    'ブタ',
    'ブー',
    'ブヒ',
    '猪突',
    '猛進',
    'BOAR',
    'INOSHISHI',
  ]),
};

/**
 * All ETO (Chinese zodiac) recipes
 * Contains all 12 zodiac animal-themed deck recipes in order:
 * Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Sheep, Monkey, Rooster, Dog, Boar
 */
export const ETO_RECIPES: DeckRecipe[] = [
  DECK_ETO_NE,
  DECK_ETO_USHI,
  DECK_ETO_TORA,
  DECK_ETO_U,
  DECK_ETO_TATSU,
  DECK_ETO_MI,
  DECK_ETO_UMA,
  DECK_ETO_HITSUJI,
  DECK_ETO_SARU,
  DECK_ETO_TORI,
  DECK_ETO_INU,
  DECK_ETO_I,
];
