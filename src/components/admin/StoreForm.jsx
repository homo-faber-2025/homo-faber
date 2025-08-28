'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  overflow-y: auto;
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

const BackBtn = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #6c757d;
  color: white;

  &:hover {
    background-color: #545b62;
  }
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

  input, textarea, select {
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

  select {
    background-color: white;
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

const TagSection = styled.div`
  margin-bottom: 20px;

  h3 {
    margin-bottom: 15px;
    color: #555;
    font-size: 1.3rem;
  }

  .tag-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
  }

  .tag-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tag-item input[type="checkbox"] {
    width: auto;
  }
`;

const GallerySection = styled.div`
  margin-bottom: 20px;

  h3 {
    margin-bottom: 15px;
    color: #555;
    font-size: 1.3rem;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }

  .gallery-item {
    padding: 15px;
    border: 2px dashed #ddd;
    border-radius: 12px;
    background-color: #fafafa;
    position: relative;
    transition: all 0.3s ease;
    cursor: move;

    &:hover {
      border-color: #007bff;
      background-color: #f8f9fa;
    }
  }

  .gallery-item.dragging {
    opacity: 0.5;
    transform: scale(0.95);
  }

  .gallery-item.drag-over {
    background-color: #e3f2fd;
    border-color: #2196f3;
  }

  .gallery-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    h4 {
      margin: 0;
      color: #333;
    }

    .order-badge {
      font-size: 12px;
      color: #666;
      background-color: #e9ecef;
      padding: 2px 8px;
      border-radius: 10px;
    }

    .delete-btn {
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 12px;
      cursor: pointer;
    }
  }

  .image-upload-area {
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    background-color: white;
    transition: all 0.3s ease;

    &:hover {
      border-color: #007bff;
      background-color: #f8f9fa;
    }

    .upload-icon {
      font-size: 24px;
      color: #ccc;
      margin-bottom: 10px;
    }

    .upload-text {
      color: #666;
    }
  }

  .image-preview-container {
    position: relative;

    img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 8px;
    }

    .image-actions {
      position: absolute;
      top: 5px;
      right: 5px;
      display: flex;
      gap: 5px;

      button {
        background: rgba(0, 123, 255, 0.9);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 12px;
        cursor: pointer;

        &.remove-btn {
          background: rgba(220, 53, 69, 0.9);
        }
      }
    }
  }

  .add-gallery-btn {
    background: #28a745;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #218838;
    }
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: red;
  font-size: 1.1rem;
`;

const StoreForm = ({
  mode,
  storeId,
  onSave,
  onBack,
  isSaving,
  isLoading,
  onSaveClick // 부모에서 저장 버튼 클릭 시 호출할 함수
}) => {
  // 기본값 설정
  const formMode = mode || 'create';
  const formStoreId = storeId || null;
  const formIsSaving = isSaving || false;
  const formIsLoading = isLoading || false;
  const router = useRouter();
  const [error, setError] = useState(null);
  const [storeData, setStoreData] = useState(null);

  // 폼 상태
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [keyword, setKeyword] = useState('');
  const [cardImg, setCardImg] = useState('');
  const [cardImgPreview, setCardImgPreview] = useState('');
  const [thumbnailImg, setThumbnailImg] = useState('');
  const [thumbnailImgPreview, setThumbnailImgPreview] = useState('');

  // 연락처 정보
  const [phone, setPhone] = useState('');
  const [telephone, setTelephone] = useState('');
  const [fax, setFax] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

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

  const [isUploading, setIsUploading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // 이미지 업로드 훅 사용
  const { uploadImage, processImageForPreview } = useImageUpload({ bucket: 'gallery', maxSizeInMB: 1 });

  // react-hook-form 설정
  const {
    control,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      gallery: [],
    },
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
      onSaveClick.current = handleSave;
    }
  }, [onSaveClick, name, description, address, keyword, cardImg, thumbnailImg, phone, fax, email, website, selectedIndustryTypes, selectedCapacityTypes, selectedMaterialTypes, localImages, galleryPreviews]);

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
          setName(store.name || '');
          setDescription(store.description || '');
          setAddress(store.address || '');

          // keyword를 텍스트로 변환
          if (store.keyword && Array.isArray(store.keyword)) {
            setKeyword(store.keyword.join(', '));
          } else {
            setKeyword('');
          }

          setCardImg(store.card_img || '');
          setCardImgPreview(store.card_img || '');
          setThumbnailImg(store.thumbnail_img || '');
          setThumbnailImgPreview(store.thumbnail_img || '');

          // 연락처 정보 설정
          if (store.store_contacts && store.store_contacts.length > 0) {
            const contact = store.store_contacts[0];
            setPhone(contact.phone || '');
            setTelephone(contact.telephone || '');
            setFax(contact.fax || '');
            setEmail(contact.email || '');
            setWebsite(contact.website || '');
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

  const handleImageRemove = (type, index = null) => {
    if (type === 'card_img') {
      setCardImg('');
      setCardImgPreview('');
      setLocalImages(prev => ({
        ...prev,
        card_img: null,
      }));
    } else if (type === 'thumbnail_img') {
      setThumbnailImg('');
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

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);

      // 이미지 업로드 처리
      let cardImgUrl = cardImg;
      let thumbnailImgUrl = thumbnailImg;
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
      })).filter((item) => item.image_url);

      // keyword 처리
      const processedKeyword = keyword ? keyword.split(',').map(k => k.trim()).filter(k => k) : [];

      const storeData = {
        name,
        description,
        address,
        keyword: processedKeyword,
        card_img: cardImgUrl,
        thumbnail_img: thumbnailImgUrl,
        contacts: {
          phone,
          telephone,
          fax,
          email,
          website
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
  }, [formMode, formStoreId, name, description, address, keyword, cardImg, thumbnailImg, phone, telephone, fax, email, website, selectedIndustryTypes, selectedCapacityTypes, selectedMaterialTypes, localImages, galleryPreviews, uploadImage, watch, onSave, router]);

  if (formIsLoading || isDataLoading) {
    return (
      <AdminStorePage>
        <Header>
          <h1>{formMode === 'create' ? '스토어 등록' : '스토어 수정'}</h1>
          <BackBtn onClick={handleBack}>목록으로</BackBtn>
        </Header>
        <LoadingMessage>스토어 데이터를 불러오는 중...</LoadingMessage>
      </AdminStorePage>
    );
  }

  if (error) {
    return (
      <AdminStorePage>
        <Header>
          <h1>{formMode === 'create' ? '스토어 등록' : '스토어 수정'}</h1>
          <BackBtn onClick={handleBack}>목록으로</BackBtn>
        </Header>
        <ErrorMessage>오류가 발생했습니다: {error}</ErrorMessage>
      </AdminStorePage>
    );
  }

  return (
    <AdminStorePage>
      <Header>
        <h1>{formMode === 'create' ? '스토어 등록' : '스토어 수정'}</h1>
        <Actions>
          <BackBtn onClick={handleBack}>목록으로</BackBtn>
          <SaveBtn onClick={handleSave} disabled={formIsSaving}>
            {formIsSaving ? '저장 중...' : '저장'}
          </SaveBtn>
        </Actions>
      </Header>

      <FormSection>
        <h2>{formMode === 'edit' && storeData?.name ? storeData.name : '스토어 정보'}</h2>

        <FormGrid>
          <div>
            <FormField>
              <label htmlFor="name">스토어명</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="스토어명을 입력하세요"
              />
            </FormField>

            <FormField>
              <label htmlFor="description">설명</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="스토어에 대한 설명을 입력하세요"
              />
            </FormField>

            <FormField>
              <label htmlFor="address">주소</label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="스토어 주소를 입력하세요"
              />
            </FormField>

            <FormField>
              <label htmlFor="keyword">키워드</label>
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="키워드를 쉼표로 구분하여 입력하세요 (예: 조명기구, 특수조명, 일반조명)"
              />
            </FormField>

            <ImageUploadSection>
              <label htmlFor="card-img">카드 이미지</label>
              <input
                id="card-img"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e, 'card_img')}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="upload-button"
                onClick={() => document.getElementById('card-img').click()}
                disabled={isUploading}
              >
                {isUploading ? '업로드 중...' : '카드 이미지 선택'}
              </button>
              {cardImgPreview && (
                <div className="image-preview">
                  <img src={cardImgPreview} alt="카드 이미지 미리보기" />
                </div>
              )}
            </ImageUploadSection>

            <ImageUploadSection>
              <label htmlFor="thumbnail-img">썸네일 이미지</label>
              <input
                id="thumbnail-img"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e, 'thumbnail_img')}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="upload-button"
                onClick={() => document.getElementById('thumbnail-img').click()}
                disabled={isUploading}
              >
                {isUploading ? '업로드 중...' : '썸네일 이미지 선택'}
              </button>
              {thumbnailImgPreview && (
                <div className="image-preview">
                  <img src={thumbnailImgPreview} alt="썸네일 이미지 미리보기" />
                </div>
              )}
            </ImageUploadSection>
          </div>

          <div>
            <FormField>
              <label htmlFor="phone">전화번호</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="전화번호를 입력하세요"
              />
            </FormField>

            <FormField>
              <label htmlFor="telephone">전화번호</label>
              <input
                id="telephone"
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="전화번호를 입력하세요"
              />
            </FormField>

            <FormField>
              <label htmlFor="fax">팩스</label>
              <input
                id="fax"
                type="tel"
                value={fax}
                onChange={(e) => setFax(e.target.value)}
                placeholder="팩스번호를 입력하세요"
              />
            </FormField>

            <FormField>
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
              />
            </FormField>

            <FormField>
              <label htmlFor="website">웹사이트</label>
              <input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="웹사이트 URL을 입력하세요"
              />
            </FormField>

            <TagSection>
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
            </TagSection>

            <TagSection>
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
            </TagSection>

            <TagSection>
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
            </TagSection>
          </div>
        </FormGrid>

        {/* 갤러리 섹션 */}
        <GallerySection>
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
                  e.currentTarget.classList.remove('dragging');
                  setDraggedIndex(null);
                }}
              >
                <div className="gallery-header">
                  <h4>이미지 {index + 1}</h4>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <span className="order-badge">
                      순서: {index + 1}
                    </span>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => removeGallery(index)}
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
                      <div className="image-actions">
                        <button
                          type="button"
                          onClick={() => document.getElementById(`gallery.${index}.image_url`).click()}
                        >
                          변경
                        </button>
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => handleImageRemove('gallery', index)}
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
            className="add-gallery-btn"
            onClick={() =>
              appendGallery({
                image_url: '',
                order_num: galleryFields.length + 1,
              })
            }
          >
            + 갤러리 이미지 추가
          </button>
        </GallerySection>
      </FormSection>
    </AdminStorePage>
  );
};

export default StoreForm;
