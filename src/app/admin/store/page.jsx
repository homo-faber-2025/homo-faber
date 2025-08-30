"use client";

import { useStores } from '@/hooks/useStores';
import { deleteStore } from '@/utils/supabase/stores';
import AdminPage from '@/components/admin/AdminPage';
import styled from '@emotion/styled';

const StoreInfo = styled.div`
  flex: 1;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const StoreName = styled.h3`
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
`;

const StoreDescription = styled.p`
  color: #444;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const StoreAddress = styled.p`
  color: #888;
  font-size: 0.8rem;
  padding-left: 10px;
`;

const StoreAdminPage = () => {
  const { stores, isLoading, error } = useStores();

  const renderStoreItem = (store) => (
    <StoreInfo>
      <StoreName>{store.name || '알 수 없음'}</StoreName>
      <StoreDescription>
        {store.person || '(이름 정보 없음)'}
      </StoreDescription>
      <StoreAddress>
        {store.address || '(주소 정보 없음)'}
      </StoreAddress>
    </StoreInfo>
  );

  return (
    <AdminPage
      title="가게 관리"
      createPath="/admin/store"
      isLoading={isLoading}
      error={error}
      items={stores}
      renderItem={renderStoreItem}
      onDelete={deleteStore}
    />
  );
};

export default StoreAdminPage;
