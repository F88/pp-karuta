# Changelog

All notable changes to pp-karuta will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [2026.01.05] - 2026-01-05

### Added

- Centralized logger with environment control and prefixes
- Release year based deck recipes (2015-2027)
- Collapsible component for grouping deck recipes
- DeckPreview component for displaying generated deck
- Keyboard shortcuts for card selection with Kbd component
- Screen size detection and responsive components (smartphone/tablet/PC)
- Container queries for responsive keyboard text sizing
- DummyRepository for development mode with 10,000 fake prototypes
- String normalization functions for keyword filtering

### Changed

- Improved deck recipe selector UI with dynamic grid layout based on screen size
- Enhanced game results presentation with responsive action buttons
- Optimized build chunks with refined vendor chunking configuration
- Touch mode now allows Tatami size 16 without restrictions
- Refactored ToriFudaCard into keyboard and touch components
- Updated app header button labels for consistency and clarity
- Improved player tatami layout and spacing

### Fixed

- Repository state monitoring with equality check to prevent unnecessary re-renders
- Deck selection restoration from sessionStorage on all navigation paths
- Type assignment for DEFAULT_TATAMI_SIZE_8
- Correct DECK_ETO_SARU emoji in test

## [2025.12.29] - 2025-12-29

### Added

- StackRecipe system and integrated selector
- Player management system with unlimited player creation
- Per-player state management for multi-player support
- Game header, player tatami, shared tatami, and tatami grid components
- 4 player limit enforcement in UI
- API params hidden in debug mode
- Repository state indicator to header
- PlayMode selection with repository validation flow
- PromidasRepositoryManager for singleton management and token validation
- Repository state management and store monitoring
- Dummy data configuration for development settings

### Changed

- Migrated to Shadcn UI components with improved type safety
- sortMethod from sequential to id-based sorting
- Reorganized deck recipe management and updated UI layout
- Upgraded promidas-utils and unified file naming
- Extracted game flow logic to reusable component
- Split PromidasRepoDashboard into Container/Presenter pattern

### Fixed

- Syntax error in useGameSetup function
- Empty deck cases in stack generation
- Repository state management and UI navigation
- Polling to auto-close repository setup dialog

## [2025.12.26] - 2025-12-26

Initial release

[unreleased]: https://github.com/F88/pp-karuta/compare/2026.01.05...HEAD
[2026.01.05]: https://github.com/F88/pp-karuta/compare/2025.12.29...2026.01.05
[2025.12.29]: https://github.com/F88/pp-karuta/compare/2025.12.26...2025.12.29
[2025.12.26]: https://github.com/F88/pp-karuta/releases/tag/2025.12.26
