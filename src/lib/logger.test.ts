import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('logger', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleDebugSpy: ReturnType<typeof vi.spyOn>;
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleDebugSpy.mockRestore();
    consoleInfoSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  const loadLogger = async () => {
    // Force re-import to pick up new env
    await vi.importActual('@/lib/logger');
    const { logger } = await import('@/lib/logger');
    return logger;
  };

  describe('with LOG_LEVEL = debug', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_LOG_LEVEL', 'debug');
    });

    it('should output all logs', async () => {
      const logger = await loadLogger();

      logger.debug('debug');
      expect(consoleDebugSpy).toHaveBeenCalledWith('[DEBUG]', 'debug');

      logger.info('info');
      expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO]', 'info');

      logger.warn('warn');
      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN]', 'warn');

      logger.error('error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', 'error');
    });

    it('should handle multiple arguments in debug', async () => {
      const logger = await loadLogger();
      logger.debug('arg1', 'arg2', 'arg3', { obj: true });
      expect(consoleDebugSpy).toHaveBeenCalledWith(
        '[DEBUG]',
        'arg1',
        'arg2',
        'arg3',
        { obj: true },
      );
    });
  });

  describe('with LOG_LEVEL = info (default)', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_LOG_LEVEL', 'info');
    });

    it('should output info and above, but NOT debug', async () => {
      const logger = await loadLogger();

      logger.debug('debug');
      expect(consoleDebugSpy).not.toHaveBeenCalled();

      logger.info('info');
      expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO]', 'info');

      logger.warn('warn');
      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN]', 'warn');
    });

    it('should handle complex objects', async () => {
      const logger = await loadLogger();
      const complexObj = {
        nested: { deep: { value: 123 } },
        array: [1, 2, 3],
        fn: () => {},
      };
      logger.info('complex', complexObj);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '[INFO]',
        'complex',
        complexObj,
      );
    });
  });

  describe('with LOG_LEVEL = warn', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_LOG_LEVEL', 'warn');
    });

    it('should output warn and above, but NOT info/debug', async () => {
      const logger = await loadLogger();

      logger.debug('debug');
      expect(consoleDebugSpy).not.toHaveBeenCalled();

      logger.info('info');
      expect(consoleInfoSpy).not.toHaveBeenCalled();

      logger.warn('warn');
      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN]', 'warn');

      logger.error('error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', 'error');
    });
  });

  describe('with LOG_LEVEL = error', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_LOG_LEVEL', 'error');
    });

    it('should output only error', async () => {
      const logger = await loadLogger();

      logger.debug('debug');
      expect(consoleDebugSpy).not.toHaveBeenCalled();

      logger.info('info');
      expect(consoleInfoSpy).not.toHaveBeenCalled();

      logger.warn('warn');
      expect(consoleWarnSpy).not.toHaveBeenCalled();

      logger.error('error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', 'error');
    });
  });
});
