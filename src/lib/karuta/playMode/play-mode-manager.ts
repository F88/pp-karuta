/**
 * PlayMode type - Input method for the game
 */
export type PlayMode = 'keyboard' | 'touch';

/**
 * PlayModeManager - Centralized management for PlayMode operations
 * Handles PlayMode definition, validation, and configuration
 */
export class PlayModeManager {
  // ========================================
  // Section 1: PlayMode Definition
  // ========================================

  /**
   * Available PlayModes
   */
  static readonly PLAY_MODES: readonly PlayMode[] = [
    'keyboard',
    'touch',
  ] as const;

  /**
   * Default PlayMode
   */
  static readonly DEFAULT_PLAY_MODE: PlayMode = 'keyboard';

  // ========================================
  // Section 2: PlayMode Validation
  // ========================================

  /**
   * Validate if a value is a valid PlayMode
   * @param mode - Value to validate
   * @returns true if valid PlayMode
   */
  static isValidPlayMode(mode: unknown): mode is PlayMode {
    return (
      typeof mode === 'string' &&
      (this.PLAY_MODES as readonly string[]).includes(mode)
    );
  }

  /**
   * Validate PlayMode (throws on invalid)
   * @param mode - PlayMode to validate
   * @throws {Error} If mode is invalid
   */
  static validatePlayMode(mode: unknown): asserts mode is PlayMode {
    if (!this.isValidPlayMode(mode)) {
      throw new Error(
        `Invalid PlayMode: ${mode}. Must be one of: ${this.PLAY_MODES.join(', ')}`,
      );
    }
  }

  // ========================================
  // Section 3: PlayMode Configuration
  // ========================================

  /**
   * Get PlayMode display information
   * @param mode - PlayMode
   * @returns Display information for the mode
   */
  static getDisplayInfo(mode: PlayMode): {
    title: string;
    description: string;
    targetDevice: string;
  } {
    switch (mode) {
      case 'keyboard':
        return {
          title: 'Keyboard',
          description:
            'ショートカットキーで操作します。共通のTatamiエリアを使用し、各プレイヤーに専用のキーバインドを割り当てます。',
          targetDevice: 'PC環境向け',
        };
      case 'touch':
        return {
          title: 'Touch',
          description:
            'タップで操作します。各プレイヤーに専用のTatamiエリアを表示し、自分のエリアのみタップ可能です。',
          targetDevice: 'モバイル/タブレット向け',
        };
    }
  }

  /**
   * Check if PlayMode requires separate tatami for each player
   * @param mode - PlayMode
   * @returns true if mode requires separate tatami areas
   */
  static requiresSeparateTatami(mode: PlayMode): boolean {
    return mode === 'touch';
  }

  /**
   * Get recommended PlayMode based on device
   * @returns Recommended PlayMode
   */
  static getRecommendedPlayMode(): PlayMode {
    // Check if touch device
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    return isTouchDevice ? 'touch' : 'keyboard';
  }
}
