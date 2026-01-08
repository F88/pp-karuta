<!-- markdownlint-disable MD024 -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2026.01.08] - 2026-01-08

### Added

- コンポーネントマウント時の自動スクロール機能 (TatamiView, GameResults, IntegratedSelector)
- Touch mode用のscreen sizeベースのグリッドレイアウト (smartphone: 1列 for ≤2プレイヤー, tablet/PC: 2列 for 2+プレイヤー)
- SharedTatamiコンポーネント用のレスポンシブpadding設定
- UIDebugOverlayにheaderHeightとcontentHeightの表示を追加

### Changed

- ゲームロジックをGameManagerクラスに統合 - ゲーム状態管理の一元化
- カード順序決定ロジックを改善 - StackRecipe.sortMethodを唯一の真実の源に設定
- Yomiteアイコンを巻物 (📜) から吹き出し (💬) に変更
- pickYomiFuda関数のシグネチャ変更 - tatami配列を引数に取り、cardIDのみを返却
- PlayerAreaを個別スクロール可能に変更 (max-h-full, overflow-y-auto)
- TatamiViewPresentationの高さ指定をh-screenからh-fullに変更
- keyboard modeのキー表示を改善 (min-h-8, min-w-8, inline-flex)
- Start Game Buttonのbottom marginを増加 (全screen sizeでmb-8)

### Fixed

- GameState型からreadingOrderフィールドを削除 - 不要な状態管理を削減
- 狭いviewport heightでのPlayerArea表示問題を修正
- AppHeader高さを除外したコンテンツ領域の高さ計算を実装
- keyboard mode 4プレイヤー横並びレイアウトでのキーサイズ問題を修正
- ゲーム開始後のスクロール位置が最上部にならない問題を修正

### Dependencies

- @tanstack/react-router: ^1.145.7 → ^1.145.11
- @tanstack/router-plugin: ^1.145.7 → ^1.145.11
- vite: ^7.3.0 → ^7.3.1

## [2026.01.07] - 2026-01-07

### Added

- 畳スタイル: 伝統的な和風畳マット外観 (CSS グラデーション、3 つの長方形構造)
- `useYomibito` フック: リズムベースのテキストアニメーション (5-7-5-7-7 パターン)
- `PlayerArea` コンポーネント: プレイヤー情報と畳を含む統合エリア
- `UIDebugOverlay` コンポーネント: 画面サイズ、ウィンドウサイズ、デバイス情報を表示する UI デバッグツール
- UI デバッグモード設定を `.env.example` に追加

### Changed

- 用語を「枚」から「組」に変更 (デッキサイズの単位)
- テキストカラークラスを更新してダークモードでの可読性を改善
- PC パターンレンダリングを簡素化してエッジスタイリングを改善
- エッジボーダーをグレーからインディゴに変更して視覚的な一貫性を向上
- コード構造を改善して色を標準化
- プレイヤー畳と共有畳のレスポンシブスタイルを改良
- すべてのレスポンシブコンポーネントを `getResponsiveStyles` パターンに統一
- `PlayerTatami` と `SharedTatami` をレスポンシブスタイルで強化

### Fixed

- Tailwind CSS のグラデーションクラス名を `bg-linear-to-br` から `bg-gradient-to-br` に修正

### Removed

- 未使用の `PlayerSelectionCard` コンポーネントを削除
- `player-tatami.stories.tsx` を削除 (コンポーネント再構成のため)

## [2026.01.05] - 2026-01-05

### Added

- リリース年ベースのデッキレシピ (2015-2027)
- デッキレシピをグループ化するための折りたたみコンポーネント
- 生成されたデッキを表示する DeckPreview コンポーネント
- Kbd コンポーネントによるカード選択用キーボードショートカット
- 画面サイズ検出とレスポンシブコンポーネント (スマートフォン/タブレット/PC)
- レスポンシブなキーボードテキストサイズ調整用のコンテナクエリ
- キーワードフィルタリング用の文字列正規化機能
- 10,000 個の疑似プロトタイプを使用する開発モード用 DummyRepository
- 環境制御とプレフィックス付きの集中ログ機能

### Changed

- 画面サイズに基づく動的グリッドレイアウトでデッキレシピセレクタ UI を改善
- レスポンシブなアクションボタンでゲーム結果表示を強化
- ベンダーチャンク構成を改良してビルドチャンクを最適化
- タッチモードで畳サイズ 16 を制限なく使用可能に変更
- ToriFudaCard をキーボード用とタッチ用のコンポーネントにリファクタリング
- 一貫性と明確性のためにアプリヘッダーのボタンラベルを更新
- プレイヤー畳のレイアウトとスペーシングを改善

## [2025.12.29] - 2025-12-29

### Added

- StackRecipe システムと統合セレクタ
- 無制限のプレイヤー作成が可能なプレイヤー管理システム
- マルチプレイヤーサポートのためのプレイヤーごとの状態管理
- ゲームヘッダー、プレイヤー畳、共有畳、畳グリッドコンポーネント
- UI での4人プレイヤー制限の実施
- デバッグモードで API パラメータを非表示
- ヘッダーにリポジトリ状態インジケータを追加
- リポジトリ検証フローを含む PlayMode 選択
- シングルトン管理とトークン検証のための PromidasRepositoryManager
- リポジトリ状態管理とストア監視
- 開発設定用のダミーデータ設定

### Changed

- 型安全性を向上させた Shadcn UI コンポーネントへ移行
- sortMethod を sequential から id ベースのソートに変更
- デッキレシピ管理を再編成し UI レイアウトを更新
- promidas-utils をアップグレードしファイル命名を統一
- ゲームフローロジックを再利用可能なコンポーネントに抽出
- PromidasRepoDashboard を Container/Presenter パターンに分割

## [2025.12.26] - 2025-12-26

初回リリース

[unreleased]: https://github.com/F88/pp-karuta/compare/2026.01.07...HEAD
[2026.01.07]: https://github.com/F88/pp-karuta/compare/2026.01.05...2026.01.07
[2026.01.05]: https://github.com/F88/pp-karuta/compare/2025.12.29...2026.01.05
[2025.12.29]: https://github.com/F88/pp-karuta/compare/2025.12.26...2025.12.29
[2025.12.26]: https://github.com/F88/pp-karuta/releases/tag/2025.12.26
