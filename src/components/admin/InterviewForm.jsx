"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Editor from '@/components/interview/Editor';
import StoreSelect from '@/components/interview/StoreSelect';
import { useImageUpload } from '@/hooks/useImageUpload';
import * as S from '@/styles/admin/adminForm.style';
import Button from '@/components/admin/Button';


const InterviewForm = ({
  mode = 'create',
  initialData = null,
  onSave,
  onBack,
  isSaving = false,
  isLoading = false,
  onSaveClick
}) => {
  const formMode = mode || 'create';
  const router = useRouter();
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [coverImgPreview, setCoverImgPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [localCoverImage, setLocalCoverImage] = useState(null);
  const editorRef = useRef(null);

  // react-hook-form 설정
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      intro: '',
      coverImg: '',
      date: '',
      interviewee: '',
    },
    mode: 'onChange',
  });

  // 이미지 업로드 훅 사용
  const { uploadImage, processImageForPreview } = useImageUpload({ bucket: 'gallery', maxSizeInMB: 0.5 });

  // 초기 데이터가 있으면 폼에 설정
  useEffect(() => {
    if (initialData && mode === 'edit') {
      console.log('Setting initial data:', initialData);
      const storeId = initialData.store_id ? String(initialData.store_id) : '';
      setSelectedStoreId(storeId);
      setValue('intro', initialData.intro || '');
      setValue('coverImg', initialData.cover_img || '');
      setCoverImgPreview(initialData.cover_img || '');
      setValue('date', initialData.date || '');
      setValue('interviewee', initialData.interviewee || '');
    }
  }, [initialData, mode, setValue]);


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

  const handleSave = useCallback(async (formData) => {
    try {
      // 필수 필드 검증 - selectedStoreId가 없으면 경고
      if (!selectedStoreId || selectedStoreId === '' || selectedStoreId === 'undefined') {
        alert('연결할 스토어를 선택해주세요.');
        return;
      }

      if (!editorRef.current || !editorRef.current.isReady()) {
        console.error('Editor가 준비되지 않았습니다');
        return;
      }

      // 이미지 업로드 처리
      let coverImgUrl = formData.coverImg;
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
      const updateData = {
        store_id: selectedStoreId,
        intro: formData.intro || null, // 빈 문자열일 때 null로 변환
        cover_img: coverImgUrl || null, // 빈 문자열일 때 null로 변환
        date: formData.date || null, // 빈 문자열일 때 null로 변환
        interviewee: formData.interviewee || null, // 빈 문자열일 때 null로 변환
      };

      if (outputData && outputData.blocks) {
        updateData.contents = outputData.blocks;
      }

      await onSave(updateData);
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  }, [selectedStoreId, localCoverImage, uploadImage, onSave]);

  // 부모에서 저장 버튼 클릭 시 폼의 저장 함수를 호출할 수 있도록 ref 설정
  useEffect(() => {
    if (onSaveClick) {
      onSaveClick.current = () => handleSubmit(handleSave)();
    }
  }, [onSaveClick, handleSubmit, handleSave]);

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
          <Button className="edit" onClick={handleSubmit(handleSave)} disabled={isSaving}>
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
                {...register('intro')}
                placeholder="인터뷰에 대한 간단한 소개를 입력하세요"
              />
              {errors.intro && (
                <S.ErrorInputMessage>
                  {errors.intro.message}
                </S.ErrorInputMessage>
              )}
            </S.FormField>

            <S.FormField>
              <label htmlFor="interviewee">인터뷰이</label>
              <input
                id="interviewee"
                type="text"
                {...register('interviewee')}
                placeholder="인터뷰이 이름을 입력하세요"
              />
              {errors.interviewee && (
                <S.ErrorInputMessage>
                  {errors.interviewee.message}
                </S.ErrorInputMessage>
              )}
            </S.FormField>

            <S.FormField>
              <label htmlFor="date">인터뷰 날짜</label>
              <input
                id="date"
                type="date"
                {...register('date')}
              />
              {errors.date && (
                <S.ErrorInputMessage>
                  {errors.date.message}
                </S.ErrorInputMessage>
              )}
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
