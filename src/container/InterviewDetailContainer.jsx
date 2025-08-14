'use client';

import styled from '@emotion/styled';
import { getInterviewById } from '@/utils/supabase/interview';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

function InterviewDetailContainer({ interviewId }) {
  const router = useRouter();
  const [interview, setInterview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      fetchInterview();
    }
  }, [interviewId]);

  const handleBackClick = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <div>로딩 중...</div>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <div>에러가 발생했습니다: {error.message}</div>
      </ErrorContainer>
    );
  }

  if (!interview) {
    return (
      <ErrorContainer>
        <div>인터뷰를 찾을 수 없습니다.</div>
      </ErrorContainer>
    );
  }

  return (<>
  </>)
}

export default InterviewDetailContainer;