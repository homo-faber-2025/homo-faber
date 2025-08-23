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

export default function StoreCreateForm() {
  const [loading, setLoading] = useState(false);
  const [industryTypes, setIndustryTypes] = useState([]);
  const [capacityTypes, setCapacityTypes] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [cardImgPreview, setCardImgPreview] = useState('');
  const [thumbnailImgPreview, setThumbnailImgPreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState({});

  // 이미지 업로드 훅 사용
  const { uploadImage } = useImageUpload({ bucket: 'gallery', maxSizeInMB: 1 });

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
      tags: [
        {
          industry_type_id: '',
          capacity_type_id: '',
          material_type_id: '',
        },
      ],
      gallery: [],
    },
  });

  // card_img와 thumbnail_img 값 감시
  const cardImg = watch('card_img');
  const thumbnailImg = watch('thumbnail_img');

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: 'tags',
  });

  const {
    fields: galleryFields,
    append: appendGallery,
    remove: removeGallery,
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

  // 이미지 업로드 핸들러
  const handleImageUpload = async (file, type, index = null) => {
    try {
      const result = await uploadImage(file);
      if (result.success) {
        const imageUrl = result.file.url;

        if (type === 'card_img' || type === 'thumbnail_img') {
          setValue(type, imageUrl);

          // 미리보기 설정
          if (type === 'card_img') {
            setCardImgPreview(imageUrl);
          } else if (type === 'thumbnail_img') {
            setThumbnailImgPreview(imageUrl);
          }
        } else if (type === 'gallery' && index !== null) {
          setValue(`gallery.${index}.image_url`, imageUrl);
          setGalleryPreviews((prev) => ({
            ...prev,
            [index]: imageUrl,
          }));
        }
      } else {
        alert('이미지 업로드에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
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
      handleImageUpload(file, type, index);
    }
  };

  // 이미지 제거 핸들러
  const handleImageRemove = (type, index = null) => {
    if (type === 'card_img') {
      setValue(type, '');
      setCardImgPreview('');
    } else if (type === 'thumbnail_img') {
      setValue(type, '');
      setThumbnailImgPreview('');
    } else if (type === 'gallery' && index !== null) {
      setValue(`gallery.${index}.image_url`, '');
      setGalleryPreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[index];
        return newPreviews;
      });
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const filteredTags = data.tags.filter(
        (tag) =>
          tag.industry_type_id || tag.capacity_type_id || tag.material_type_id,
      );

      const filteredGallery = data.gallery.filter((item) => item.image_url);

      const storeData = {
        ...data,
        tags: filteredTags,
        gallery: filteredGallery,
      };

      const newStore = await createStore(storeData);
      console.log('Store 생성 완료:', newStore);
      alert('Store가 성공적으로 등록되었습니다.');
      reset();
      setCardImgPreview('');
      setThumbnailImgPreview('');
      setGalleryPreviews({});
    } catch (error) {
      console.error('Store 등록 실패:', error);
      alert('Store 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
          {tagFields.map((field, index) => (
            <div key={field.id}>
              <h4>태그 {index + 1}</h4>

              <div>
                <label htmlFor={`tags.${index}.industry_type_id`}>업종</label>
                <select
                  id={`tags.${index}.industry_type_id`}
                  {...register(`tags.${index}.industry_type_id`)}
                >
                  <option value="">선택하세요</option>
                  {industryTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`tags.${index}.capacity_type_id`}>규모</label>
                <select
                  id={`tags.${index}.capacity_type_id`}
                  {...register(`tags.${index}.capacity_type_id`)}
                >
                  <option value="">선택하세요</option>
                  {capacityTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`tags.${index}.material_type_id`}>재료</label>
                <select
                  id={`tags.${index}.material_type_id`}
                  {...register(`tags.${index}.material_type_id`)}
                >
                  <option value="">선택하세요</option>
                  {materialTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {index > 0 && (
                <button type="button" onClick={() => removeTag(index)}>
                  태그 삭제
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              appendTag({
                industry_type_id: '',
                capacity_type_id: '',
                material_type_id: '',
              })
            }
          >
            태그 추가
          </button>
        </div>

        {/* 갤러리 */}
        <div>
          <h3>갤러리</h3>
          {galleryFields.map((field, index) => (
            <div
              key={field.id}
              style={{
                marginBottom: '20px',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
              }}
            >
              <h4>갤러리 이미지 {index + 1}</h4>

              <div>
                <label htmlFor={`gallery.${index}.image_url`}>
                  이미지 파일
                </label>
                <div>
                  <input
                    id={`gallery.${index}.image_url`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e, 'gallery', index)}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById(`gallery.${index}.image_url`)
                        .click()
                    }
                  >
                    이미지 선택
                  </button>
                  {galleryPreviews[index] && (
                    <button
                      type="button"
                      onClick={() => handleImageRemove('gallery', index)}
                      style={{ marginLeft: '10px' }}
                    >
                      제거
                    </button>
                  )}
                </div>

                {/* 이미지 미리보기 */}
                {galleryPreviews[index] && (
                  <div style={{ marginTop: '10px' }}>
                    <img
                      src={galleryPreviews[index]}
                      alt={`갤러리 이미지 ${index + 1} 미리보기`}
                      style={{ maxWidth: '200px', maxHeight: '150px' }}
                    />
                  </div>
                )}

                {/* 업로드된 이미지 URL 표시 */}
                {galleryPreviews[index] && (
                  <div
                    style={{
                      marginTop: '5px',
                      fontSize: '12px',
                      color: '#666',
                    }}
                  >
                    업로드된 이미지: {galleryPreviews[index]}
                  </div>
                )}
              </div>

              <div style={{ marginTop: '15px' }}>
                <label htmlFor={`gallery.${index}.order_num`}>순서</label>
                <input
                  id={`gallery.${index}.order_num`}
                  type="number"
                  {...register(`gallery.${index}.order_num`)}
                  style={{ marginLeft: '10px', padding: '5px' }}
                />
              </div>

              <div style={{ marginTop: '15px' }}>
                <button type="button" onClick={() => removeGallery(index)}>
                  이미지 삭제
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              appendGallery({
                image_url: '',
                order_num: galleryFields.length + 1,
              })
            }
            style={{ marginTop: '10px' }}
          >
            갤러리 이미지 추가
          </button>
        </div>

        {/* 제출 버튼 */}
        <div>
          <button type="submit" disabled={loading}>
            {loading ? '등록 중...' : 'Store 등록'}
          </button>
        </div>
      </form>
    </div>
  );
}
