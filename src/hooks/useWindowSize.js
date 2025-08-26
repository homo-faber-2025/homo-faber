import { useState, useLayoutEffect } from 'react';

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
    isMobile: false
  });
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    const updateSize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const newIsMobile = newWidth <= 767;

      const newSize = {
        width: newWidth,
        height: newHeight,
        isMobile: newIsMobile
      };

      setSize(newSize);
      setIsReady(true);
    };

    // 즉시 업데이트
    updateSize();

    // 리사이즈 이벤트 리스너
    let lastCall = 0;
    const throttleTime = 500;

    const handleResize = () => {
      const now = new Date().getTime();
      if (now - lastCall < throttleTime) return;
      lastCall = now;
      updateSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { ...size, isReady };
};

export default useWindowSize;