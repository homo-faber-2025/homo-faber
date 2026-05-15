'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useInterviewDetail } from '@/hooks/useInterviews';
import EditorInterviewRender from '@/components/interview/EditorInterviewRenderer';
import { useCustomScrollbar } from '@/hooks/useCustomScrollbar';
import { AnimatePresence } from 'motion/react';
import CustomScrollbar from '@/components/common/CustomScrollbar';
import useWindowSize from '@/hooks/useWindowSize';
import * as S from '@/styles/interview/interviewDetailContainer.style';
import Link from 'next/link';
import Loader from '@/components/common/Loader';
import Error from '@/components/common/Error';

function InterviewDetailContainer({ }) {
  const pathname = usePathname();
  const { isMobile, isReady } = useWindowSize();
  // 패널 상태: 'hidden' | 'expanded' | 'collapsed'
  const [panelState, setPanelState] = useState('hidden');
  const prevInterviewIdRef = useRef(null); // 이전 interviewId 추적
  const interviewId = pathname.startsWith('/interview/') && pathname !== '/interview' ? pathname.split('/')[2] : null;
  const { interview, isLoading, error } = useInterviewDetail(interviewId);
  const { containerRef, scrollState, scrollToRatio } = useCustomScrollbar();

  // 분기점 1: interviewId가 나타날 때 (마운트) - expanded 상태로 시작
  useEffect(() => {
    if (interviewId && isReady) {
      // 새로운 interviewId로 변경되었을 때만 expanded로 설정
      if (prevInterviewIdRef.current !== interviewId) {
        setPanelState('expanded');
        prevInterviewIdRef.current = interviewId;
        // InterviewContainer도 expanded 되도록 이벤트 발생
        window.dispatchEvent(new CustomEvent('expandPanel', { detail: { route: 'interview' } }));
      }
    } else if (!interviewId) {
      setPanelState('hidden');
      prevInterviewIdRef.current = null;
    }
  }, [interviewId, isReady]);

  // 분기점 2: 지도 클릭 시 - collapsed 상태로 변경
  useEffect(() => {
    if (!interviewId) return;

    const handleCollapsePanel = () => {
      if (panelState === 'expanded') {
        setPanelState('collapsed');
      }
    };

    window.addEventListener('collapsePanel', handleCollapsePanel);
    return () => {
      window.removeEventListener('collapsePanel', handleCollapsePanel);
    };
  }, [interviewId, panelState]);

  // 분기점 3: 패널 클릭 시 - expanded 상태로 변경
  const handlePanelClick = (e) => {
    const target = e.target;
    const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], [onClick], img');

    if (!isInteractive) {
      e.stopPropagation();
      if (panelState === 'collapsed') {
        setPanelState('expanded');
        // InterviewContainer도 expanded 되도록 이벤트 발생
        window.dispatchEvent(new CustomEvent('expandPanel', { detail: { route: 'interview' } }));
      }
    }
  };

  // 패널 상태에 따른 initial 위치 계산 (transform 사용)
  const getInitialPosition = useMemo(() => {
    const isFirstMount = prevInterviewIdRef.current !== interviewId && interviewId !== null;

    if (panelState === 'hidden') {
      return isMobile ? { y: '100dvh' } : { x: '100dvw' };
    }

    if (panelState === 'expanded') {
      // 처음 마운트될 때만 화면 밖에서 시작, 이후에는 initial 제거하여 motion이 자동 감지
      return isFirstMount ? (isMobile ? { y: '100dvh' } : { x: '100dvw' }) : undefined;
    }

    // collapsed - expanded에서 collapsed로 변경될 때는 현재 위치에서 시작
    return undefined;
  }, [panelState, interviewId, isMobile]);

  // motion이 panelState를 직접 추적하도록 animate 값 계산 (transform 사용)
  const animateValue = useMemo(() => {
    if (panelState === 'hidden') {
      return isMobile ? { y: '100dvh' } : { x: '100dvw' };
    }
    if (panelState === 'expanded') {
      return isMobile ? { y: 0 } : { x: 0 };
    }
    // collapsed
    return isMobile ? { y: 'calc(-26px + 80dvh)' } : { x: 'calc(80vw - 200px)' };
  }, [panelState, isMobile]);


  return (
    <AnimatePresence>
      {interviewId && (
        <S.DetailWrapper
          key={interviewId}
          ref={containerRef}
          isMobile={isMobile}
          initial={getInitialPosition}
          animate={animateValue}
          exit={isMobile ? { y: '100dvh' } : { x: '100dvw' }}
          transition={{ duration: 1, ease: [0.2, 0, 0.4, 1] }}
          onClick={handlePanelClick}
        >
          <S.DetailPageName>인터뷰: {interview?.stores.name} {interview?.stores.person} 기술자 </S.DetailPageName>

          {error ? (
            <Error style={{ marginTop: isMobile ? '20px' : '-4px' }} />
          ) : isLoading ? (
            <Loader baseColor="#F7F7F7" style={{ marginTop: isMobile ? '-22px' : '-10px', marginLeft: isMobile ? '-12px' : '-10px', transform: isMobile ? 'none' : 'rotate(90deg)', transformOrigin: isMobile ? 'none' : 'top left', position: "relative", zIndex: "-10" }} />
          ) : !interview ? (
            <Error style={{ marginTop: isMobile ? '20px' : '-4px' }} message="인터뷰를 찾을 수 없습니다." />
          ) : (
            <>
              <S.InterviewHeader>
                <S.InterviewTitle>
                  <S.InterviewStore data-text={interview?.stores.name}>{interview?.stores.name}</S.InterviewStore>
                  <S.InterviewPerson>{interview?.stores.person}</S.InterviewPerson>

                </S.InterviewTitle>

                <S.InterviewIntro>{interview?.intro}</S.InterviewIntro>
                <S.InterviewCoverImg src={interview?.cover_img} alt="이미지" />
              </S.InterviewHeader>

              <EditorInterviewRender item={interview?.contents} />

              <S.InterviewLink> {interview?.stores.name} {interview?.stores.person} 기술자와 <br />산림동의 다른 기술자들의 이야기를 <br /><span style={{ fontWeight: '900', padding: '8px 0px', color: 'rgb(71, 71, 71)' }}> &lt;산림동의 만드는 사람들&gt;</span> 책에서 계속 만나 보실 수 있습니다<Link href='https://smartstore.naver.com/listentothecity/products/12477105528' target='_blank'> 구매 링크 바로가기</Link></S.InterviewLink>

            </>
          )}


          {/* 커스텀 스크롤바 */}
          {!isMobile && (
            <CustomScrollbar
              scrollState={scrollState}
              onScrollToRatio={scrollToRatio}
            />
          )}
        </S.DetailWrapper>
      )}
    </AnimatePresence>
  );
}

export default InterviewDetailContainer;