"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createWord } from '@/utils/supabase/word';
import WordForm from '@/components/admin/WordForm';
import styled from '@emotion/styled';

const AdminWordCreatePage = styled.div`
  padding: 20px;
  background: white;
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

const WordCreatePage = () => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const saveFormRef = useRef(null);

  const handleBack = () => {
    router.push('/admin/word');
  };

  const handleSave = async (wordData) => {
    try {
      setIsSaving(true);
      await createWord(wordData);
      alert('저장 완료');
      router.push('/admin/word');
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
    <AdminWordCreatePage>
      <Header>
        <h1>새 단어 추가</h1>
        <Actions>
          <BackBtn onClick={handleBack}>목록으로</BackBtn>
          <SaveBtn onClick={handleSaveClick} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </SaveBtn>
        </Actions>
      </Header>

      <WordForm
        mode="create"
        onSave={handleSave}
        onBack={handleBack}
        isSaving={isSaving}
        onSaveClick={saveFormRef}
      />
    </AdminWordCreatePage>
  );
};

export default WordCreatePage;
