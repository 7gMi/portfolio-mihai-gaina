import { useEffect, useState, type RefObject } from 'react';

/**
 * Tracks whether a canvas element is currently visible to the user.
 * Combines IntersectionObserver (viewport visibility) with the
 * Page Visibility API (tab/window visibility).
 *
 * Returns `true` only when BOTH conditions are met:
 *   1. The canvas is within the viewport (IntersectionObserver)
 *   2. The browser tab is visible (document.hidden === false)
 *
 * All observers and listeners are cleaned up on unmount.
 */
export function useCanvasVisibility(
  canvasRef: RefObject<HTMLCanvasElement | null>,
): boolean {
  const [isInViewport, setIsInViewport] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- IntersectionObserver ---
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    // --- Page Visibility API ---
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [canvasRef]);

  return isInViewport && isTabVisible;
}
