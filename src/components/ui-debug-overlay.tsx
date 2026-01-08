import type { ScreenSize } from '@/types/screen-size';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

interface UIDebugOverlayProps {
  screenSize: ScreenSize;
  headerHeight?: string;
  contentHeight?: string;
}

export function UIDebugOverlay({
  screenSize,
  headerHeight,
  contentHeight,
}: UIDebugOverlayProps) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('resize', handleResize);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const screenIcons = {
    smartphone: '📱',
    tablet: '📱',
    pc: '💻',
  };

  const devicePixelRatio = window.devicePixelRatio;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  // Tailwind breakpoint detection
  const getTailwindBreakpoint = () => {
    const width = windowSize.width;
    if (width < 640) return 'xs';
    if (width < 768) return 'sm';
    if (width < 1024) return 'md';
    if (width < 1280) return 'lg';
    if (width < 1536) return 'xl';
    return '2xl';
  };

  // Simplified user agent
  const getUserAgent = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  };

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2">
      <div className="pointer-events-auto rounded-lg border-2 bg-white/90 p-3 backdrop-blur-sm dark:bg-gray-950/90">
        <div className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
          🔧 UI Debug
        </div>

        {/* Layout & Display */}
        <div className="mb-2 space-y-1 text-xs">
          <div className="font-semibold text-gray-700 dark:text-gray-300">
            📐 Layout
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {screenIcons[screenSize]} {screenSize}
            </Badge>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Window: {windowSize.width} × {windowSize.height}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Breakpoint: {getTailwindBreakpoint()}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Pixel Ratio: {devicePixelRatio}x
          </div>
          {headerHeight && (
            <div className="text-gray-600 dark:text-gray-400">
              Header: {headerHeight}
            </div>
          )}
          {contentHeight && (
            <div className="text-gray-600 dark:text-gray-400">
              Content: {contentHeight}
            </div>
          )}
        </div>

        {/* Device & Environment */}
        <div className="space-y-1 text-xs">
          <div className="font-semibold text-gray-700 dark:text-gray-300">
            📱 Device
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Touch: {isTouchDevice ? '✓ Yes' : '✗ No'}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Online: {isOnline ? '✓ Yes' : '✗ Offline'}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Browser: {getUserAgent()}
          </div>
        </div>
      </div>
    </div>
  );
}
