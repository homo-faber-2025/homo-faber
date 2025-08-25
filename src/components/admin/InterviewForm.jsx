"use client";

import { useState, useRef, useEffect } from 'react';
import Editor from '@/components/interview/Editor';
import StoreSelect from '@/components/interview/StoreSelect';
import { checkAndCompressImage } from '@/utils/imageCompression';
import { createClient } from '@/utils/supabase/client';
import styled from '@emotion/styled';

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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
`;

const FormField = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
  }

  input, textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
`;

const ImageUploadSection = styled.div`
  margin-bottom: 20px;

  .image-preview {
    margin-top: 10px;
    max-width: 300px;
    
    img {
      width: 100%;
      height: auto;
      border-radius: 6px;
      border: 1px solid #ddd;
    }
  }

  .upload-button {
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #218838;
    }

    &:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
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

const InterviewForm = ({
  mode = 'create', // 'create' 또는 'edit'
  initialData = null,
  onSave,
  onBack,
  isSaving = false,
  isLoading = false,
  onSaveClick // 부모에서 저장 버튼 클릭 시 호출할 함수
}) => {
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [intro, setIntro] = useState('');
  const [coverImg, setCoverImg] = useState('');
  const [coverImgPreview, setCoverImgPreview] = useState('');
  const [date, setDate] = useState('');
  const [interviewee, setInterviewee] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const editorRef = useRef(null);

  // 초기 데이터가 있으면 폼에 설정
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setSelectedStoreId(initialData.store_id || '');
      setIntro(initialData.intro || '');
      setCoverImg(initialData.cover_img || '');
      setCoverImgPreview(initialData.cover_img || '');
      setDate(initialData.date || '');
      setInterviewee(initialData.interviewee || '');
    }
  }, [initialData, mode]);

  // 부모에서 저장 버튼 클릭 시 폼의 저장 함수를 호출할 수 있도록 ref 설정
  useEffect(() => {
    if (onSaveClick) {
      onSaveClick.current = handleSave;
    }
  }, [onSaveClick, selectedStoreId, intro, coverImg, date, interviewee]);

  const handleEditorChange = (api, event) => {
    // onChange 이벤트가 너무 자주 호출되는 것을 방지
    // 실제로는 Editor 내부에서 데이터를 관리하므로 여기서는 로깅만
    console.log('Editor onChange:', { api, event });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // 이미지 압축
      const compressedFile = await checkAndCompressImage(file, 0.5);

      // Supabase Storage에 업로드
      const supabase = createClient();
      const fileName = `cover_${Date.now()}_${compressedFile.name}`;

      const { data, error } = await supabase.storage
        .from('gallery')
        .upload(fileName, compressedFile);

      if (error) throw error;

      // 공개 URL 생성
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      setCoverImg(publicUrl);
      setCoverImgPreview(publicUrl);

    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!editorRef.current || !editorRef.current.isReady()) {
        console.error('Editor가 준비되지 않았습니다');
        return;
      }

      const outputData = await editorRef.current.save();
      const interviewData = {
        store_id: selectedStoreId,
        contents: outputData.blocks,
        intro: intro,
        cover_img: coverImg,
        date: date,
        interviewee: interviewee
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

      await onSave(interviewData);
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        인터뷰 데이터를 불러오는 중...
      </div>
    );
  }

  return (
    <FormSection>
      <StoreSelectSection>
        <h2>
          <StoreSelect
            selectedStoreId={selectedStoreId}
            onStoreChange={setSelectedStoreId}
            placeholder="인터뷰를 연결할 스토어를 선택하세요"
          />
        </h2>
      </StoreSelectSection>

      <FormGrid>
        <div>
          <FormField>
            <ImageUploadSection>
              <label htmlFor="cover-img">커버 이미지</label>
              <input
                id="cover-img"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="upload-button"
                onClick={() => document.getElementById('cover-img').click()}
                disabled={isUploading}
              >
                {isUploading ? '업로드 중...' : '이미지 선택'}
              </button>
              {coverImgPreview && (
                <div className="image-preview">
                  <img src={coverImgPreview} alt="커버 이미지 미리보기" />
                </div>
              )}
            </ImageUploadSection>
          </FormField>

          <FormField>
            <label htmlFor="intro">인터뷰 소개</label>
            <textarea
              id="intro"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="인터뷰에 대한 간단한 소개를 입력하세요"
            />
          </FormField>

          <FormField>
            <label htmlFor="interviewee">인터뷰이</label>
            <input
              id="interviewee"
              type="text"
              value={interviewee}
              onChange={(e) => setInterviewee(e.target.value)}
              placeholder="인터뷰이 이름을 입력하세요"
            />
          </FormField>

          <FormField>
            <label htmlFor="date">인터뷰 날짜</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormField>
        </div>

        <FormField>
          <EditorSection>
            <h3>인터뷰 내용</h3>
            <Editor
              ref={editorRef}
              onChange={handleEditorChange}
              data={mode === 'edit' && initialData?.contents ? { blocks: initialData.contents } : {}}
            />
          </EditorSection>
        </FormField>
      </FormGrid>
    </FormSection>
  );
};

export default InterviewForm;
