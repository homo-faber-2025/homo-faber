'use client';

import { usePathname, useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';

const WordWrapper = styled.main`
  width: 100%;
  height: 100%;
  padding-left: 70px;
  padding-top: 27px;
  position: relative;
  background: #4A90E2;
  background: ${(props) => props.gradientCss};
  background-size: 200% 200%;
  background-position: -100% -100%;
  cursor: ${(props) => (props.pathname && (props.pathname === '/' || props.pathname.startsWith('/word/'))) ? 'pointer' : 'default'};
  transition: 3s ease-in-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-left: solid 3px #2E5BBA;
  box-shadow: -8px 4px 10px 0 rgba(0,0,0,0.25);
  font-family: var(--font-gothic);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(270deg,rgba(74, 144, 226, 0.5) 19%, rgba(229, 229, 229, 0.3) 42%, rgba(229, 229, 229, 0.7) 95%);
  }
`;

const WordPageName = styled.h1`
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.3rem;
  position: absolute;
  transform: rotate(90deg);
  transform-origin: top left;
  top: 17px;
  left: 30px;
`;

const WordList = styled.ul`
  width: 100%;
  height: calc(100dvh + 27px);
  color: #2E5BBA;
  padding-top: 27px;
  margin-top: -27px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const WordItem = styled.li`
  display: flex;
  gap: 17px;
  margin-bottom: 25px;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.8), -2px -1px 4px rgba(46, 91, 186, 0.9);
  mix-blend-mode: hard-light;
  background: linear-gradient(100deg, rgba(46, 91, 186, 0.6), black);
  -webkit-background-clip: text;
  background-clip: text;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  &:hover {
    color: white;
  }
`;

const WordTitle = styled.div`
  font-weight: 800;
  font-size: 5.5rem;
`;

const WordDescription = styled.div`
  font-weight: 700;
  font-size: 2.4rem;
`;

function WordContainer() {
  const pathname = usePathname();
  const router = useRouter();
  const wrapperRef = useRef(null);
  const [cursorPositionPercent, setCursorPositionPercent] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((event) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    const relativeY = (event.clientY - rect.top) / rect.height;
    const toPercent = (v) => Math.max(0, Math.min(100, Math.round(v * 100)));
    setCursorPositionPercent({ x: toPercent(relativeX), y: toPercent(relativeY) });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCursorPositionPercent({ x: 50, y: 50 });
  }, []);

  const gradientCss = useMemo(() => {
    const baseStops = [22, 53, 78, 100];
    const yNormalized = cursorPositionPercent.y / 100; // 0..1
    const delta = (yNormalized - 0.5) * 30; // range about [-15, 15]

    const adjusted = [
      Math.max(0, Math.min(100, baseStops[0] + delta)),
      Math.max(0, Math.min(100, baseStops[1] + delta)),
      Math.max(0, Math.min(100, baseStops[2] + delta)),
      100,
    ];

    // Ensure monotonic increase of stops
    for (let i = 1; i < adjusted.length; i += 1) {
      adjusted[i] = Math.max(adjusted[i], adjusted[i - 1] + 1);
      adjusted[i] = Math.min(adjusted[i], 100);
    }

    const [s1, s2, s3] = adjusted;

    return `radial-gradient(circle at ${cursorPositionPercent.x}% ${cursorPositionPercent.y}%, rgba(74, 144, 226, 1) ${s1}%, rgba(255, 255, 255, 1) ${s2}%, rgba(46, 91, 186, 1) ${s3}%, rgba(255, 255, 255, 1) 100%)`;
  }, [cursorPositionPercent.x, cursorPositionPercent.y]);

  // 홈 페이지에서 WordWrapper 클릭 시 /word로 이동
  // 개별 word 페이지에서 WordWrapper 클릭 시 /word로 이동  
  const handleWordWrapperClick = () => {
    if (pathname === '/') {
      router.push('/word');
    } else if (pathname.startsWith('/word/')) {
      router.push('/word');
    }
  };

  const handleWordClick = (wordId) => {
    router.push(`/word/${wordId}`);
  };

  // 임시 데이터
  const words = [
    { id: 1, title: '호모파베르', description: '만드는 사람' },
    { id: 2, title: '산림동', description: '우리의 공간' },
    { id: 3, title: '제작', description: '창조의 과정' },
    { id: 4, title: '공예', description: '손길의 예술' },
  ];

  return (
    <WordWrapper
      ref={wrapperRef}
      pathname={pathname}
      gradientCss={gradientCss}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleWordWrapperClick}
    >
      <WordPageName>단어 목록</WordPageName>

      <WordList>
        {words.map((word) => (
          <WordItem key={word.id} onClick={() => handleWordClick(word.id)}>
            <WordTitle>{word.title}</WordTitle>
            <WordDescription>{word.description}</WordDescription>
          </WordItem>
        ))}
      </WordList>
    </WordWrapper>
  );
}

export default WordContainer;
