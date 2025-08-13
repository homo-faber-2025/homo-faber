"use client";

import { useState, useRef } from 'react';
import Editor from '@/components/interview/Editor';
import StoreSelect from '@/components/interview/StoreSelect';
import { createInterview } from '@/utils/supabase/interview';
import styled from '@emotion/styled';

const AdminInterviewPage = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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

const LoadBtn = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #6c757d;
  color: white;

  &:hover:not(:disabled) {
    background-color: #545b62;
  }

  &:disabled {
    background-color: #adb5bd;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const FormSection = styled.div`
  margin-top: 20px;

  h2 {
    margin-bottom: 20px;
    color: #333;
    font-size: 1.8rem;
    border-bottom: 2px solid #e1e5e9;
    padding-bottom: 10px;
  }
`;

const StoreSelectSection = styled.div`
  margin-bottom: 30px;
`;

const EditorSection = styled.div`
  margin-top: 20px;

  h3 {
    margin-bottom: 15px;
    color: #555;
    font-size: 1.3rem;
  }
`;

const InterviewAdminPage = () => {
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);

  const handleEditorChange = (api, event) => {
    console.log('handleEditorChange 호출됨:', { api, event });
  };

  const handleEditorSave = async () => {
    try {
      if (!editorRef.current || !editorRef.current.isReady()) {
        console.error('Editor가 준비되지 않았습니다');
        return;
      }

      const outputData = await editorRef.current.save();
      const interviewData = {
        store_id: selectedStoreId,
        contents: outputData.blocks,
      };

      if (!outputData) {
        console.error('저장된 데이터가 없습니다');
        return;
      }

      console.log('=== Editor.js 저장 데이터 ===');
      console.log('전체 데이터:', outputData);
      console.log('시간:', new Date(outputData.time).toLocaleString());
      console.log('버전:', outputData.version);
      console.log('블록 개수:', outputData.blocks ? outputData.blocks.length : 0);

      if (outputData.blocks && outputData.blocks.length > 0) {
        outputData.blocks.forEach((block, index) => {
          console.log(`블록 ${index + 1}:`, {
            타입: block.type,
            데이터: block.data,
          });
        });
      } else {
        console.warn('블록 데이터가 비어있습니다');
      }

      await createInterview(interviewData);
      alert('저장 완료');
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
    }
  };

  return (
    <AdminInterviewPage>
      <Header>
        <h1>인터뷰 관리</h1>
        <Actions>
          <SaveBtn onClick={handleEditorSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </SaveBtn>
          {/* 필요 시 LoadBtn 추가 */}
        </Actions>
      </Header>

      <FormSection>
        <h2>인터뷰 작성</h2>

        <StoreSelectSection>
          <StoreSelect
            selectedStoreId={selectedStoreId}
            onStoreChange={setSelectedStoreId}
            placeholder="인터뷰를 연결할 스토어를 선택하세요"
          />
        </StoreSelectSection>

        <EditorSection>
          <h3>인터뷰 내용</h3>
          <Editor ref={editorRef} onChange={handleEditorChange} />
        </EditorSection>
      </FormSection>
    </AdminInterviewPage>
  );
};

export default InterviewAdminPage;
