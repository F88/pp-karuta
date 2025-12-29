# pp-karuta Design Document

## Overview

pp-karutaは、ProtoPediaのプロトタイプデータを活用したカルタゲームアプリケーションです。

## STYLING

- Shared theme: Use shadcn/ui + Tailwind CSS variables (defined in src/index.css) for all pages by default.
- Intro page theme: /intro is intentionally isolated and must use its own Matrix-style theme from src/components/intro/IntroPage.css.
- Rule: Do not “normalize” /intro to the shared theme. The Intro route should avoid the shared ThemeProvider and should enforce its theme via a dedicated body class.

## Data Source

### ProtoPedia API v2 and PROMIDAS

- [ProtoPedia API v2 Response型定義](https://raw.githubusercontent.com/F88/protopedia-api-v2-client.js/af40cfdba1908a7a21f0576859b0e1907d337b81/src/types/protopedia-api-v2/response.ts)
- [PROMIDAS normalizePrototype](https://raw.githubusercontent.com/F88/promidas/dd64e5a20ebe562e35e7eb032326e5d0faf7f315/lib/fetcher/utils/normalize-prototype.ts)

### What is Karuta?

カルタは日本の伝統的なカードゲームです。

#### 道具

- **文字札・読み札(yomifuda)**: 取り札の内容を書いた短い文章が書かれており、読み手が声に出して読む
- **絵札・取り札(torifuda)**: 読み札の内容を描いた絵と、読み札の文言の頭文字がひらがなで書かれている

伝統的なかるたでは、あいうえお46枚ずつの札があり、一音につき一セットの読み札・取り札が用意されています。

#### 基本ルール

1. 2人以上で行う
2. 取り札を平面に広げ、取る人に見やすくする
3. 読み人が読み札を読む
4. できるだけ早く、読み札に合った取り札を取る(または叩く)
5. 全ての札がなくなるまで繰り返す
6. より多くの取り札を取った方の勝ち

参考: [Karuta - Wikipedia](https://en.wikipedia.org/wiki/Karuta)

### PROMIDAS Integration

- [PROMIDAS](https://github.com/F88/promidas)を使用してProtoPedia API v2からプロトタイプデータを取得
- `ProtopediaInMemoryRepository`でsnapshotとしてデータをキャッシュ
- 取得したプロトタイプを「札(カード)」として使用

## Game Rules

### pp-karuta の基本ルール

伝統的なかるたのルールをProtoPediaのプロトタイプデータに適用します。

#### 札の構成

##### YomiFuda(読み札・文字札)

- ProtoPedia API から取得したプロトタイプの説明文(description)または概要
- 画面上部に表示される
- 1枚ずつ順番に表示

##### ToriFuda(取り札・絵札)

- ProtoPedia API から取得したプロトタイプの画像(サムネイル)
- プロトタイプのタイトル
- `prototypeId` を持ち、YomiFuda との対応関係を判定できる
- 複数枚が「Tatami(畳)」エリアに配置される

##### 札の枚数

- 伝統的なかるたの46枚制限はなし
- ProtoPedia API から取得できる範囲で任意の枚数を使用可能

#### ゲームの流れ

##### Phase 0: 入力方式選択 (タイトル画面)

###### 入力方式選択

- **Keyboard**: ショートカットキーで操作 (PC環境)
    - 共通のTatamiエリアを使用
    - 各プレイヤーに専用のキーバインドを割り当て
        - Player 1: 1, 2, 3, 4, 5
        - Player 2: Q, W, E, R, T
        - Player 3: A, S, D, F, G
        - Player 4: Z, X, C, V, B
- **Touch**: タップで操作 (モバイル/タッチ環境)
    - 各プレイヤーに専用のTatamiエリアを表示
    - プレイヤーは自分のエリアのみタップ可能
    - 画面レイアウトはプレイヤー数に応じて分割

この選択により後続の画面レイアウトが確定する

##### Phase 1: プレイヤー人数選択

###### プレイヤー人数選択

- 1人〜4人から選択
- Touchモードの場合、選択した人数により画面分割が決定
    - 1人: 全画面
    - 2人: 上下または左右分割
    - 3-4人: グリッド分割

##### Phase 2: BOX選択

###### BOX一覧表示

- 利用可能なBOXを表示
- 各BOXには以下の仕様が定義されている:
    - データフィルタ条件 (タグ、年代など)
    - 札の枚数
    - 難易度設定
    - タイムリミット (オプション)

###### BOX選択

- プレイヤーが任意のBOXを選択
- 選択されたBOX仕様に基づいてYomiFuda/ToriFudaを生成

##### Phase 3: ゲーム初期化

###### データ準備

1. PROMIDASから選択されたBOX仕様に合致するPrototypeDataを取得
2. PrototypeDataからYomiFuda と ToriFudaを生成
    - 両者は `prototypeId` で対応関係を持つ
3. YomiFudaの順序をシャッフル (またはBOX仕様に従う)
4. **ToriFuda Stack の初期化**
    - すべてのToriFudaをシャッフル
    - 配列としてStackを保持 (例: `toriFudaStack = shuffle(allToriFudas)`)
5. **初期Tatami配置**
    - Stackから最初の5枚をpopしてTatamiに配置

###### ゲーム状態初期化

- 現在のRace = 1
- 総Race数 = YomiFudaの枚数
- 各プレイヤーのMochiFuda = []
- ToriFuda Stack (残りのToriFuda)
- Tatami (表示中の5枚のToriFuda)
- タイマー開始

##### Phase 4: ゲームプレイ (Race進行)

`1 Game = (YomiFuda数 = ToriFuda数) x Race`

###### 1 Raceの定義

1 Race = YomiFudaが表示されてから対応するToriFudaが取られるまで

###### Race開始

1. 現在のYomiFudaを表示
2. Tatamiには既に配置済みのToriFudaが表示されている
    - Tatami上のToriFudaの中に正解(currentYomiFudaに対応するToriFuda)が含まれる
    - 正解が含まれない場合: 現在のYomiFudaはスキップ (該当札なし)
    - 各ToriFudaに番号を表示 (1-5, またはTatami上の枚数に応じて)

###### プレイヤーアクション(早い者勝ち)

- 全プレイヤーが同時に入力可能
- Keyboard入力:
    - 共通のTatamiに対して各プレイヤーが割り当てられたキーで入力
- Touch入力:
    - 各プレイヤー専用のTatamiエリア (同じToriFudaを表示)
    - 自分のエリアをタップして選択

###### 判定

- 最初に正解のToriFudaを選択したプレイヤーが獲得
- **正解時**:
    1. そのプレイヤーのMochiFudaに追加
    2. 正解のToriFudaをTatamiから除去
    3. **Stackに札が残っている場合**: Stack.shift() で1枚取り出してTatamiに追加
    4. **Stackが空の場合**: Tatamiに追加せず (Tatamiの札は徐々に減っていく)
    5. スコア加算
    6. 次のRaceへ進む
- **不正解時**:
    1. ペナルティ (スコア減算など)
    2. そのプレイヤーは引き続き選択可能
    3. 誰かが正解するまで継続

###### Race終了条件

- いずれかのプレイヤーが正解のToriFudaを取得

###### ゲーム終盤の挙動

- Stackが空になった後もゲームは継続
- Tatami上の札は取られるたびに減っていく
- 最後のYomiFudaに対応するToriFudaが取られた時点でゲーム終了

##### Phase 5: ゲーム終了

###### 終了条件

- すべてのYomiFuda/ToriFudaペアがなくなる
- または制限時間終了 (BOX仕様による)

###### 結果表示

- 各プレイヤーの獲得枚数
- スコア
- プレイ時間

### プレイヤー人数

- **1人**: シングルプレイ
- **2-4人**: マルチプレイヤー

各プレイヤーは獲得したToriFudaを自分のMochiFudaに保持し、最終的に最も多くの札を獲得したプレイヤーが勝利。

### 入力方式

- **Keyboard**: PC環境向け、ショートカットキーで操作
- **Touch**: モバイル/タブレット環境向け、タップで操作

### 勝利条件

- 最も多くの札を取ったプレイヤーが勝利
- シングルプレイの場合: スコアとタイムを記録

### 画面遷移フロー

```text
1. タイトル画面
   - アプリタイトル
   - 入力方式選択 (Keyboard / Touch)
   ↓ (入力方式決定)

2. プレイヤー人数選択画面
   - プレイヤー人数選択 (1-4人)
   - (Touch時: 画面分割プレビュー表示)
   ↓ (次へ)

3. BOX選択画面
   - 利用可能なBOX一覧表示
   - BOX選択
   ↓ (ゲーム開始)

4. ゲーム画面
   - YomiFuda表示エリア (共通)
   - Tatamiエリア (5枚のToriFuda)
     * Keyboard: 共通エリア
     * Touch: 各プレイヤー専用エリア
   - MochiFudaエリア (各プレイヤー)
   - スコア/タイマー表示
   ↓ (全Race終了)

5. 結果画面
   - 各プレイヤーのスコア
   - 獲得枚数ランキング
   - プレイ時間
   - リプレイ/タイトルへ戻る
```

## Screen Design

### 1. タイトル画面

- アプリタイトル (PP Karuta)
- 入力方式選択:
    - [Keyboard] ボタン (PC環境向け)
    - [Touch] ボタン (モバイル/タブレット向け)
- ルール説明へのリンク
- PROMIDAS統計情報(オプション)

この画面で入力方式を決定することで、以降の画面レイアウトが確定する

### 2. プレイヤー人数選択画面

#### プレイヤー人数選択(UI)

- [1人] [2人] [3人] [4人] ボタン

#### Touchモードの場合

- 選択した人数に応じた画面分割プレビューを表示
- 例: 2人選択時 → 上下分割のプレビュー

#### 次へボタン

### 3. BOX選択画面

#### BOX一覧

- 利用可能なBOXをカード形式で表示
- 各BOXに表示する情報:
    - BOX名
    - 説明
    - 札の枚数
    - 難易度
    - タイムリミット (あれば)

#### BOX選択(UI)

- クリック/タップでBOXを選択
- ゲーム開始ボタン

### 4. ゲーム画面

**Keyboardモードのレイアウト:**

```text
┌─────────────────────────────────────┐
│  YomiFuda表示エリア (共通)        │
│  「このプロトタイプは...」            │
├─────────────────────────────────────┤
│  Tatamiエリア (共通, 5枚)          │
│  [1] [2] [3] [4] [5]                │
│  札A 札B 札C 札D 札E                │
├─────────────────────────────────────┤
│  プレイヤー情報エリア              │
│  P1: 3枚 | P2: 5枚 | P3: 2枚      │
│  スコア | タイマー | 進行状況      │
└─────────────────────────────────────┘
```

**Touchモードのレイアウト (2人の例):**

```text
┌─────────────────────────────────────┐
│  YomiFuda表示エリア (共通)        │
├───────────────────┬──────────────────┤
│ Player 1 Tatami   │ Player 2 Tatami   │
│ [1][2][3][4][5]   │ [1][2][3][4][5]   │
│ MochiFuda: 3枚    │ MochiFuda: 5枚    │
└───────────────────┴──────────────────┘
```

**コンポーネント:**

- YomiFuda表示エリア (上部、全プレイヤー共通)
- Tatamiエリア (5枚のToriFudaを表示)
    - Keyboard: 1つの共通エリア
    - Touch: プレイヤー数分のエリア (同じToriFudaを表示)
- MochiFudaエリア (各プレイヤーの獲得札)
- 情報表示エリア (スコア/タイマー/進行状況)

### 5. 結果画面

- 各プレイヤーの最終スコア
- 獲得枚数ランキング
- プレイ時間
- リプレイボタン
- タイトルへ戻るボタン

## Data Model

このプロジェクトでは、型定義や実データ構造は実装が正です(= DESIGN.mdに重複定義しない)。

- Karuta domain models: src/models/karuta/
- Deck/recipe generation: src/lib/karuta/
- ProtoPedia API integration: src/lib/repository/ と src/lib/karuta/api-data.ts

### Model Dependencies

#### モデル概要

- **DeckRecipe**: Deck 生成の設計図（プリセット定義）
    - 役割:
        1. `setupSnapshot` に対する `ListPrototypesParams` (既存の型) を規定
        2. 必要に応じて `setupSnapshot` の結果に対する追加フィルタリング機能を提供
    - 主要: `ListPrototypesParams` (データ取得条件), 追加フィルタ条件
    - メタデータ: `title`, `description`, `difficulty`, `tags` (UI表示用)
    - 実装: `src/lib/karuta/recipe/definitions.ts`

```typescript
// 例1: 基本形 - offset と limit のみ指定
ListPrototypesParams(offset: 0, limit: 10_000)
// 追加フィルタ: なし

// 例2: ID 配列による追加フィルタ
ListPrototypesParams(offset: 0, limit: 10_000)
// 追加フィルタ: ID の配列によるフィルタリングを行う
// 用途: 特定のキュレーション済みプロトタイプセットを使用

// 例3: タグ名によるAPI側フィルタ
ListPrototypesParams(offset: 0, limit: 10_000, tagNm: tagName)
// 追加フィルタ: なし
// 用途: 特定タグのプロトタイプのみでゲームを構成
```

- **Deck**: Prototype データの大きなプール
    - 構造: `Map<prototypeId, NormalizedPrototype>`
    - 特性: 不変、O(1)アクセス
    - サイズ: `setupSnapshot` の結果とフィルタリング結果で決まる (例: 1000件)
    - 生成: DeckRecipe と Prototype 配列から `generateDeck()` で生成
    - 実装: `src/models/karuta/deck.ts`

- **StackRecipe**: Stack 生成の設計図
    - 役割: Deck から何件のIDを抽出し、どのようにソートするかを規定
    - 主要: `maxSize` (抽出件数、`"all"` または数値), `sortMethod` (ソート方法)
    - メタデータ: `title`, `description`, `difficulty`, `tags` (UI表示用)
    - プリセット: 5件、10件、30件、全件
    - 実装: `src/lib/karuta/recipe/definitions.ts`

- **Stack**: Deck から抽出されたデータのID配列
    - 構造: `number[]` (Deck の ID の部分配列)
    - 関係: StackRecipe に基づいて Deck から抽出し、ランダムにソート
    - サイズ: StackRecipe の `maxSize` で指定 (例: 5, 10, 30 or "all")
    - 例: Deck が 1000件 → Stack は 10件
    - 特性: 不変 (ゲーム中の Stack は GameState.stack として別管理)
    - 実装: `src/models/karuta/stack.ts`

- **Tatami**: 場に出ているカード
    - 構造: `number[]` (Deck の ID 配列、最初は5枚)
    - 関係: **Stack から取り出された ID**
    - 初期: `Stack.slice(0, 5)`
    - 更新: カード取得時、Stack から補充（Stack枯渇後は補充なし）
    - 実装: `src/models/karuta/tatami.ts`

- **GameState**: ゲーム全体の状態
    - 所有: Deck, Stack, Tatami, Players
    - 実装: `src/models/karuta/game.ts`

#### データフロー

```
DeckRecipe (ListPrototypesParams, filter?)
  ↓ setupSnapshot(ListPrototypesParams)
API取得結果 (NormalizedPrototype[])
  ↓ filter? (必要に応じて追加フィルタリング)
Prototype配列 (例: 1000件)
  ↓ generateDeck(recipe, prototypes)
Deck (Map<ID, NormalizedPrototype>: 大きなデータプール、例: 1000件)

StackRecipe (maxSize, sortMethod)
  ↓ generateStack(stackRecipe, deck)
Stack (number[]: Deckから抽出されたID配列、例: 10件)
```

#### 設計判断

**DeckRecipe と Deck の分離**

- DeckRecipe: 再利用可能な設計図（データ取得条件を規定）
- Deck: DeckRecipe から生成されたデータプール
- 理由: 同じ DeckRecipe から異なる Deck を繰り返し生成可能

**DeckRecipe がデータ取得条件を決定**

- DeckRecipe は `ListPrototypesParams` (既存の型) と追加フィルタを規定
- 理由: ゲームモードごとに異なるデータセットが必要（例: 特定タグのみ、キュレーション済みセット）
- 利点: データ取得ロジックを DeckRecipe に集約し、ゲームモードの追加・変更が容易

**StackRecipe と Stack の分離**

- StackRecipe: Stack 生成の設計図（抽出件数とソート方法を規定）
- Stack: StackRecipe に基づいて Deck から生成されたID配列
- 理由: 同じ Deck から異なる StackRecipe で複数の Stack を生成可能

**Deck と Stack の分離**

- Deck: 大きなデータプール（不変、Map構造、例: 1000件）
- Stack: Deck から抽出されたID配列（不変、例: 5~30件）
- 理由:
    - Deck を大きく保つことで、同じ Deck から異なるサイズの Stack を複数生成可能
    - データ本体 (Deck) と順序管理 (Stack) の関心分離、メモリ効率
    - プレイヤーは stackSize のプリセット (5, 10, 30) または任意件数を選択可能

**ID 配列の採用 (Stack/Tatami)**

- Stack/Tatami は prototype ID のみ保持
- Deck が唯一のデータソース
- 理由: メモリ効率、データ整合性、配列操作の軽量化

#### 依存関係図

```mermaid
graph TD
    External[External: @f88/promidas NormalizedPrototype]
    Recipe[DeckRecipe]
    Deck[Model: Deck]
    DeckMeta[Model: DeckMetaData]
    Player[Model: Player]
    Stack[Model: Stack]
    Tatami[Model: Tatami]
    GameState[Model: GameState]
    GameResult[Model: GameResult]

    External --> Deck
    Recipe -.generates.-> Deck
    Deck -.ID lookup.-> Stack
    Deck -.ID lookup.-> Tatami
    Tatami --> Player
    Deck --> GameState
    Player --> GameState
    Stack --> GameState
    Tatami --> GameState

    DeckMeta --> GameResult
```

**ルール（メンテコストを増やさないための方針）:**

- DESIGN.mdは依存グラフと意図のみを書く（型の全文は書かない）
- 依存グラフは概念的な依存（所有/参照/生成）を表す（必ずしもTSのimportに一致しない）
- modelsはUIやrepositoryに依存しない（逆方向にしない）

DESIGN.mdには「設計判断」「制約」「意図」だけを書く（実装の詳細は書かない）。

## Component Architecture

### Container/Presentational Pattern

すべてのコンポーネントは以下のパターンに従う:

- **Container**: データ取得、状態管理、ビジネスロジック
- **Presentational**: UIレンダリング、propsを受け取って表示のみ

### Routing

- TanStack Routerを使用し、URLでの直接アクセス(例: /intro)を可能にする
- GitHub Pages配下(/pp-karuta)で動くようにbasepathを設定する(src/main.tsx)

### Notes

- Tech StackはREADME.mdのTech Stackを正とする

## References

- [Karuta - Wikipedia](https://en.wikipedia.org/wiki/Karuta)
- [PROMIDAS](https://github.com/F88/promidas)
- [PROMIDAS Utilities](https://github.com/F88/promidas-utils)
- [ProtoPedia](https://protopedia.net/)
