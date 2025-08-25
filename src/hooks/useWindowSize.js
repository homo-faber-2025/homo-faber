import { useState, useEffect } from 'react';

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 767 : false
  );

  useEffect(() => {
    let lastCall = 0;
    const throttleTime = 500;

    const updateSize = () => {
      const now = new Date().getTime();
      if (now - lastCall < throttleTime) return;
      lastCall = now;

      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      setSize({
        width: newWidth,
        height: newHeight,
      });

      setIsMobile(newWidth <= 767);
    };

    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return { ...size, isMobile };
};

export default useWindowSize;