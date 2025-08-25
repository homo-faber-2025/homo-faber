'use client';

import { usePathname, useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useWords } from '@/hooks/useWord';

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

const WordItemWrapper = styled.div`
  display:flex;
  overflow-y: hidden;
`;

const WordList = styled.ul`
  // width: 100%;
  color: #2E5BBA;
  padding-top: 27px;
  margin-top: -27px;
  height: 100%;
  overflow-y: auto;
  padding-right: 70px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const WordItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.8), -2px -1px 4px rgba(46, 91, 186, 0.9);
  mix-blend-mode: hard-light;
  background: linear-gradient(100deg, rgba(46, 91, 186, 0.6), black);
  -webkit-background-clip: text;
  background-clip: text;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  position: relative;
  
  &:hover {
    color: white;
  }
  
  &.active {
    color: white;
  }
`;

const WordTitle = styled.div`
  font-weight: 800;
  font-size: 4.5rem;
  flex-shrink: 0;
`;

const WordMeaning = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 15px;
  font-weight: 600;
  font-size: 1.3rem;
  line-height: 1.6;
  word-break: keep-all;
  color: #2E5BBA;
  max-width: 400px;
  z-index: 1000;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  animation: slideIn 0.4s ease-out;
  margin: 10px;
  box-shadow: 2px 1px 10px 3px rgba(79, 90, 247, 0.2);
  
  @keyframes slideIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const WordMeaningsContainer = styled.div`;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  overflow-y: auto;
  height: 100dvh;
  z-index: 1000;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(46, 91, 186, 0.3);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(46, 91, 186, 0.5);
  }
`;



const SearchContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 70px;
  z-index: 10;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: #2E5BBA;
  font-size: 1rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  min-width: 200px;

  &::placeholder {
    color: rgba(46, 91, 186, 0.7);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  background: rgba(46, 91, 186, 0.8);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(46, 91, 186, 1);
    border-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
`;



const ClearButton = styled.button`
  padding: 8px 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #2E5BBA;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.8);
  }
`;

function WordContainer({ onLoadComplete, selectedWordId: initialSelectedWordId }) {
  const pathname = usePathname();
  const router = useRouter();
  const wrapperRef = useRef(null);
  const [cursorPositionPercent, setCursorPositionPercent] = useState({ x: 50, y: 50 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWordIds, setSelectedWordIds] = useState(initialSelectedWordId ? [initialSelectedWordId] : []);

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

  onLoadComplete();
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
  const handleWordWrapperClick = () => {
    if (pathname === '/') {
      router.push('/word');
    }
  };

  const { words, loading, error, searchWordsByName, fetchWords } = useWords();

  console.log('Words data:', words, 'Loading:', loading, 'Error:', error);

  const handleWordClick = (wordId, e) => {
    e.stopPropagation();
    console.log('Word clicked:', wordId, 'Current selectedWordIds:', selectedWordIds);

    // 이미 선택된 단어인지 확인
    if (selectedWordIds.includes(wordId)) {
      // 이미 선택된 단어라면 제거
      setSelectedWordIds(prev => {
        const newIds = prev.filter(id => id !== wordId);
        console.log('Removing word, new selectedWordIds:', newIds);
        return newIds;
      });
    } else {
      // 새로운 단어라면 추가
      setSelectedWordIds(prev => {
        const newIds = [...prev, wordId];
        console.log('Adding word, new selectedWordIds:', newIds);
        return newIds;
      });
    }
  };

  const handleSearch = () => {
    searchWordsByName(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchWords();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // initialSelectedWordId가 변경될 때 selectedWordIds 업데이트
  useEffect(() => {
    if (initialSelectedWordId) {
      setSelectedWordIds([initialSelectedWordId]);
    } else {
      setSelectedWordIds([]);
    }
  }, [initialSelectedWordId]);

  return (
    <WordWrapper
      ref={wrapperRef}
      pathname={pathname}
      gradientCss={gradientCss}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={pathname === '/' ? handleWordWrapperClick : undefined}
    >
      <WordPageName>단어 목록</WordPageName>

      <SearchContainer onClick={(e) => e.stopPropagation()}>
        <SearchInput
          type="text"
          placeholder="단어명으로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <SearchButton onClick={handleSearch}>
          검색
        </SearchButton>

        {searchQuery && (
          <ClearButton onClick={handleClearSearch} title="검색 초기화">
            ✕
          </ClearButton>
        )}
      </SearchContainer>

      <WordItemWrapper>
        <WordList>
          {loading ? (
            <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
              단어 목록을 불러오는 중...
            </div>
          ) : error ? (
            <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
              오류가 발생했습니다: {error}
            </div>
          ) : words.length === 0 ? (
            <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
              {searchQuery ? `"${searchQuery}"에 대한 검색 결과가 없습니다.` : '등록된 단어가 없습니다.'}
            </div>
          ) : (
            words.map((word) => (
              <WordItem
                key={word.id}
                onClick={(e) => handleWordClick(word.id, e)}
                className={selectedWordIds.includes(word.id) ? 'active' : ''}
              >
                <WordTitle>{word.name}</WordTitle>
              </WordItem>
            ))
          )}
        </WordList>
        {selectedWordIds.length > 0 && (
          <WordMeaningsContainer>
            {selectedWordIds.map((wordId, index) => {
              const selectedWord = words.find(word => word.id === wordId);
              return selectedWord ? (
                <WordMeaning
                  key={wordId}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <h3 style={{ margin: '0', fontSize: '1.5rem', color: '#2E5BBA' }}>
                      {selectedWord.name}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWordIds(prev => prev.filter(id => id !== wordId));
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.2rem',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '0',
                        marginLeft: '10px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <p style={{ margin: '0 0 20px 0' }}>
                    {selectedWord.meaning}
                  </p>
                  {selectedWord.img && selectedWord.img.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                      {selectedWord.img.map((img) => (
                        <img
                          key={img.id}
                          src={img.url}
                          alt={img.caption || selectedWord.name}
                          style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                            marginBottom: '10px'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </WordMeaning>
              ) : null;
            })}
          </WordMeaningsContainer>
        )}
      </WordItemWrapper>
    </WordWrapper>
  );
}

export default WordContainer;
