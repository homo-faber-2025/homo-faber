"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createInterview } from '@/utils/supabase/interview';
import InterviewForm from '@/components/admin/InterviewForm';
import styled from '@emotion/styled';

const AdminInterviewCreatePage = styled.div`
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



const InterviewCreatePage = () => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const saveFormRef = useRef(null);

  const handleBack = () => {
    router.push('/admin/interview');
  };

  const handleSave = async (interviewData) => {
    try {
      setIsSaving(true);
      await createInterview(interviewData);
      alert('저장 완료');
      router.push('/admin/interview');
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveClick = () => {
    if (saveFormRef.current) {
      saveFormRef.current();
    }
  };

  return (
    <InterviewForm
      mode="create"
      onSave={handleSave}
      onBack={handleBack}
      isSaving={isSaving}
      onSaveClick={saveFormRef}
    />

  );
};

export default InterviewCreatePage;
