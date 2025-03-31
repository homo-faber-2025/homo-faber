import { useState, useEffect } from 'react';

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    let lastCall = 0;
    const throttleTime = 500;

    const updateSize = () => {
      const now = new Date().getTime();
      if (now - lastCall < throttleTime) return;
      lastCall = now;
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [size]);

  return size;
};

export default useWindowSize;