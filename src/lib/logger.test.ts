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
  });

  describe('with DEBUG_MODE enabled', () => {
    beforeEach(async () => {
      vi.stubEnv('VITE_DEBUG_MODE', 'true');
      // Reimport logger to pick up the new env value
      await vi.importActual('@/lib/logger');
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('should output debug logs with [DEBUG] prefix', async () => {
      const { logger } = await import('@/lib/logger');
      logger.debug('test message', { foo: 'bar' });
      expect(consoleDebugSpy).toHaveBeenCalledWith('[DEBUG]', 'test message', {
        foo: 'bar',
      });
    });

    it('should output info logs with [INFO] prefix', async () => {
      const { logger } = await import('@/lib/logger');
      logger.info('info message', 123);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '[INFO]',
        'info message',
        123,
      );
    });
  });

  describe('with DEBUG_MODE disabled', () => {
    beforeEach(async () => {
      vi.stubEnv('VITE_DEBUG_MODE', 'false');
      await vi.importActual('@/lib/logger');
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('should not output debug logs when DEBUG_MODE is false', async () => {
      const { logger } = await import('@/lib/logger');
      logger.debug('test message');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should not output info logs when DEBUG_MODE is false', async () => {
      const { logger } = await import('@/lib/logger');
      logger.info('info message');
      expect(consoleInfoSpy).not.toHaveBeenCalled();
    });
  });

  describe('always enabled logs', () => {
    it('should output log messages with [LOG] prefix', async () => {
      const { logger } = await import('@/lib/logger');
      logger.log('log message', 'data');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[LOG]',
        'log message',
        'data',
      );
    });

    it('should output warn messages with [WARN] prefix', async () => {
      const { logger } = await import('@/lib/logger');
      logger.warn('warning message', { code: 404 });
      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN]', 'warning message', {
        code: 404,
      });
    });

    it('should output error messages with [ERROR] prefix', async () => {
      const { logger } = await import('@/lib/logger');
      logger.error('error message', new Error('test'));
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[ERROR]',
        'error message',
        expect.any(Error),
      );
    });
  });

  describe('multiple arguments', () => {
    beforeEach(async () => {
      vi.stubEnv('VITE_DEBUG_MODE', 'true');
      await vi.importActual('@/lib/logger');
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('should handle multiple arguments in debug', async () => {
      const { logger } = await import('@/lib/logger');
      logger.debug('arg1', 'arg2', 'arg3', { obj: true });
      expect(consoleDebugSpy).toHaveBeenCalledWith(
        '[DEBUG]',
        'arg1',
        'arg2',
        'arg3',
        { obj: true },
      );
    });

    it('should handle no arguments', async () => {
      const { logger } = await import('@/lib/logger');
      logger.log();
      expect(consoleLogSpy).toHaveBeenCalledWith('[LOG]');
    });

    it('should handle complex objects', async () => {
      const { logger } = await import('@/lib/logger');
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
});
