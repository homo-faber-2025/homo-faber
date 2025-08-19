"use client";

import styled from '@emotion/styled';
import { useState, useRef, useCallback, useEffect } from 'react';

const ScrollbarContainer = styled.div`
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: calc(100dvh - 50px);
  background-color: #737373;
  border-radius: 30px;
  z-index: 10;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.3s ease;
  cursor: pointer;
  box-shadow: inset 2px 4px 4px 0 rgba(0,0,0,0.3);
`;

const ScrollbarThumb = styled.div`
  position: absolute;
  top: ${props => props.$position}px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: 
    radial-gradient(circle at center, #FFFFFF 0%, rgba(135, 135, 135, 0.24) 46%),
    conic-gradient(
      from 120deg,
      rgb(119, 119, 119) 61deg, 
      rgba(145, 145, 145, 1) 151deg,
      rgba(239, 239, 239, 1) 234deg, 
      rgba(160, 156, 156, 1) 288deg, 
      rgba(107, 107, 107, 1) 345deg
    );
  border-radius: 50%;
  cursor: grab;
  transition: transform 0.1s ease;
  border: solid 0.5px black;
  box-shadow: inset 0 1px 8px 1px rgba(255,255,255,0.9), 2px 4px 4px 0 rgba(0,0,0,0.35);

  &:hover {
    transform: translateX(-50%) scale(1.1);
  }

  &:active {
    cursor: grabbing;
    transform: translateX(-50%) scale(0.95);
  }
`;

const CustomScrollbar = ({ scrollState, onScrollToRatio }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const scrollbarRef = useRef(null);
  const dragStartRef = useRef({ y: 0, ratio: 0 });
  const hideTimeoutRef = useRef(null);

  const { scrollRatio, isScrollable, clientHeight, scrollHeight } = scrollState;

  const containerHeight = scrollbarRef.current?.getBoundingClientRect().height ?? (window.innerHeight - 100);
  const thumbSize = 40; // 썸네일 크기

  // 썸네일 위치 계산 (픽셀 단위)
  const thumbPosition = scrollRatio * (containerHeight - thumbSize);

  // 윈도우 리사이즈 시 컨테이너 높이 재계산을 위한 상태
  const [containerDimensions, setContainerDimensions] = useState({ height: 0 });

  // 윈도우 리사이즈 감지
  useEffect(() => {
    const updateDimensions = () => {
      if (scrollbarRef.current) {
        const rect = scrollbarRef.current.getBoundingClientRect();
        setContainerDimensions({ height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  // 윈도우 리사이즈 시 재계산을 위한 상태 업데이트
  const [, forceUpdate] = useState({});

  // 윈도우 리사이즈 감지 및 강제 리렌더링
  useEffect(() => {
    const handleResize = () => {
      forceUpdate({});
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 스크롤바 표시/숨김 관리
  useEffect(() => {
    if (!isScrollable) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    // 자동 숨김 타이머
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      if (!isDragging) {
        setIsVisible(false);
      }
    }, 2000);

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [scrollRatio, isScrollable, isDragging]);

  const handleMouseDown = useCallback((e) => {
    if (!scrollbarRef.current) return;

    const rect = scrollbarRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const clickRatio = Math.max(0, Math.min(1, (clickY - thumbSize / 2) / (rect.height - thumbSize)));

    setIsDragging(true);
    setIsVisible(true);

    dragStartRef.current = {
      y: e.clientY,
      ratio: scrollRatio
    };

    // 클릭 위치로 즉시 스크롤
    onScrollToRatio(clickRatio);

    e.preventDefault();
    e.stopPropagation();
  }, [scrollRatio, onScrollToRatio]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !scrollbarRef.current) return;

    const rect = scrollbarRef.current.getBoundingClientRect();
    const deltaY = e.clientY - dragStartRef.current.y;
    const containerHeight = rect.height; // 실제 컨테이너 높이 사용
    const thumbSize = 40;
    const deltaRatio = deltaY / (containerHeight - thumbSize);
    const newRatio = dragStartRef.current.ratio + deltaRatio;

    onScrollToRatio(Math.max(0, Math.min(1, newRatio)));
    e.preventDefault();
  }, [isDragging, onScrollToRatio]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleScrollbarClick = useCallback((e) => {
    if (!scrollbarRef.current) return;
    if (isDragging) return; // 드래그 중에는 클릭 처리 무시

    // thumb를 클릭했을 때는 track click 처리 방지
    const target = e.target;
    if (target && target.closest('[data-role="thumb"]')) {
      return;
    }

    const rect = scrollbarRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const clickRatio = Math.max(0, Math.min(1, (clickY - thumbSize / 2) / (rect.height - thumbSize)));

    onScrollToRatio(clickRatio);
  }, [onScrollToRatio, isDragging]);

  // 글로벌 마우스 이벤트 등록
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 마우스 호버 시 스크롤바 표시
  const handleMouseEnter = useCallback(() => {
    if (isScrollable) {
      setIsVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    }
  }, [isScrollable]);

  const handleMouseLeave = useCallback(() => {
    if (!isDragging && hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }
  }, [isDragging]);

  if (!isScrollable) return null;

  return (
    <ScrollbarContainer
      ref={scrollbarRef}
      $visible={isVisible}
      onClick={handleScrollbarClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ScrollbarThumb
        $position={thumbPosition}
        data-role="thumb"
        onMouseDown={handleMouseDown}
      />
    </ScrollbarContainer>
  );
};

export default CustomScrollbar;