"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getInterviewById, updateInterview } from '@/utils/supabase/interview';
import InterviewForm from '@/components/admin/InterviewForm';
import styled from '@emotion/styled';

const AdminInterviewEditPage = styled.div`
  padding: 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  background: white;
  z-index: 10;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e1e5e9;

  h1 {
    margin: 0;
    color: #333;
    font-size: 2rem;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const BackBtn = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #6c757d;
  color: white;

  &:hover {
    background-color: #545b62;
  }
`;

const SaveBtn = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #007bff;
  color: white;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;



const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: red;
  font-size: 1.1rem;
`;

const InterviewEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const interviewId = params.id;

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const saveFormRef = useRef(null);

  useEffect(() => {
    const loadInterview = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getInterviewById(interviewId);
        console.log('로드된 인터뷰 데이터:', data);
        console.log('contents 데이터:', data?.contents);
        setInterviewData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (interviewId) {
      loadInterview();
    }
  }, [interviewId]);

  const handleBack = () => {
    router.push('/admin/interview');
  };

  const handleSave = async (interviewData) => {
    try {
      setIsSaving(true);
      await updateInterview(interviewId, interviewData);
      alert('수정 완료');
      router.push('/admin/interview');
    } catch (error) {
      console.error('수정 중 오류 발생:', error);
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveClick = () => {
    if (saveFormRef.current) {
      saveFormRef.current();
    }
  };

  if (isLoading) {
    return (
      <AdminInterviewEditPage>
        <Header>
          <h1>인터뷰 수정</h1>
          <BackBtn onClick={handleBack}>목록으로</BackBtn>
        </Header>
        <LoadingMessage>인터뷰 데이터를 불러오는 중...</LoadingMessage>
      </AdminInterviewEditPage>
    );
  }

  if (error) {
    return (
      <AdminInterviewEditPage>
        <Header>
          <h1>인터뷰 수정</h1>
          <BackBtn onClick={handleBack}>목록으로</BackBtn>
        </Header>
        <ErrorMessage>오류가 발생했습니다: {error}</ErrorMessage>
      </AdminInterviewEditPage>
    );
  }

  return (
    <AdminInterviewEditPage>
      <Header>
        <h1>인터뷰 수정</h1>
        <Actions>
          <BackBtn onClick={handleBack}>목록으로</BackBtn>
          <SaveBtn onClick={handleSaveClick} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </SaveBtn>
        </Actions>
      </Header>

      <InterviewForm
        mode="edit"
        initialData={interviewData}
        onSave={handleSave}
        onBack={handleBack}
        isSaving={isSaving}
        isLoading={isLoading}
        onSaveClick={saveFormRef}
      />
    </AdminInterviewEditPage>
  );
};

export default InterviewEditPage;
