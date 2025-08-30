"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Editor from '@/components/interview/Editor';
import StoreSelect from '@/components/interview/StoreSelect';
import { useImageUpload } from '@/hooks/useImageUpload';
import * as S from '@/styles/admin/adminForm.style';
import Button from '@/components/admin/Button';


const InterviewForm = ({
  mode = 'create', // 'create' 또는 'edit'
  initialData = null,
  onSave,
  onBack,
  isSaving = false,
  isLoading = false,
  onSaveClick // 부모에서 저장 버튼 클릭 시 호출할 함수
}) => {
  const formMode = mode || 'create';
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
      // 필수 필드 검증
      if (!selectedStoreId) {
        alert('연결할 스토어를 선택해주세요.');
        return;
      }

      if (!editorRef.current || !editorRef.current.isReady()) {
        console.error('Editor가 준비되지 않았습니다');
        return;
      }

      // 이미지 업로드 처리
      let coverImgUrl = coverImg;
      if (localCoverImage) {
        try {
          const uploadedUrl = await uploadImage(localCoverImage);
          coverImgUrl = uploadedUrl;
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
          alert('이미지 업로드에 실패했습니다.');
          return;
        }
      }

      const outputData = await editorRef.current.save();

      // 업데이트할 데이터만 포함
      const updateData = {};

      if (selectedStoreId) updateData.store_id = selectedStoreId;
      if (outputData && outputData.blocks) updateData.contents = outputData.blocks;
      if (intro !== undefined) updateData.intro = intro;
      if (coverImgUrl !== undefined) updateData.cover_img = coverImgUrl;
      if (date) updateData.date = date;
      if (interviewee) updateData.interviewee = interviewee;

      await onSave(updateData);
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  }, [selectedStoreId, intro, coverImg, date, interviewee, localCoverImage, uploadImage, onSave]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/admin/interview');
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
    <S.AdminFormWrapper>
      <S.Header>
        <h1>{formMode === 'create' ? '인터뷰 등록' : '인터뷰 수정'}</h1>
        <S.Actions>
          <Button onClick={handleBack}>목록으로</Button>
          <Button className="edit" onClick={handleSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </S.Actions>
      </S.Header>

      <S.FormSection>
        <S.FormField>
          <StoreSelect
            selectedStoreId={selectedStoreId}
            onStoreChange={setSelectedStoreId}
            placeholder="인터뷰를 연결할 스토어를 선택하세요"
          />
        </S.FormField>

        <S.FormGrid>
          <div>
            <S.FormField>
              <label htmlFor="cover-img">커버 이미지</label>
              <input
                id="cover-img"
                type="file"
                accept="image/*"
                onChange={handleImagePreview}
                style={{ display: 'none' }}
              />
              <Button
                className="create"
                onClick={() => document.getElementById('cover-img').click()}
                disabled={isUploading}
              >
                {isUploading ? '업로드 중...' : '이미지 선택'}
              </Button>
              {coverImgPreview && (
                <div className="image-preview">
                  <img src={coverImgPreview} alt="커버 이미지 미리보기" />
                </div>
              )}
            </S.FormField>

            <S.FormField>
              <label htmlFor="intro">인터뷰 소개</label>
              <textarea
                id="intro"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="인터뷰에 대한 간단한 소개를 입력하세요"
              />
            </S.FormField>

            <S.FormField>
              <label htmlFor="interviewee">인터뷰이</label>
              <input
                id="interviewee"
                type="text"
                value={interviewee}
                onChange={(e) => setInterviewee(e.target.value)}
                placeholder="인터뷰이 이름을 입력하세요"
              />
            </S.FormField>

            <S.FormField>
              <label htmlFor="date">인터뷰 날짜</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </S.FormField>
          </div>

          <S.FormField>
            <S.FormField>
              <h3>인터뷰 내용</h3>
              <Editor
                ref={editorRef}
                data={mode === 'edit' && initialData?.contents ? { blocks: initialData.contents } : { blocks: [] }}
              />
            </S.FormField>
          </S.FormField>
        </S.FormGrid>
      </S.FormSection>
    </S.AdminFormWrapper>
  );
};

export default InterviewForm;
