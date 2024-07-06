// useLoadingDots.js
import { useEffect, useState } from 'react';

export const useLoadingDots = (isLoading) => {
  const [loadingDots, setLoadingDots] = useState('.');

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingDots((prev) => (prev.length < 3 ? prev + '.' : '.'));
      }, 500);
    } else {
      setLoadingDots('');
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  return loadingDots;
};
