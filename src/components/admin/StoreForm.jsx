'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  createStore,
  updateStore,
  getStoreById,
  getIndustryTypes,
  getCapacityTypes,
  getMaterialTypes,
} from '@/utils/supabase/stores';
import { useImageUpload } from '@/hooks/useImageUpload';
import Button from '@/components/admin/Button';
import * as S from '@/styles/admin/adminForm.style';

const StoreForm = ({
  mode,
  storeId,
  onSave,
  onBack,
  isLoading,
  onSaveClick // 부모에서 저장 버튼 클릭 시 호출할 함수
}) => {
  // 기본값 설정
  const formMode = mode || 'create';
  const formStoreId = storeId || null;
  const formIsLoading = isLoading || false;
  const router = useRouter();
  const [error, setError] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // 이미지 관련 상태
  const [cardImgPreview, setCardImgPreview] = useState('');
  const [thumbnailImgPreview, setThumbnailImgPreview] = useState('');

  // 태그 정보
  const [industryTypes, setIndustryTypes] = useState([]);
  const [capacityTypes, setCapacityTypes] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [selectedIndustryTypes, setSelectedIndustryTypes] = useState([]);
  const [selectedCapacityTypes, setSelectedCapacityTypes] = useState([]);
  const [selectedMaterialTypes, setSelectedMaterialTypes] = useState([]);

  // 갤러리 관련 상태
  const [galleryPreviews, setGalleryPreviews] = useState({});
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [localImages, setLocalImages] = useState({
    card_img: null,
    thumbnail_img: null,
    gallery: {},
  });

  const [isDataLoading, setIsDataLoading] = useState(false);

  // 이미지 업로드 훅 사용
  const { uploadImage, processImageForPreview } = useImageUpload({ bucket: 'gallery', maxSizeInMB: 1 });

  // react-hook-form 설정
  const {
    control,
    setValue,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      address: '',
      description: '',
      keyword: '',
      phone: '',
      telephone: '',
      fax: '',
      email: '',
      website: '',
      gallery: [],
    },
    mode: 'onChange', // 실시간 유효성 검사
  });

  const {
    fields: galleryFields,
    append: appendGallery,
    remove: removeGallery,
    move: moveGallery,
  } = useFieldArray({
    control,
    name: 'gallery',
  });

  // 부모에서 저장 버튼 클릭 시 폼의 저장 함수를 호출할 수 있도록 ref 설정
  useEffect(() => {
    if (onSaveClick) {
      onSaveClick.current = () => handleSubmit(handleSave)();
    }
  }, [onSaveClick, handleSubmit]);

  // 컴포넌트 언마운트 시 로컬 URL 정리
  useEffect(() => {
    return () => {
      if (cardImgPreview && cardImgPreview.startsWith('blob:')) {
        URL.revokeObjectURL(cardImgPreview);
      }
      if (thumbnailImgPreview && thumbnailImgPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailImgPreview);
      }
      Object.values(galleryPreviews).forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [cardImgPreview, thumbnailImgPreview, galleryPreviews]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (formMode === 'edit' && formStoreId) {
          setIsDataLoading(true);
          setError(null);

          // 스토어 데이터 로드
          const store = await getStoreById(formStoreId);
          console.log('Loaded store data:', store);
          setStoreData(store);

          // 기본 정보 설정
          setValue('name', store.name || '');
          setValue('description', store.description || '');
          setValue('address', store.address || '');

          // keyword를 텍스트로 변환
          if (store.keyword && Array.isArray(store.keyword)) {
            setValue('keyword', store.keyword.join(', '));
          } else {
            setValue('keyword', '');
          }

          // 이미지 미리보기 설정
          setCardImgPreview(store.card_img || '');
          setThumbnailImgPreview(store.thumbnail_img || '');

          // 연락처 정보 설정
          if (store.store_contacts && store.store_contacts.length > 0) {
            const contact = store.store_contacts[0];
            setValue('phone', contact.phone || '');
            setValue('telephone', contact.telephone || '');
            setValue('fax', contact.fax || '');
            setValue('email', contact.email || '');
            setValue('website', contact.website || '');
          }

          // 태그 정보 설정
          if (store.store_industry && store.store_industry.length > 0) {
            const industryIds = store.store_industry
              .map(item => item.industry_types.id)
              .filter(Boolean);
            setSelectedIndustryTypes(industryIds);
          }

          if (store.store_capacity && store.store_capacity.length > 0) {
            const capacityIds = store.store_capacity
              .map(item => item.capacity_types.id)
              .filter(Boolean);
            setSelectedCapacityTypes(capacityIds);
          }

          if (store.store_material && store.store_material.length > 0) {
            const materialIds = store.store_material
              .map(item => item.material_types.id)
              .filter(Boolean);
            setSelectedMaterialTypes(materialIds);
          }

          // 갤러리 데이터 설정
          if (store.store_gallery && store.store_gallery.length > 0) {
            // order_num으로 정렬
            const sortedGallery = store.store_gallery.sort((a, b) => a.order_num - b.order_num);

            const galleryData = sortedGallery.map((item, index) => ({
              id: item.id || index,
              image_url: item.image_url || '',
              order_num: item.order_num || index + 1,
            }));
            setValue('gallery', galleryData);

            // 갤러리 미리보기 설정
            const previews = {};
            galleryData.forEach((item, index) => {
              if (item.image_url) {
                previews[index] = item.image_url;
              }
            });
            setGalleryPreviews(previews);
          }
        }

        // 태그 타입들 로드
        const [industryData, capacityData, materialData] = await Promise.all([
          getIndustryTypes(),
          getCapacityTypes(),
          getMaterialTypes()
        ]);

        setIndustryTypes(industryData);
        setCapacityTypes(capacityData);
        setMaterialTypes(materialData);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsDataLoading(false);
      }
    };

    loadData();
  }, [formMode, formStoreId, setValue]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/admin/store');
    }
  };

  const handleImagePreview = async (file, type, index = null) => {
    try {
      const result = await processImageForPreview(file);
      if (result.success) {
        const imageUrl = result.file.url;
        const originalFile = result.file.originalFile;

        if (type === 'card_img' || type === 'thumbnail_img') {
          // 로컬 파일 저장
          setLocalImages(prev => ({
            ...prev,
            [type]: originalFile,
          }));

          // 미리보기 설정
          if (type === 'card_img') {
            setCardImgPreview(imageUrl);
          } else if (type === 'thumbnail_img') {
            setThumbnailImgPreview(imageUrl);
          }
        } else if (type === 'gallery' && index !== null) {
          // 로컬 파일 저장
          setLocalImages(prev => ({
            ...prev,
            gallery: {
              ...prev.gallery,
              [index]: originalFile,
            },
          }));

          setGalleryPreviews((prev) => ({
            ...prev,
            [index]: imageUrl,
          }));
        }
      } else {
        alert('이미지 처리에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('이미지 처리 오류:', error);
      alert('이미지 처리 중 오류가 발생했습니다.');
    }
  };

  const handleImageSelect = (event, type, index = null) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 선택할 수 있습니다.');
        return;
      }
      handleImagePreview(file, type, index);
    }
  };

  const handleTagChange = (type, id, checked) => {
    if (type === 'industry') {
      setSelectedIndustryTypes(prev =>
        checked ? [...prev, id] : prev.filter(item => item !== id)
      );
    } else if (type === 'capacity') {
      setSelectedCapacityTypes(prev =>
        checked ? [...prev, id] : prev.filter(item => item !== id)
      );
    } else if (type === 'material') {
      setSelectedMaterialTypes(prev =>
        checked ? [...prev, id] : prev.filter(item => item !== id)
      );
    }
  };

  const handleSave = useCallback(async (formData) => {
    try {
      setIsSaving(true);

      // 이미지 업로드 처리
      let cardImgUrl = '';
      let thumbnailImgUrl = '';
      const galleryUrls = {};

      // 카드 이미지 업로드
      if (localImages.card_img) {
        const result = await uploadImage(localImages.card_img);
        if (result.success) {
          cardImgUrl = result.file.url;
        } else {
          throw new Error('카드 이미지 업로드 실패: ' + result.error);
        }
      }

      // 썸네일 이미지 업로드
      if (localImages.thumbnail_img) {
        const result = await uploadImage(localImages.thumbnail_img);
        if (result.success) {
          thumbnailImgUrl = result.file.url;
        } else {
          throw new Error('썸네일 이미지 업로드 실패: ' + result.error);
        }
      }

      // 갤러리 이미지들 업로드
      for (const [index, file] of Object.entries(localImages.gallery)) {
        if (file) {
          const result = await uploadImage(file);
          if (result.success) {
            galleryUrls[index] = result.file.url;
          } else {
            throw new Error(`갤러리 이미지 ${parseInt(index) + 1} 업로드 실패: ${result.error}`);
          }
        }
      }

      // 갤러리 데이터 준비
      const currentGallery = watch('gallery');
      const processedGallery = currentGallery.map((item, index) => ({
        ...item,
        image_url: galleryUrls[index] || item.image_url || '',
        order_num: index + 1, // 현재 순서에 맞게 order_num 업데이트
      })).filter((item) => item.image_url);

      // keyword 처리
      const processedKeyword = formData.keyword ? formData.keyword.split(',').map(k => k.trim()).filter(k => k) : [];

      const storeData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        keyword: processedKeyword,
        card_img: cardImgUrl,
        thumbnail_img: thumbnailImgUrl,
        contacts: {
          phone: formData.phone,
          telephone: formData.telephone,
          fax: formData.fax,
          email: formData.email,
          website: formData.website
        },
        capacities: selectedCapacityTypes,
        industries: selectedIndustryTypes,
        materials: selectedMaterialTypes,
        gallery: processedGallery,
      };

      if (formMode === 'create') {
        await createStore(storeData);
        alert('스토어가 성공적으로 등록되었습니다.');
        router.push('/admin/store');
      } else {
        await updateStore(formStoreId, storeData);
        alert('수정 완료');
        router.push('/admin/store');
      }

      if (onSave) {
        onSave(storeData);
      }
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [formMode, formStoreId, selectedIndustryTypes, selectedCapacityTypes, selectedMaterialTypes, localImages, uploadImage, watch, onSave, router]);

  if (formIsLoading || isDataLoading) {
    return (
      <S.AdminFormWrapper>
        <S.Header>
          <h1>{formMode === 'create' ? '스토어 등록' : '스토어 수정'}</h1>
          <Button onClick={handleBack}>목록으로</Button>
        </S.Header>
        <S.LoadingMessage>스토어 데이터를 불러오는 중...</S.LoadingMessage>
      </S.AdminFormWrapper>
    );
  }

  if (error) {
    return (
      <S.AdminFormWrapper>
        <S.Header>
          <h1>{formMode === 'create' ? '스토어 등록' : '스토어 수정'}</h1>
          <Button onClick={handleBack}>목록으로</Button>
        </S.Header>
        <S.ErrorMessage>오류가 발생했습니다: {error}</S.ErrorMessage>
      </S.AdminFormWrapper>
    );
  }

  return (
    <S.AdminFormWrapper>
      <S.Header>
        <h1>{formMode === 'create' ? '스토어 등록' : '스토어 수정'}</h1>
        <S.Actions>
          <Button onClick={handleBack}>목록으로</Button>
          <Button className="edit" onClick={handleSubmit(handleSave)} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </S.Actions>
      </S.Header>

      <S.FormSection>
        <h2>{formMode === 'edit' && storeData?.name ? storeData.name : '스토어 정보'}</h2>

        <S.FormGrid>
          <div>
            <S.FormField>
              <label htmlFor="name">가게 이름 <span style={{ color: 'red' }}>*</span></label>
              <input
                id="name"
                type="text"
                {...register('name', {
                  required: '가게 이름은 필수 입력값입니다.',
                  minLength: { value: 1, message: '가게 이름을 입력해주세요.' }
                })}
                placeholder="(필수) 가게 이름을 입력하세요"
              />
              {errors.name && (
                <S.ErrorInputMessage>
                  {errors.name.message}
                </S.ErrorInputMessage>
              )}
            </S.FormField>

            <S.FormField>
              <label htmlFor="address">주소 <span style={{ color: 'red' }}>*</span></label>
              <input
                id="address"
                type="text"
                {...register('address', {
                  required: '주소는 필수 입력값입니다.',
                  minLength: { value: 1, message: '주소를 입력해주세요.' }
                })}
                placeholder="(필수) 가게 주소를 입력하세요"
              />
              {errors.address && (
                <S.ErrorInputMessage>
                  {errors.address.message}
                </S.ErrorInputMessage>
              )}
            </S.FormField>

            <S.FormField>
              <label htmlFor="keyword">키워드</label>
              <input
                id="keyword"
                type="text"
                {...register('keyword')}
                placeholder="키워드를 쉼표로 구분하여 입력하세요 (예: 조명기구, 특수조명, 일반조명)"
              />
            </S.FormField>

            <S.FormField>
              <label htmlFor="description">설명</label>
              <textarea
                id="description"
                {...register('description')}
                placeholder="스토어에 대한 설명을 입력하세요"
              />
            </S.FormField>

            <S.FormField>
              <label htmlFor="phone">핸드폰 번호</label>
              <input
                id="phone"
                type="tel"
                {...register('phone', {
                  pattern: {
                    value: /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/,
                    message: '올바른 핸드폰 번호 형식을 입력해주세요 (예: 010-1234-5678)'
                  }
                })}
                placeholder="핸드폰 번호를 입력하세요 (예: 010-1234-5678)"
              />
              {errors.phone && (
                <S.ErrorInputMessage>
                  {errors.phone.message}
                </S.ErrorInputMessage>
              )}
            </S.FormField>

            <S.FormField>
              <label htmlFor="telephone">전화번호</label>
              <input
                id="telephone"
                type="tel"
                {...register('telephone', {
                  pattern: {
                    value: /^0[2-9][0-9]-?[0-9]{3,4}-?[0-9]{4}$/,
                    message: '올바른 전화번호 형식을 입력해주세요 (예: 02-1234-5678)'
                  }
                })}
                placeholder="전화번호를 입력하세요 (예: 02-1234-5678)"
              />
              {errors.telephone && (
                <S.ErrorInputMessage>
                  {errors.telephone.message}
                </S.ErrorInputMessage>
              )}
            </S.FormField>

            <S.FormField>
              <label htmlFor="fax">팩스</label>
              <input
                id="fax"
                type="tel"
                {...register('fax', {
                  pattern: {
                    value: /^0[2-9][0-9]-?[0-9]{3,4}-?[0-9]{4}$/,
                    message: '올바른 팩스번호 형식을 입력해주세요 (예: 02-1234-5678)'
                  }
                })}
                placeholder="팩스번호를 입력하세요 (예: 02-1234-5678)"
              />
              {errors.fax && (
                <S.ErrorInputMessage>
                  {errors.fax.message}
                </S.ErrorInputMessage>
              )}
            </S.FormField>

            <S.FormField>
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: '올바른 이메일 형식을 입력해주세요 (예: example@email.com)'
                  }
                })}
                placeholder="이메일을 입력하세요 (예: example@email.com)"
              />
              {errors.email && (
                <S.ErrorInputMessage>
                  {errors.email.message}
                </S.ErrorInputMessage>
              )}
            </S.FormField>

            <S.FormField>
              <label htmlFor="website">웹사이트</label>
              <input
                id="website"
                type="url"
                {...register('website', {
                  pattern: {
                    value: /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: '올바른 웹사이트 형식을 입력해주세요 (예: example.com)'
                  }
                })}
                placeholder="웹사이트를 입력하세요 (예: example.com)"
              />
              {errors.website && (
                <S.ErrorInputMessage>
                  {errors.website.message}
                </S.ErrorInputMessage>
              )}
            </S.FormField>

            <S.TagSection>
              <h3>업종 태그</h3>
              <div className="tag-grid">
                {industryTypes.map((type) => (
                  <div key={type.id} className="tag-item">
                    <input
                      type="checkbox"
                      id={`industry-${type.id}`}
                      checked={selectedIndustryTypes.includes(type.id)}
                      onChange={(e) => handleTagChange('industry', type.id, e.target.checked)}
                    />
                    <label htmlFor={`industry-${type.id}`}>{type.name}</label>
                  </div>
                ))}
              </div>
            </S.TagSection>

            <S.TagSection>
              <h3>규모 태그</h3>
              <div className="tag-grid">
                {capacityTypes.map((type) => (
                  <div key={type.id} className="tag-item">
                    <input
                      type="checkbox"
                      id={`capacity-${type.id}`}
                      checked={selectedCapacityTypes.includes(type.id)}
                      onChange={(e) => handleTagChange('capacity', type.id, e.target.checked)}
                    />
                    <label htmlFor={`capacity-${type.id}`}>{type.name}</label>
                  </div>
                ))}
              </div>
            </S.TagSection>

            <S.TagSection>
              <h3>재료 태그</h3>
              <div className="tag-grid">
                {materialTypes.map((type) => (
                  <div key={type.id} className="tag-item">
                    <input
                      type="checkbox"
                      id={`material-${type.id}`}
                      checked={selectedMaterialTypes.includes(type.id)}
                      onChange={(e) => handleTagChange('material', type.id, e.target.checked)}
                    />
                    <label htmlFor={`material-${type.id}`}>{type.name}</label>
                  </div>
                ))}
              </div>
            </S.TagSection>
          </div>

          <div>
            <S.FormField>
              <label htmlFor="card-img">명함 사진</label>
              <input
                id="card-img"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e, 'card_img')}
                style={{ display: 'none' }}
              />
              <Button
                className="create"
                onClick={() => document.getElementById('card-img').click()}
              >
                {cardImgPreview ? '이미지 변경' : '이미지 추가'}
              </Button>
              {cardImgPreview && (
                <div className="image-preview">
                  <img src={cardImgPreview} alt="카드 이미지 미리보기" />
                </div>
              )}
            </S.FormField>

            <S.FormField>
              <label htmlFor="thumbnail-img">가게 전경 사진</label>
              <input
                id="thumbnail-img"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e, 'thumbnail_img')}
                style={{ display: 'none' }}
              />
              <Button
                className="create"
                onClick={() => document.getElementById('thumbnail-img').click()}
              >
                {thumbnailImgPreview ? '이미지 변경' : '이미지 추가'}
              </Button>
              {thumbnailImgPreview && (
                <div className="image-preview">
                  <img src={thumbnailImgPreview} alt="썸네일 이미지 미리보기" />
                </div>
              )}
            </S.FormField>

            {/* 갤러리 섹션 */}
            <S.GallerySection>
              <h3>갤러리</h3>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  이미지를 드래그하여 순서를 변경할 수 있습니다.
                </p>
              </div>

              <div className="gallery-grid">
                {galleryFields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`gallery-item ${draggedIndex === index ? 'dragging' : ''}`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', index.toString());
                      e.currentTarget.classList.add('dragging');
                      setDraggedIndex(index);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (draggedIndex !== null && draggedIndex !== index) {
                        e.currentTarget.classList.add('drag-over');
                      }
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('drag-over');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('drag-over');

                      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                      const toIndex = index;

                      if (fromIndex !== toIndex && fromIndex >= 0 && toIndex >= 0) {
                        // useFieldArray의 move 함수 사용
                        moveGallery(fromIndex, toIndex);

                        // 미리보기도 동일한 방식으로 이동
                        const newPreviews = {};
                        const previewEntries = Object.entries(galleryPreviews);

                        // 이동된 미리보기를 새 위치에 배치
                        previewEntries.forEach(([key, value]) => {
                          const currentIndex = parseInt(key);
                          let newIndex = currentIndex;

                          if (currentIndex === fromIndex) {
                            newIndex = toIndex;
                          } else if (fromIndex < toIndex) {
                            // 앞에서 뒤로 이동
                            if (currentIndex > fromIndex && currentIndex <= toIndex) {
                              newIndex = currentIndex - 1;
                            }
                          } else {
                            // 뒤에서 앞으로 이동
                            if (currentIndex >= toIndex && currentIndex < fromIndex) {
                              newIndex = currentIndex + 1;
                            }
                          }

                          newPreviews[newIndex] = value;
                        });

                        setGalleryPreviews(newPreviews);
                      }
                    }}
                    onDragEnd={(e) => {
                      e.currentTarget.classList.remove('dragging');
                      setDraggedIndex(null);
                    }}
                  >
                    <div className="gallery-header">
                      <h4>이미지 {index + 1}</h4>
                      <Button
                        className="delete"
                        onClick={() => {
                          removeGallery(index);
                          // 미리보기도 함께 삭제하고 인덱스 재정렬
                          setGalleryPreviews(prev => {
                            const newPreviews = {};
                            Object.entries(prev).forEach(([key, value]) => {
                              const currentIndex = parseInt(key);
                              if (currentIndex < index) {
                                newPreviews[currentIndex] = value;
                              } else if (currentIndex > index) {
                                newPreviews[currentIndex - 1] = value;
                              }
                            });
                            return newPreviews;
                          });
                        }}
                      >
                        삭제
                      </Button>
                    </div>

                    <div>
                      <input
                        id={`gallery.${index}.image_url`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageSelect(e, 'gallery', index)}
                        style={{ display: 'none' }}
                      />

                      {!galleryPreviews[index] ? (
                        <div
                          className="image-upload-area"
                          onClick={() => document.getElementById(`gallery.${index}.image_url`).click()}
                        >
                          <div className="upload-icon">+</div>
                          <div className="upload-text">이미지 선택</div>
                        </div>
                      ) : (
                        <div className="image-preview-container">
                          <img
                            src={galleryPreviews[index]}
                            alt={`갤러리 이미지 ${index + 1}`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="create"
                onClick={() =>
                  appendGallery({
                    image_url: '',
                    order_num: galleryFields.length + 1,
                  })
                }
              >
                + 갤러리 이미지 추가
              </Button>
            </S.GallerySection>
          </div>


        </S.FormGrid>


      </S.FormSection>
    </S.AdminFormWrapper>
  );
};

export default StoreForm;
