import { useEffect } from 'react';

/**
 * Custom hook to scroll to the top of the page when the component mounts
 * Uses instant behavior for immediate scroll without animation
 */
export function useScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
}
