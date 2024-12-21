import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener
    mediaQuery.addEventListener('change', handler);

    // Clean up
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]); // Re-run effect if query changes

  return matches;
};

// Usage example:
// const isMobile = useMediaQuery('(max-width: 768px)');
