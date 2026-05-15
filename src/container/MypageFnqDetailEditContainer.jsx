'use client';

import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { useFnq } from '@/hooks/useFnq';
import { useImageUpload } from '@/hooks/useImageUpload';
import { AnimatePresence } from 'motion/react';
import useWindowSize from '@/hooks/useWindowSize';
import Loader from '@/components/common/Loader';
import ErrorComponent from '@/components/common/Error';
import * as S from '@/styles/fnq/fnqContainer.style';
import * as S2 from '@/styles/fnq/fnqDeatilContainer.style';
import { updateFnq } from '@/utils/api/fnq-api';
import Popup from '@/components/common/Popup';
import Editor from '@/components/interview/Editor';

function MypageFnqDetailEditContainer() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, isReady } = useWindowSize();
  const [right, setRight] = useState('-100dvw');
  const [bottom, setBottom] = useState('-100dvh');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fnqId = pathname.startsWith('/mypage/fnq/') && pathname.includes('/edit') ? pathname.split('/')[3] : null;
  const { fnq, isLoading, error, loading } = useFnq(fnqId);

  // 상태 확인 (확인중이 아닌 경우 수정 불가)
  const isProcessing = fnq?.fnq_status?.status !== 'pending';
  const canEdit = !isProcessing;

  // useForm 설정
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      count: '',
      budget: '',
      due_date: '',
      files: []
    }
  });

  // 파일 필드 배열 관리
  const {
    fields: fileFields,
    append: appendFile,
    remove: removeFile,
  } = useFieldArray({
    control,
    name: 'files',
  });

  // 에디터 관련 상태
  const editorRef = useRef(null);
  const [editorData, setEditorData] = useState({ blocks: [] });

  // 파일 업로드 관련 상태
  const [filePreviews, setFilePreviews] = useState({});
  const [localFiles, setLocalFiles] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  // 파일 업로드 훅 (gallery 버킷, 5MB 제한)
  const { uploadImageToServer } = useImageUpload({
    bucket: 'gallery',
    maxSizeInMB: 5
  });

  // 모바일에서 사용할 bottom 위치를 계산하는 함수
  const getMobileBottomPosition = (pathname) => {
    if (pathname.startsWith('/mypage/fnq/') && pathname.includes('/edit')) {
      return '0px';
    } else {
      return '-100dvh';
    }
  };

  // 데스크톱에서 사용할 right 위치를 계산하는 함수
  const getDesktopRightPosition = (pathname) => {
    if (pathname.startsWith('/mypage/fnq/') && pathname.includes('/edit')) {
      return '0px';
    } else {
      return '-100dvw';
    }
  };

  // pathname 변경 시 위치 업데이트
  useLayoutEffect(() => {
    if (!isReady) return;

    if (isMobile) {
      const newBottom = getMobileBottomPosition(pathname);
      setBottom(newBottom);
    } else {
      const newRight = getDesktopRightPosition(pathname);
      setRight(newRight);
    }
  }, [pathname, isMobile, isReady]);

  // fnq 데이터가 로드되면 폼에 채우기
  useEffect(() => {
    if (fnq && !isInitialized) {
      // useForm의 setValue로 폼 데이터 설정
      try {
        setValue('title', fnq.title || '');
        setValue('count', fnq.count || '');
        setValue('budget', fnq.budget || '');
        setValue('due_date', fnq.due_date ? fnq.due_date.split('T')[0] : '');
        setEditorData({ blocks: fnq.detail || [] });
      } catch (err) {
        setError(err.message);
      } finally {

      }
      // 기존 파일들을 filePreviews에 설정
      if (fnq.img && fnq.img.length > 0) {
        const initialPreviews = {};
        fnq.img.forEach((file, index) => {
          try {
            let fileData;
            if (typeof file === 'string' && file.startsWith('{')) {
              fileData = JSON.parse(file);
            } else if (typeof file === 'object') {
              fileData = file;
            } else {
              fileData = { url: file, name: `첨부 파일 ${index + 1}` };
            }
            initialPreviews[index] = {
              name: fileData.name || `첨부 파일 ${index + 1}`,
              extension: 'FILE',
              size: 0
            };
          } catch (error) {
            console.error('파일 데이터 파싱 오류:', error);
            initialPreviews[index] = {
              name: `첨부 파일 ${index + 1}`,
              extension: 'FILE',
              size: 0
            };
          }
        });
        setFilePreviews(initialPreviews);
      }

      setIsInitialized(true);
    }
  }, [fnq, setValue, isInitialized]);

  // 처리중이 아닌 경우 리다이렉트 (확인중 상태에서만 수정 가능)
  useEffect(() => {
    if (fnq && !isLoading && isProcessing) {
      // 확인중이 아닌 경우 상세 페이지로 리다이렉트
      router.push(`/mypage/fnq/${fnqId}`);
    }
  }, [fnq, isLoading, isProcessing, fnqId, router]);

  // 파일 필드 초기화 (fnq 데이터 로드 후)
  useEffect(() => {
    if (fnq && isInitialized && fnq.img && fnq.img.length > 0) {
      console.log('파일 필드 초기화 시작, 기존 파일 개수:', fnq.img.length);
      console.log('현재 파일 필드 개수:', fileFields.length);

      // 기존 파일 필드들을 제거하고 새로 추가
      const currentLength = fileFields.length;
      for (let i = currentLength - 1; i >= 0; i--) {
        removeFile(i);
      }

      // 약간의 지연 후 새 파일 필드들 추가
      setTimeout(() => {
        const initialFileFields = fnq.img.map((_, index) => ({
          file_url: '',
          order_num: index + 1,
        }));

        console.log('새로 추가할 파일 필드들:', initialFileFields);

        // 새로운 파일 필드들 추가
        initialFileFields.forEach(field => appendFile(field));

        console.log('파일 필드 초기화 완료');
      }, 50);
    }
  }, [fnq, isInitialized, appendFile, removeFile]);

  // 예산 포맷팅 함수 (천 단위 구분자)
  const formatBudget = (value) => {
    if (!value) return '';
    // 숫자가 아닌 문자 제거
    const numericValue = value.replace(/[^0-9]/g, '');
    // 천 단위 구분자 추가
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 예산 입력 핸들러
  const handleBudgetChange = (e) => {
    const formattedValue = formatBudget(e.target.value);
    setValue('budget', formattedValue);
  };

  // 파일 미리보기 처리
  const handleFilePreview = async (file, index) => {
    try {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toUpperCase() || 'FILE';

      // 현재 에디터 데이터 백업
      if (editorRef.current?.isReady()) {
        const currentData = await editorRef.current.save();
        setEditorData(currentData);
      }

      setLocalFiles(prev => ({
        ...prev,
        [index]: file,
      }));

      setFilePreviews(prev => ({
        ...prev,
        [index]: {
          name: fileName,
          extension: fileExtension,
          size: file.size
        },
      }));
    } catch (error) {
      console.error('파일 처리 중 오류:', error);
      alert('파일 처리 중 오류가 발생했습니다.');
    }
  };

  // 파일 선택 처리
  const handleFileSelect = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('파일 크기가 5MB를 초과합니다. 5MB 이상의 파일은 이메일로 전달해주세요.');
        return;
      }
      handleFilePreview(file, index);
    }
  };

  // 파일 필드 추가
  const addFileField = () => {
    const currentLength = fileFields.length;
    console.log('파일 필드 추가 전 길이:', currentLength);

    appendFile({
      file_url: '',
      order_num: currentLength + 1,
    });

    // 파일 필드가 추가된 후 파일 선택 창 열기
    setTimeout(() => {
      console.log('파일 필드 추가 후 길이:', fileFields.length);
      const fileInput = document.getElementById(`file.${currentLength}`);
      console.log('파일 입력 요소:', fileInput);
      if (fileInput) {
        fileInput.click();
      }
    }, 100);
  };

  // 파일 필드 제거
  const removeFileField = (index) => {
    setFilePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });
    setLocalFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[index];
      return newFiles;
    });
    removeFile(index);
  };

  // 저장 핸들러
  const handleSave = async (formData) => {
    if (!fnqId) return;

    try {
      setIsSaving(true);

      // 에디터 데이터 가져오기
      let outputData = editorData;
      if (editorRef.current?.isReady()) {
        outputData = await editorRef.current.save();
      }

      // 기존 파일들과 새로 업로드된 파일들 처리
      const finalFiles = [];

      // 현재 표시된 파일 필드들만 처리
      fileFields.forEach((field, index) => {
        // 새로운 파일이 있으면 업로드 대기열에 추가
        if (localFiles[index]) {
          // 업로드 대기열에 추가 (나중에 처리됨)
          return;
        }

        // 기존 파일이 있으면 유지
        if (fnq && fnq.img && fnq.img[index]) {
          try {
            let fileData;
            const existingFile = fnq.img[index];
            if (typeof existingFile === 'string' && existingFile.startsWith('{')) {
              fileData = JSON.parse(existingFile);
            } else if (typeof existingFile === 'object') {
              fileData = existingFile;
            } else {
              fileData = { url: existingFile, name: `첨부 파일 ${index + 1}` };
            }
            finalFiles.push(fileData);
          } catch (error) {
            console.error('기존 파일 데이터 파싱 오류:', error);
          }
        }
      });

      // 새로 업로드된 파일들 처리
      const uploadPromises = Object.entries(localFiles).map(async ([index, file]) => {
        if (file) {
          try {
            const result = await uploadImageToServer(file);
            if (result.success) {
              return {
                url: result.file.url,
                name: file.name,
                extension: file.name.split('.').pop()?.toUpperCase() || 'FILE',
                size: file.size
              };
            } else {
              throw new Error('파일 업로드 실패: ' + result.error);
            }
          } catch (error) {
            console.error('파일 업로드 오류:', error);
            throw error;
          }
        }
        return null;
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      finalFiles.push(...uploadedFiles.filter(file => file));

      const updateData = {
        title: formData.title,
        count: formData.count,
        budget: formData.budget ? formData.budget.replace(/,/g, '') : null, // 콤마 제거
        due_date: formData.due_date,
        detail: outputData?.blocks || [],
        img: finalFiles, // 최종 파일 배열
        status_id: '8d1235ef-80c3-4a9f-981c-d8ddcbab6f5d', // 무조건 확인중 상태로 설정
      };

      await updateFnq(fnqId, updateData);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('수정 오류:', error);
      setErrorMessage('수정 중 오류가 발생했습니다');
      setShowErrorPopup(true);
    } finally {
      setIsSaving(false);
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    router.back();
  };

  // 성공 팝업 닫기 핸들러
  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    router.push(`/mypage/fnq/${fnqId}`);
  };

  // 오류 팝업 닫기 핸들러
  const handleErrorClose = () => {
    setShowErrorPopup(false);
    setErrorMessage('');
  };

  return (
    <AnimatePresence mode="wait">
      {fnqId && (
        <S2.DetailWrapper
          key={`edit-${fnqId}`}
          right={right}
          bottom={bottom}
          isMobile={isMobile}
          initial={isMobile ? { bottom: '-100dvh' } : { right: '-100dvw' }}
          animate={isMobile ? { bottom: bottom } : { right: right }}
          exit={isMobile ? { bottom: '-100dvh' } : { right: '-100dvw' }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        >
          <S2.DetailPageName>문의 수정</S2.DetailPageName>

          {loading && (
            <Loader
              key="edit-loading-loader"
              baseColor="#F7F7F7"
              style={{ marginTop: isMobile ? '-22px' : '-10px', marginLeft: isMobile ? '-12px' : '-10px', transform: isMobile ? 'none' : 'rotate(90deg)', transformOrigin: isMobile ? 'none' : 'top left', position: "relative", zIndex: "-10" }}
            />
          )}
          {error ? (
            <ErrorComponent
              key="edit-error-component"
              style={{ marginTop: isMobile ? '20px' : '-4px' }}
            />
          ) : isLoading ? (
            <Loader
              key="edit-isloading-loader"
              baseColor="#F7F7F7"
              style={{
                marginTop: isMobile ? '-22px' : '-10px',
                marginLeft: isMobile ? '-12px' : '-10px',
                transform: isMobile ? 'none' : 'rotate(90deg)',
                transformOrigin: isMobile ? 'none' : 'top left',
                position: "relative",
                zIndex: "-10"
              }}
            />
          ) : !fnq ? (
            <ErrorComponent
              key="edit-not-found-error"
              style={{ marginTop: isMobile ? '20px' : '-4px' }}
              message="프로젝트를 찾을 수 없습니다."
            />
          ) : (
            <>
              <S.UserForm onSubmit={handleSubmit(handleSave)}>
                <S.FnqEditButtonWrapper>
                  <S2.Button type="button" onClick={handleCancel} disabled={isSaving}>
                    취소
                  </S2.Button>
                  <S2.Button type="submit" disabled={isSaving}>
                    {isSaving ? '저장 중...' : '저장'}
                  </S2.Button>
                </S.FnqEditButtonWrapper>

                <S.FormGroup>
                  <S.Label><span style={{ color: 'red' }}>*</span> 프로젝트 이름</S.Label>
                  <S.Input
                    type="text"
                    placeholder="프로젝트 이름을 입력해주세요 (예 스툴 제작)"
                    {...register('title', {
                      required: '프로젝트 이름을 입력해주세요',
                      minLength: {
                        value: 1,
                        message: '프로젝트 이름을 1자 이상 입력해주세요'
                      }
                    })}
                  />
                  {errors.title && <S.ErrorMessage>{errors.title.message}</S.ErrorMessage>}
                </S.FormGroup>

                <S.FormGroup>
                  <S.Label>수량</S.Label>
                  <S.Input
                    type="number"
                    placeholder="수량을 입력해주세요 (선택)"
                    {...register('count', {
                      min: {
                        value: 1,
                        message: '수량은 1 이상이어야 합니다'
                      }
                    })}
                  />
                  {errors.count && <S.ErrorMessage>{errors.count.message}</S.ErrorMessage>}
                </S.FormGroup>

                <S.FormGroup>
                  <S.Label>예산</S.Label>
                  <S.Input
                    type="text"
                    placeholder="예산을 입력해주세요 (선택)"
                    {...register('budget')}
                    onChange={handleBudgetChange}
                  />
                </S.FormGroup>

                <S.FormGroup>
                  <S.Label>납기일</S.Label>
                  <S.Input
                    type="date"
                    {...register('due_date')}
                  />
                </S.FormGroup>

                <S.FormGroup>
                  <S.Label><span style={{ color: 'red' }}>*</span> 상세내용</S.Label>
                  <S.InputInfo style={{ color: '#444' }}>
                    제작 목적 및 동작 시나리오를 설명해주세요. <br />
                    상세하게 작성할수록 기술자가 프로젝트를 이해하는데 도움이 됩니다
                  </S.InputInfo>
                  <Editor ref={editorRef} data={editorData} />
                </S.FormGroup>

                <S.FormGroup>
                  <S.Label>첨부파일</S.Label>
                  <S.InputInfo style={{ color: '#444' }}>
                    프로젝트를 이해하는데 도움이 되는 도면 또는 스케치를 전달해주세요
                  </S.InputInfo>
                  <S.InputInfo>
                    *5MB 이상의 파일은 아래의 이메일로 &apos;프로젝트 이름&apos;과 함께 전달해주세요.<br />
                    <a href="mailto:listentothecity.org@gmail.com" style={{ fontWeight: '600' }}>(listentothecity.org@gmail.com)</a>
                  </S.InputInfo>

                  <S.InputGalleryWrapper>
                    {fileFields.map((field, index) => (
                      <S.InputGalleryItem key={`file-${index}-${field.id || index}`}>
                        <input
                          id={`file.${index}`}
                          type="file"
                          accept="*/*"
                          onChange={(e) => handleFileSelect(e, index)}
                          style={{ display: 'none' }}
                        />
                        {!filePreviews[index] ? null : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <S.InputGalleryItemTitle>
                              📄 {filePreviews[index].name}
                            </S.InputGalleryItemTitle>
                            <S.InputGalleryItemButton
                              type="button"
                              onClick={() => removeFileField(index)}
                            >
                              ×
                            </S.InputGalleryItemButton>
                          </div>
                        )}
                      </S.InputGalleryItem>
                    ))}
                  </S.InputGalleryWrapper>

                  <S.InputGalleryItemAddButton
                    type="button"
                    onClick={addFileField}
                  >
                    + 파일 추가
                  </S.InputGalleryItemAddButton>
                </S.FormGroup>
              </S.UserForm>
            </>
          )}

          {/* 저장 성공 팝업 */}
          {showSuccessPopup && (
            <Popup
              key="edit-success-popup"
              isVisible={showSuccessPopup}
              title="수정 완료"
              message="문의가 성공적으로 수정되었습니다"
              type="success"
              buttons={[
                {
                  text: '확인',
                  onClick: handleSuccessClose,
                  variant: 'primary'
                }
              ]}
              onOverlayClick={handleSuccessClose}
            />
          )}

          {/* 저장 오류 팝업 */}
          {showErrorPopup && (
            <Popup
              key="edit-error-popup"
              isVisible={showErrorPopup}
              title="오류 발생"
              message={errorMessage}
              type="error"
              buttons={[
                {
                  text: '확인',
                  onClick: handleErrorClose,
                  variant: 'primary'
                }
              ]}
              onOverlayClick={handleErrorClose}
            />
          )}
        </S2.DetailWrapper>
      )}
    </AnimatePresence>
  );
}

export default MypageFnqDetailEditContainer;