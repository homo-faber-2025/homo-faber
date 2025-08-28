"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Editor from '@/components/interview/Editor';
import StoreSelect from '@/components/interview/StoreSelect';
import { checkAndCompressImage } from '@/utils/imageCompression';
import { createClient } from '@/utils/supabase/client';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useAuth } from '@/contexts/AuthContext';
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
  const [localCoverImage, setLocalCoverImage] = useState(null);
  const editorRef = useRef(null);

  // 이미지 업로드 훅 사용
  const { uploadImage, processImageForPreview } = useImageUpload({ bucket: 'gallery', maxSizeInMB: 0.5 });
  const { user } = useAuth();

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
  }, [onSaveClick, selectedStoreId, intro, coverImg, date, interviewee, localCoverImage]);

  // 컴포넌트 언마운트 시 로컬 URL 정리
  useEffect(() => {
    return () => {
      if (coverImgPreview && coverImgPreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverImgPreview);
      }
    };
  }, [coverImgPreview]);

  const handleImagePreview = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const result = await processImageForPreview(file);
      if (result.success) {
        const imageUrl = result.file.url;
        const originalFile = result.file.originalFile;

        // 로컬 파일 저장 (업로드용)
        console.log('저장할 원본 파일:', {
          name: originalFile.name,
          size: originalFile.size,
          type: originalFile.type,
          isFile: originalFile instanceof File
        });
        setLocalCoverImage(originalFile);

        // 프리뷰 설정 (blob URL)
        setCoverImgPreview(imageUrl);
      } else {
        alert('이미지 처리에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('이미지 처리 실패:', error);
      alert('이미지 처리에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = useCallback(async () => {
    try {
      if (!editorRef.current || !editorRef.current.isReady()) {
        console.error('Editor가 준비되지 않았습니다');
        return;
      }

      // 이미지 업로드 처리
      let coverImgUrl = coverImg;
      console.log('=== 이미지 업로드 처리 ===');
      console.log('기존 coverImg:', coverImg);
      console.log('localCoverImage 존재:', !!localCoverImage);

      if (localCoverImage) {
        console.log('새 이미지 업로드 시작...');

        // admin 페이지에서는 인증 체크 제거
        console.log('admin 페이지에서 이미지 업로드 진행');

        const result = await uploadImage(localCoverImage);
        console.log('업로드 결과:', result);

        if (result.success) {
          coverImgUrl = result.file.url;
          console.log('새 이미지 URL:', coverImgUrl);
        } else {
          throw new Error('커버 이미지 업로드 실패: ' + result.error);
        }
      } else {
        console.log('이미지 변경 없음, 기존 URL 사용:', coverImgUrl);
      }

      const outputData = await editorRef.current.save();

      // 업데이트할 데이터만 포함
      const updateData = {};

      if (selectedStoreId) updateData.store_id = selectedStoreId;
      if (outputData.blocks) updateData.contents = outputData.blocks;
      if (intro !== undefined) updateData.intro = intro;
      if (coverImgUrl !== undefined) updateData.cover_img = coverImgUrl;
      if (date) updateData.date = date;
      if (interviewee) updateData.interviewee = interviewee;

      console.log('=== 최종 저장 데이터 ===');
      console.log('updateData:', updateData);
      console.log('cover_img 값:', updateData.cover_img);

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

      await onSave(updateData);
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  }, [selectedStoreId, intro, coverImg, date, interviewee, localCoverImage, uploadImage, onSave]);

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
                onChange={handleImagePreview}
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

              data={mode === 'edit' && initialData?.contents ? { blocks: initialData.contents } : {}}
            />
          </EditorSection>
        </FormField>
      </FormGrid>
    </FormSection>
  );
};

export default InterviewForm;
