'use client';

import { usePathname, useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { getInterviews } from '@/utils/supabase/interview';

const InterviewWrapper = styled.main`
  width: ${(props) => (props.pathname.startsWith('/interview') ? '80vw' : '10vw')};
  height: 100dvh;
  padding-left: 70px;
  padding-top: 27px;
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 1;
  background: #7C7C7C;
  background: ${(props) => props.gradientCss};
  background-size: 200% 200%;
  background-position: -100% -100%;
  cursor: ${(props) => (props.pathname === '/' || props.pathname.startsWith('/store/') ? 'pointer' : 'default')};
  transition: 3s ease-in-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-left: solid 3px #DADADA;
  box-shadow: -8px 4px 10px 0 rgba(0,0,0,0.25);
  font-family: var(--font-gothic);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(270deg,rgba(124, 124, 124, 0.5) 19%, rgba(229, 229, 229, 0.3) 42%, rgba(229, 229, 229, 0.7) 95%);

  }
`;

const InterviwPageName = styled.h1`
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.3rem;
  position: absolute;
  transform: rotate(90deg);
  transform-origin: top left;
  top: 17px;
  left: 32px;
`

const InterviewList = styled.ul`
  width: 100%;
  height: 100%;
  color: #6E6E6E;
  margin-top: -3px;
`

const InterviewItem = styled.li`
  display: flex;
  gap: 17px;
  margin-bottom: 25px;
  text-shadow:  1px 1px 1px rgba(255, 255, 255, 0.8), -2px -1px 4px rgba(94, 86, 86, 0.9);
  mix-blend-mode: hard-light;
  background: linear-gradient(100deg, rgba(70,70,70,0.6), black);
  -webkit-background-clip: text;
  // -webkit-text-fill-color: rgba(94, 94, 94, 0.88);
  background-clip: text;
  cursor: pointer;
  &:hover{
    color: green;
  }
  `

const InterviewStore = styled.div`
  font-weight: 800;
  font-size: 5.5rem;
`
const InterviewPerson = styled.div`   
  font-weight: 700;
  font-size: 2.4rem;
`

function InterviewContainer() {
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

    return `radial-gradient(circle at ${cursorPositionPercent.x}% ${cursorPositionPercent.y}%, rgba(198, 198, 198, 1) ${s1}%, rgba(255, 255, 255, 1) ${s2}%, rgba(196, 196, 196, 1) ${s3}%, rgba(255, 255, 255, 1) 100%)`;
  }, [cursorPositionPercent.x, cursorPositionPercent.y]);

  // 홈 페이지에서 StoreWrapper 클릭 시 /store로 이동
  // 개별 스토어 페이지에서 StoreWrapper 클릭 시 /store로 이동  
  const handleInterviewWrapperClick = () => {
    if (pathname === '/') {
      router.push('/interview');
    } else if (pathname.startsWith('/interview/')) {
      router.push('/interview');
    }
  };

  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const data = await getInterviews();
        setInterviews(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  if (error) {
    return <div>에러가 발생했습니다: {error.message}</div>;
  }

  return (
    <>
      <InterviewWrapper
        ref={wrapperRef}
        pathname={pathname}
        gradientCss={gradientCss}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleInterviewWrapperClick}
      >
        <InterviwPageName>인터뷰 목록</InterviwPageName>

        {isLoading ? (
          <div style={{ padding: '16px' }}>로딩 중...</div>
        ) : (
          <InterviewList>
            {interviews.map((interview) => (
              <InterviewItem key={interview.id}>
                <InterviewStore>{interview.stores?.name}</InterviewStore>
                <InterviewPerson>{interview.stores?.person}</InterviewPerson>
              </InterviewItem>
            ))}
          </InterviewList>
        )}
      </InterviewWrapper>
    </>
  );
}

export default InterviewContainer;