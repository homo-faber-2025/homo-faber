'use client';

import { usePathname } from 'next/navigation';
import styled from '@emotion/styled';
import { useCallback, useMemo, useRef, useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Lazy loading으로 컨테이너들을 동적으로 import
const InterviewContainer = lazy(() => import('@/container/InterviewContainer'));
const WordContainer = lazy(() => import('@/container/WordContainer'));
const InfoContainer = lazy(() => import('@/container/InfoContainer'));
const LoginContainer = lazy(() => import('@/container/LoginContainer'));
const SignupContainer = lazy(() => import('@/container/SignupContainer'));
const MypageContainer = lazy(() => import('@/container/MypageContainer'));

const SidePanelWrapper = styled(motion.div)`
  width: 80dvw;
  height: 100dvh;
  position: fixed;
  right: ${(props) => props.right};
  top: 0px;
  z-index: 2;
  overflow: hidden;
  background: orange;
  box-shadow: -8px 4px 10px 0 rgba(0,0,0,0.25);
`;

const LoadingFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-family: var(--font-gothic);
`;

function AnimatedPanel({
  baseRoute,
  onWrapperClick,
  className
}) {
  const pathname = usePathname();
  const [right, setRight] = useState('-81dvw');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드에서만 실행
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 현재 경로가 이 패널의 baseRoute와 일치하는지 확인
  const isActiveRoute = useMemo(() => {
    return pathname.startsWith(`/${baseRoute}`);
  }, [pathname, baseRoute]);

  useEffect(() => {
    if (!isClient) return;

    const newRight = isActiveRoute ? '0' : '-81dvw';
    setRight(newRight);

    // 패널이 활성화되면 렌더링 시작
    if (isActiveRoute) {
      setIsVisible(true);
      // 컴포넌트가 로드되면 상태 업데이트
      setIsLoaded(true);
      // 직접 URL 접근 시에도 애니메이션 작동하도록 설정
      setShouldAnimate(true);
    } else {
      // 패널이 비활성화되면 애니메이션 완료 후 렌더링 중지
      const timer = setTimeout(() => {
        setIsVisible(false);
        // 메모리 절약을 위해 로드 상태도 리셋
        setTimeout(() => {
          if (!isActiveRoute) {
            setIsLoaded(false);
            setShouldAnimate(false);
          }
        }, 500);
      }, 1000); // 애니메이션 duration과 동일

      return () => clearTimeout(timer);
    }
  }, [isActiveRoute, isClient]);

  // baseRoute에 따라 컴포넌트 렌더링 (조건부 렌더링)
  const renderComponent = useCallback(() => {
    if (!isVisible || !isLoaded) return null;

    const Component = (() => {
      switch (baseRoute) {
        case 'interview':
          return InterviewContainer;
        case 'word':
          return WordContainer;
        case 'info':
          return InfoContainer;
        case 'login':
          return LoginContainer;
        case 'signup':
          return SignupContainer;
        case 'mypage':
          return MypageContainer;
        default:
          return null;
      }
    })();

    if (!Component) return null;

    return (
      <Suspense fallback={<LoadingFallback>Loading...</LoadingFallback>}>
        <Component onLoadComplete={() => setShouldAnimate(true)} />
      </Suspense>
    );
  }, [baseRoute, isVisible, isLoaded]);

  // 패널이 완전히 숨겨져 있으면 아예 렌더링하지 않음
  if (!isVisible && !isActiveRoute) {
    return null;
  }

  // 클라이언트 사이드에서만 애니메이션 적용
  const currentRight = isClient ? right : null;

  return (
    <AnimatePresence mode="wait">
      <SidePanelWrapper
        onClick={onWrapperClick}
        initial={{ right: '-81dvw' }}
        animate={{ right: isClient ? right : '-81dvw' }}
        exit={{ right: '-81dvw' }}
        transition={{ duration: 1, ease: [0.2, 0, 0.4, 1] }}
        right={currentRight}
        className={className}
      >
        {renderComponent()}
      </SidePanelWrapper>
    </AnimatePresence>
  );
}

export default AnimatedPanel;