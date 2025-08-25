'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  createStore,
  getCapacityTypes,
  getIndustryTypes,
  getMaterialTypes,
} from '@/utils/supabase/stores';
import { useImageUpload } from '@/hooks/useImageUpload';
import styled from '@emotion/styled';

const AdminStorePage = styled.div`
  padding: 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  background: white;
  z-index: 10;
`;


export default function StoreCreateForm() {
  const [loading, setLoading] = useState(false);
  const [industryTypes, setIndustryTypes] = useState([]);
  const [capacityTypes, setCapacityTypes] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [cardImgPreview, setCardImgPreview] = useState('');
  const [thumbnailImgPreview, setThumbnailImgPreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState({});
  const [draggedIndex, setDraggedIndex] = useState(null);

  // 로컬 이미지 파일 저장 (폼 제출 시 업로드용)
  const [localImages, setLocalImages] = useState({
    card_img: null,
    thumbnail_img: null,
    gallery: {},
  });

  // keyword 상태 추가
  const [keyword, setKeyword] = useState('');

  // 다중 선택을 위한 상태 추가
  const [selectedIndustryTypes, setSelectedIndustryTypes] = useState([]);
  const [selectedCapacityTypes, setSelectedCapacityTypes] = useState([]);
  const [selectedMaterialTypes, setSelectedMaterialTypes] = useState([]);

  // 이미지 업로드 훅 사용
  const { uploadImage, processImageForPreview } = useImageUpload({ bucket: 'gallery', maxSizeInMB: 1 });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      address: '',
      card_img: '',
      thumbnail_img: '',
      contacts: {
        phone: '',
        fax: '',
        email: '',
        website: '',
      },
      gallery: [],
    },
  });

  // card_img와 thumbnail_img 값 감시
  const cardImg = watch('card_img');
  const thumbnailImg = watch('thumbnail_img');



  const {
    fields: galleryFields,
    append: appendGallery,
    remove: removeGallery,
    move: moveGallery,
  } = useFieldArray({
    control,
    name: 'gallery',
  });

  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [industries, capacities, materials] = await Promise.all([
          getIndustryTypes(),
          getCapacityTypes(),
          getMaterialTypes(),
        ]);

        setIndustryTypes(industries);
        setCapacityTypes(capacities);
        setMaterialTypes(materials);
      } catch (error) {
        console.error('참조 데이터 로드 실패:', error);
      }
    };

    loadReferenceData();
  }, []);

  // 컴포넌트 언마운트 시 로컬 URL 정리
  useEffect(() => {
    return () => {
      // 로컬 URL 정리
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

  // 태그 선택 핸들러
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

  // 이미지 프리뷰 핸들러 (로컬에서만 처리)
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

  // 이미지 파일 선택 핸들러
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

  // 이미지 제거 핸들러
  const handleImageRemove = (type, index = null) => {
    if (type === 'card_img') {
      setValue(type, '');
      setCardImgPreview('');
      setLocalImages(prev => ({
        ...prev,
        card_img: null,
      }));
    } else if (type === 'thumbnail_img') {
      setValue(type, '');
      setThumbnailImgPreview('');
      setLocalImages(prev => ({
        ...prev,
        thumbnail_img: null,
      }));
    } else if (type === 'gallery' && index !== null) {
      setValue(`gallery.${index}.image_url`, '');
      setGalleryPreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[index];
        return newPreviews;
      });
      setLocalImages(prev => ({
        ...prev,
        gallery: {
          ...prev.gallery,
          [index]: null,
        },
      }));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // 이미지 업로드 처리
      let cardImgUrl = data.card_img;
      let thumbnailImgUrl = data.thumbnail_img;
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

      // 선택된 태그들을 데이터로 변환
      const filteredTags = [];

      selectedIndustryTypes.forEach(industryId => {
        filteredTags.push({
          industry_type_id: industryId,
          capacity_type_id: null,
          material_type_id: null
        });
      });

      selectedCapacityTypes.forEach(capacityId => {
        filteredTags.push({
          industry_type_id: null,
          capacity_type_id: capacityId,
          material_type_id: null
        });
      });

      selectedMaterialTypes.forEach(materialId => {
        filteredTags.push({
          industry_type_id: null,
          capacity_type_id: null,
          material_type_id: materialId
        });
      });

      // 갤러리 데이터 준비
      const processedGallery = data.gallery.map((item, index) => ({
        ...item,
        image_url: galleryUrls[index] || item.image_url || '',
      })).filter((item) => item.image_url);

      const storeData = {
        ...data,
        card_img: cardImgUrl,
        thumbnail_img: thumbnailImgUrl,
        keyword: keyword ? keyword.split(',').map(k => k.trim()).filter(k => k) : [],
        tags: filteredTags,
        gallery: processedGallery,
      };

      const newStore = await createStore(storeData);
      console.log('Store 생성 완료:', newStore);
      alert('Store가 성공적으로 등록되었습니다.');

      // 폼 초기화
      reset();
      setCardImgPreview('');
      setThumbnailImgPreview('');
      setGalleryPreviews({});
      setKeyword('');
      setSelectedIndustryTypes([]);
      setSelectedCapacityTypes([]);
      setSelectedMaterialTypes([]);
      setLocalImages({
        card_img: null,
        thumbnail_img: null,
        gallery: {},
      });
    } catch (error) {
      console.error('Store 등록 실패:', error);
      alert('Store 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminStorePage>
      <h2>업체 등록</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 기본 정보 */}
        <div>
          <h3>기본 정보</h3>

          <div>
            <label htmlFor="name">업체 이름 *</label>
            <input
              id="name"
              {...register('name', {
                required: '업체 이름은 필수 입력 항목입니다.',
              })}
            />
            {errors.name && <span>{errors.name.message}</span>}
          </div>

          <div>
            <label htmlFor="description">설명</label>
            <textarea id="description" {...register('description')} rows={4} />
          </div>

          <div>
            <label htmlFor="address">주소 *</label>
            <input
              id="address"
              {...register('address', {
                required: '주소는 필수 입력 항목입니다.',
              })}
            />
          </div>

          <div>
            <label htmlFor="keyword">키워드</label>
            <input
              id="keyword"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="키워드를 쉼표로 구분하여 입력하세요 (예: 조명기구, 특수조명, 일반조명)"
            />
          </div>
        </div>

        {/* 이미지 정보 */}
        <div>
          <h3>이미지 정보</h3>

          {/* 카드 이미지 */}
          <div>
            <label htmlFor="card_img">카드 이미지</label>
            <div>
              <input
                id="card_img"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e, 'card_img')}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('card_img').click()}
              >
                카드 이미지 선택
              </button>
              {cardImg && (
                <button
                  type="button"
                  onClick={() => handleImageRemove('card_img')}
                  style={{ marginLeft: '10px' }}
                >
                  제거
                </button>
              )}
            </div>
            {cardImgPreview && (
              <div style={{ marginTop: '10px' }}>
                <img
                  src={cardImgPreview}
                  alt="카드 이미지 미리보기"
                  style={{ maxWidth: '200px', maxHeight: '150px' }}
                />
              </div>
            )}
            {cardImg && (
              <div
                style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}
              >
                업로드된 이미지: {cardImg}
              </div>
            )}
          </div>

          {/* 썸네일 이미지 */}
          <div style={{ marginTop: '20px' }}>
            <label htmlFor="thumbnail_img">썸네일 이미지</label>
            <div>
              <input
                id="thumbnail_img"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e, 'thumbnail_img')}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('thumbnail_img').click()}
              >
                썸네일 이미지 선택
              </button>
              {thumbnailImg && (
                <button
                  type="button"
                  onClick={() => handleImageRemove('thumbnail_img')}
                  style={{ marginLeft: '10px' }}
                >
                  제거
                </button>
              )}
            </div>
            {thumbnailImgPreview && (
              <div style={{ marginTop: '10px' }}>
                <img
                  src={thumbnailImgPreview}
                  alt="썸네일 이미지 미리보기"
                  style={{ maxWidth: '200px', maxHeight: '150px' }}
                />
              </div>
            )}
            {thumbnailImg && (
              <div
                style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}
              >
                업로드된 이미지: {thumbnailImg}
              </div>
            )}
          </div>
        </div>

        {/* 연락처 정보 */}
        <div>
          <h3>연락처 정보</h3>

          <div>
            <label htmlFor="contacts.phone">전화번호</label>
            <input
              id="contacts.phone"
              {...register('contacts.phone', {
                required: '전화번호는 필수 입력 항목입니다.',
              })}
            />
          </div>

          <div>
            <label htmlFor="contacts.fax">팩스</label>
            <input id="contacts.fax" {...register('contacts.fax')} />
          </div>

          <div>
            <label htmlFor="contacts.email">이메일</label>
            <input
              id="contacts.email"
              type="email"
              {...register('contacts.email')}
            />
          </div>

          <div>
            <label htmlFor="contacts.website">웹사이트</label>
            <input id="contacts.website" {...register('contacts.website')} />
          </div>
        </div>

        {/* 태그 정보 */}
        <div>
          <h3>태그 정보</h3>

          {/* 업종 선택 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              업종 (다중 선택 가능)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {industryTypes.map((type) => (
                <label key={type.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedIndustryTypes.includes(type.id)}
                    onChange={(e) => handleTagChange('industry', type.id, e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  {type.name}
                </label>
              ))}
            </div>
          </div>

          {/* 규모 선택 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              규모 (다중 선택 가능)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {capacityTypes.map((type) => (
                <label key={type.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedCapacityTypes.includes(type.id)}
                    onChange={(e) => handleTagChange('capacity', type.id, e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  {type.name}
                </label>
              ))}
            </div>
          </div>

          {/* 재료 선택 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              재료 (다중 선택 가능)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {materialTypes.map((type) => (
                <label key={type.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedMaterialTypes.includes(type.id)}
                    onChange={(e) => handleTagChange('material', type.id, e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  {type.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 갤러리 */}
        <div>
          <h3>갤러리</h3>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#666', fontSize: '14px' }}>
              이미지를 드래그하여 순서를 변경할 수 있습니다.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {galleryFields.map((field, index) => (
              <div
                key={field.id}
                style={{
                  padding: '15px',
                  border: '2px dashed #ddd',
                  borderRadius: '12px',
                  backgroundColor: '#fafafa',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  cursor: 'move'
                }}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', index.toString());
                  e.currentTarget.style.opacity = '0.5';
                  e.currentTarget.style.transform = 'scale(0.95)';
                  setDraggedIndex(index);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (draggedIndex !== null && draggedIndex !== index) {
                    e.currentTarget.style.backgroundColor = '#e3f2fd';
                    e.currentTarget.style.borderColor = '#2196f3';
                  }
                }}
                onDragLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fafafa';
                  e.currentTarget.style.borderColor = '#ddd';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.backgroundColor = '#fafafa';
                  e.currentTarget.style.borderColor = '#ddd';

                  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                  const toIndex = index;

                  console.log('Drop event:', { fromIndex, toIndex, galleryFields: galleryFields.length });

                  if (fromIndex !== toIndex && fromIndex >= 0 && toIndex >= 0) {
                    // 현재 갤러리 데이터 가져오기
                    const currentGallery = watch('gallery');
                    const newGallery = [...currentGallery];

                    // 아이템 이동
                    const [movedItem] = newGallery.splice(fromIndex, 1);
                    newGallery.splice(toIndex, 0, movedItem);

                    // 순서 번호 업데이트
                    newGallery.forEach((item, idx) => {
                      item.order_num = idx + 1;
                    });

                    // 폼 데이터 업데이트
                    setValue('gallery', newGallery);

                    // 미리보기 순서도 업데이트
                    const newPreviews = {};
                    Object.keys(galleryPreviews).forEach((key) => {
                      const oldIndex = parseInt(key);
                      if (oldIndex === fromIndex) {
                        newPreviews[toIndex] = galleryPreviews[oldIndex];
                      } else if (oldIndex === toIndex) {
                        newPreviews[fromIndex] = galleryPreviews[oldIndex];
                      } else {
                        newPreviews[oldIndex] = galleryPreviews[oldIndex];
                      }
                    });
                    setGalleryPreviews(newPreviews);
                  }
                }}
                onDragEnd={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1)';
                  setDraggedIndex(null);
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <h4 style={{ margin: '0', color: '#333' }}>이미지 {index + 1}</h4>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <span style={{
                      fontSize: '12px',
                      color: '#666',
                      backgroundColor: '#e9ecef',
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}>
                      순서: {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeGallery(index)}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      삭제
                    </button>
                  </div>
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
                      onClick={() => document.getElementById(`gallery.${index}.image_url`).click()}
                      style={{
                        border: '2px dashed #ccc',
                        borderRadius: '8px',
                        padding: '40px 20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: 'white',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#007bff';
                        e.target.style.backgroundColor = '#f8f9fa';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#ccc';
                        e.target.style.backgroundColor = 'white';
                      }}
                    >
                      <div style={{ fontSize: '24px', color: '#ccc', marginBottom: '10px' }}>+</div>
                      <div style={{ color: '#666' }}>이미지 선택</div>
                    </div>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={galleryPreviews[index]}
                        alt={`갤러리 이미지 ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        display: 'flex',
                        gap: '5px'
                      }}>
                        <button
                          type="button"
                          onClick={() => document.getElementById(`gallery.${index}.image_url`).click()}
                          style={{
                            background: 'rgba(0, 123, 255, 0.9)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          변경
                        </button>
                        <button
                          type="button"
                          onClick={() => handleImageRemove('gallery', index)}
                          style={{
                            background: 'rgba(220, 53, 69, 0.9)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          제거
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              appendGallery({
                image_url: '',
                order_num: galleryFields.length + 1,
              })
            }
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
          >
            + 갤러리 이미지 추가
          </button>
        </div>

        {/* 제출 버튼 */}
        <div>
          <button type="submit" disabled={loading}>
            {loading ? '등록 중...' : 'Store 등록'}
          </button>
        </div>
      </form>
    </AdminStorePage>
  );
}
