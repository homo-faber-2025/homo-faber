"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getStoreById, updateStore, getIndustryTypes, getCapacityTypes, getMaterialTypes } from '@/utils/supabase/stores';
import { checkAndCompressImage } from '@/utils/imageCompression';
import { createClient } from '@/utils/supabase/client';
import styled from '@emotion/styled';

const AdminStoreEditPage = styled.div`
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

const StoreEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const storeId = params.id;

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadStoreData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 스토어 데이터 로드
        const store = await getStoreById(storeId);
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
          setFax(contact.fax || '');
          setEmail(contact.email || '');
          setWebsite(contact.website || '');
        }

        // 태그 정보 설정
        if (store.store_tags && store.store_tags.length > 0) {
          const industryIds = store.store_tags
            .filter(tag => tag.industry_types)
            .map(tag => tag.industry_types.id);
          const capacityIds = store.store_tags
            .filter(tag => tag.capacity_types)
            .map(tag => tag.capacity_types.id);
          const materialIds = store.store_tags
            .filter(tag => tag.material_types)
            .map(tag => tag.material_types.id);

          setSelectedIndustryTypes(industryIds);
          setSelectedCapacityTypes(capacityIds);
          setSelectedMaterialTypes(materialIds);
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
        setIsLoading(false);
      }
    };

    if (storeId) {
      loadStoreData();
    }
  }, [storeId]);

  const handleBack = () => {
    router.push('/admin/store');
  };

  const handleImageUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // 이미지 압축
      const compressedFile = await checkAndCompressImage(file, 0.5);

      // Supabase Storage에 업로드
      const supabase = createClient();
      const fileName = `${type}_${Date.now()}_${compressedFile.name}`;

      const { data, error } = await supabase.storage
        .from('gallery')
        .upload(fileName, compressedFile);

      if (error) throw error;

      // 공개 URL 생성
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      if (type === 'card') {
        setCardImg(publicUrl);
        setCardImgPreview(publicUrl);
      } else if (type === 'thumbnail') {
        setThumbnailImg(publicUrl);
        setThumbnailImgPreview(publicUrl);
      }

    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const updateData = {
        name,
        description,
        address,
        keyword: keyword ? keyword.split(',').map(k => k.trim()).filter(k => k) : [],
        card_img: cardImg,
        thumbnail_img: thumbnailImg,
        contacts: {
          phone,
          fax,
          email,
          website
        },
        tags: []
      };

      // 선택된 태그들을 업데이트 데이터에 추가
      selectedIndustryTypes.forEach(industryId => {
        updateData.tags.push({
          industry_type_id: industryId,
          capacity_type_id: null,
          material_type_id: null
        });
      });

      selectedCapacityTypes.forEach(capacityId => {
        updateData.tags.push({
          industry_type_id: null,
          capacity_type_id: capacityId,
          material_type_id: null
        });
      });

      selectedMaterialTypes.forEach(materialId => {
        updateData.tags.push({
          industry_type_id: null,
          capacity_type_id: null,
          material_type_id: materialId
        });
      });

      await updateStore(storeId, updateData);
      alert('수정 완료');
      router.push('/admin/store');
    } catch (error) {
      console.error('수정 중 오류 발생:', error);
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
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

  if (isLoading) {
    return (
      <AdminStoreEditPage>
        <Header>
          <h1>스토어 수정</h1>
          <BackBtn onClick={handleBack}>목록으로</BackBtn>
        </Header>
        <LoadingMessage>스토어 데이터를 불러오는 중...</LoadingMessage>
      </AdminStoreEditPage>
    );
  }

  if (error) {
    return (
      <AdminStoreEditPage>
        <Header>
          <h1>스토어 수정</h1>
          <BackBtn onClick={handleBack}>목록으로</BackBtn>
        </Header>
        <ErrorMessage>오류가 발생했습니다: {error}</ErrorMessage>
      </AdminStoreEditPage>
    );
  }

  return (
    <AdminStoreEditPage>
      <Header>
        <h1>스토어 수정</h1>
        <Actions>
          <BackBtn onClick={handleBack}>목록으로</BackBtn>
          <SaveBtn onClick={handleSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </SaveBtn>
        </Actions>
      </Header>

      <FormSection>
        <h2>{storeData?.name}</h2>

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
                onChange={(e) => handleImageUpload(e, 'card')}
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
                onChange={(e) => handleImageUpload(e, 'thumbnail')}
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
      </FormSection>
    </AdminStoreEditPage>
  );
};

export default StoreEditPage;
