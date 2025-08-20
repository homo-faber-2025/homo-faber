'use client';

import styled from '@emotion/styled';
import { getInterviewById } from '@/utils/supabase/interview';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import EditorInterviewRender from '@/components/interview/EditorInterviewRenderer';
import { useCustomScrollbar } from '@/hooks/useCustomScrollbar';
import { motion, AnimatePresence } from 'motion/react';
import CustomScrollbar from '@/components/common/CustomScrollbar';

const DetailWrapper = styled(motion.main)`
  width: calc(80vw - 46px);
  height: 100dvh;
  padding: 0px 10px 20px 50px;
  background-color: #F7F7F7;
  position: absolute;
  right: ${(props) => props.right};
  top: 0px;
  z-index: 4;
  box-shadow: -2px 0 4px 0 rgba(84,84,84,0.57);
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-left: 60px;
  padding-right: 130px;
  padding-bottom: 100px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`
const DetailPageName = styled.h1`
  font-family: var(--font-gothic);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.3rem;
  position: sticky;
  transform: rotate(90deg);
  transform-origin: top left;
  top: 17px;
  margin-left: -29px;
`

const InterviewHeader = styled.div`
  display: flex;
  gap: 2dvw;
  margin-top: 12px;
`

const InterviewTitle = styled.div`
  font-family: var(--font-gothic);
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: -5px;
  text-align: center;
`
const InterviewStore = styled.h2`
  font-weight: 800;
  font-size: 4.3dvw;
  background-color:rgb(146, 146, 146);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 3px 4px 5px rgba(245, 245, 245, 0.3), -0.1px -0.1px 6px rgba(100,92,92,0.2), 2px 2px 2px rgba(255,255,255,0.5);
  position: relative;
  padding-top: 7px;
  transition: text-shadow .4s ;

  &:hover{
      text-shadow: 0px 2px 3px rgba(221, 221, 221, 0.8), -0.1px -0.1px 5px rgba(100,92,92,0.6), 2px 2px 10px rgba(255,255,255,0.5);
  }
`
const InterviewPerson = styled.h3`
  font-weight: 800;
  font-size: 1.6dvw;
  padding-top: 4px;
  background-color:rgb(145, 145, 145);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 3px 4px 5px rgba(245, 245, 245, 0.3), -0.1px -0.1px 6px rgba(100,92,92,0.2), 2px 2px 2px rgba(255,255,255,0.5);
`
const InterviewIntro = styled.h4`
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 1.75;
  word-break: keep-all;
  padding: 0 20px;
  text-align: center;
  color:rgb(94, 94, 94);
`

const InterviewCoverImg = styled.img`
  height: 100.2dvh;
  width: auto;
  margin-right: -130px;
  margin-left: auto;
  // margin-top: -93px;
  object-fit: contain;
  border-radius: 0% 0 0% 43%;
  margin-top: -26px;
`

const InterviewInfo = styled.div`
  font-weight: 500;
  font-size: 1.1rem;
  margin-bottom: 8px;
  margin-left: auto;

  & :first-of-type{
    margin-top: 200px;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: var(--font-gothic);
  font-size: 1.5rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
`;

function InterviewDetailContainer({ }) {
  const router = useRouter();
  const pathname = usePathname();
  const [interview, setInterview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [right, setRight] = useState('-100dvw');
  const interviewId = pathname.startsWith('/interview/') && pathname !== '/interview' ? pathname.split('/')[2] : null;

  const { containerRef, scrollState, scrollToRatio } = useCustomScrollbar();

  // pathname 변경 시 width 업데이트
  useEffect(() => {
    const newRight = pathname.startsWith('/interview/') && pathname !== '/interview' ? '0px' : '-100dvw';
    setRight(newRight);
  }, [pathname]);

  useEffect(() => {
    async function fetchInterview() {
      try {
        const data = await getInterviewById(interviewId);
        if (!data) {
          setError(new Error('인터뷰를 찾을 수 없습니다.'));
          return;
        }
        setInterview(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (interviewId) {
      setIsLoading(true);
      setError(null);
      setInterview(null);
      fetchInterview();
    } else {
      setIsLoading(false);
      setError(null);
      setInterview(null);
    }
  }, [interviewId]);

  return (
    <AnimatePresence mode="wait">
      {interviewId && (
        <DetailWrapper
          key={interviewId}
          ref={containerRef}
          right={right}
          initial={{ right: '-100dvw' }}
          animate={{ right: right }}
          exit={{ right: '-100dvw' }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        >
          {error ? (
            <ErrorContainer>
              <div>에러가 발생했습니다: {error.message}</div>
            </ErrorContainer>
          ) : isLoading ? (
            <LoadingContainer>
              <div>로딩 중...</div>
            </LoadingContainer>
          ) : !interview ? (
            <ErrorContainer>
              <div>인터뷰를 찾을 수 없습니다.</div>
            </ErrorContainer>
          ) : (
            <>
              <DetailPageName>{interview?.stores.name}</DetailPageName>
              <InterviewHeader>
                <InterviewTitle>
                  <InterviewStore data-text={interview?.stores.name}>{interview?.stores.name}</InterviewStore>
                  <InterviewPerson>{interview?.stores.person}</InterviewPerson>
                  <InterviewIntro>{interview?.intro}</InterviewIntro>
                </InterviewTitle>

                <InterviewCoverImg src={interview?.cover_img} alt="이미지" />
              </InterviewHeader>
              <EditorInterviewRender item={interview?.contents} />
              <InterviewInfo>{interview?.date}</InterviewInfo>
              <InterviewInfo>{interview?.interviewee}</InterviewInfo>
            </>
          )}

          {/* 커스텀 스크롤바 */}
          <CustomScrollbar
            scrollState={scrollState}
            onScrollToRatio={scrollToRatio}
          />
        </DetailWrapper>
      )}
    </AnimatePresence>
  );
}

export default InterviewDetailContainer;