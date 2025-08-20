import { useEffect, useRef, useCallback, useState } from 'react';

export const useCustomScrollbar = () => {
  const containerRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
    scrollRatio: 0,
    isScrollable: false
  });

  const rafIdRef = useRef(null);
  const updateScrollState = useCallback(() => {
    if (!containerRef.current) return;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(() => {
      const element = containerRef.current;
      if (!element) return;
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;
      const scrollRatio = scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;
      const isScrollable = scrollHeight > clientHeight;

      setScrollState(prev => {
        // 값이 변하지 않으면 state 업데이트 생략
        if (
          prev.scrollTop === scrollTop &&
          prev.scrollHeight === scrollHeight &&
          prev.clientHeight === clientHeight &&
          prev.scrollRatio === scrollRatio &&
          prev.isScrollable === isScrollable
        ) {
          return prev;
        }
        return {
          scrollTop,
          scrollHeight,
          clientHeight,
          scrollRatio,
          isScrollable
        };
      });
    });
  }, []);

  const scrollTo = useCallback((position) => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    const maxScroll = element.scrollHeight - element.clientHeight;
    const targetScroll = Math.max(0, Math.min(maxScroll, position));

    element.scrollTo({
      top: targetScroll
    });
  }, []);

  const scrollToRatio = useCallback((ratio) => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    const maxScroll = element.scrollHeight - element.clientHeight;
    const targetScroll = maxScroll * Math.max(0, Math.min(1, ratio));

    element.scrollTo({
      top: targetScroll
    });
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // 초기 상태 업데이트 (이미지 로딩 전/후 두 번 보정)
    updateScrollState();
    const initialTimeout = setTimeout(updateScrollState, 0);

    // 스크롤 이벤트 리스너
    const handleScroll = () => {
      updateScrollState();
    };

    // 윈도우 리사이즈 시 상태 보정
    const handleResize = () => {
      updateScrollState();
    };

    // 컨테이너 자체 크기 변경 감지
    const resizeObserver = new ResizeObserver(() => {
      updateScrollState();
    });
    resizeObserver.observe(element);

    // 이미지 로딩 완료 시 스크롤 높이 재계산
    const images = Array.from(element.querySelectorAll('img'));
    const imageListeners = [];
    images.forEach(img => {
      if (img.complete) return;
      const onLoad = () => updateScrollState();
      img.addEventListener('load', onLoad);
      img.addEventListener('error', onLoad);
      imageListeners.push({ img, onLoad });
    });

    // DOM 변경 감지 (자식 추가/삭제 시 재계산). attributeFilter 제거하여 폭넓게 감지
    const mutationObserver = new MutationObserver(() => {
      updateScrollState();
    });
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });

    element.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(initialTimeout);
      element.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      imageListeners.forEach(({ img, onLoad }) => {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onLoad);
      });
    };
  }, [updateScrollState, containerRef.current]);

  return {
    containerRef,
    scrollState,
    scrollTo,
    scrollToRatio,
    updateScrollState
  };
};