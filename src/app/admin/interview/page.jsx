"use client";

import { useState, useRef } from 'react';
import Editor from '@/components/interview/Editor';
import StoreSelect from '@/components/interview/StoreSelect';
import { createInterview } from '@/utils/supabase/interview';
import styles from './page.module.css';

const InterviewAdminPage = () => {
  const [editorData, setEditorData] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const editorRef = useRef(null);

  const handleEditorChange = (api, event) => {
    console.log('handleEditorChange 호출됨:', { api, event });
  };

  const handleEditorSave = async () => {
    console.log('저장버튼 클릭');

    try {
      if (!editorRef.current || !editorRef.current.isReady()) {
        console.error('Editor가 준비되지 않았습니다');
        return;
      }

      const outputData = await editorRef.current.save();
      const interviewData = {
        "store_id": selectedStoreId,
        "contents": outputData.blocks
      }

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
        console.log('블록 데이터:', outputData.blocks);

        outputData.blocks.forEach((block, index) => {
          console.log(`블록 ${index + 1}:`, {
            타입: block.type,
            데이터: block.data
          });
        });
      } else {
        console.warn('블록 데이터가 비어있습니다');
      }

      await createInterview(interviewData);
      // 여기서 서버로 데이터를 전송
      // await saveToServer(outputData);

    } catch (error) {
      console.error('저장 중 오류 발생:', error);
    }
  };


  const handleLoad = () => {
    // 저장된 데이터를 에디터에 로드
    if (savedData) {
      setEditorData(savedData);
    }
  };

  return (
    <div className={styles.adminInterviewPage}>
      <div className={styles.header}>
        <h1>인터뷰 관리</h1>
        <div className={styles.actions}>
          <button
            onClick={handleEditorSave}
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
          <button

          >
            불러오기
          </button>
        </div>
      </div>

      <div className={styles.formSection}>
        <h2>인터뷰 작성</h2>

        <div className={styles.storeSelectSection}>
          <StoreSelect
            selectedStoreId={selectedStoreId}
            onStoreChange={setSelectedStoreId}
            placeholder="인터뷰를 연결할 스토어를 선택하세요"
          />
        </div>

        <div className={styles.editorSection}>
          <h3>인터뷰 내용</h3>
          <Editor
            ref={editorRef}
            onChange={handleEditorChange}
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewAdminPage;
