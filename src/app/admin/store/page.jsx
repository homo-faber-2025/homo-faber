"use client";

import { useStores } from '@/hooks/useStores';
import { deleteStore } from '@/utils/supabase/stores';
import AdminPage from '@/components/admin/AdminPage';
import styled from '@emotion/styled';

const StoreInfo = styled.div`
  flex: 1;
`;

const StoreName = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
`;

const StoreDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const StoreAddress = styled.p`
  margin: 4px 0 0 0;
  color: #888;
  font-size: 0.8rem;
`;

const StoreAdminPage = () => {
  const { stores, isLoading, error } = useStores();

  const renderStoreItem = (store) => (
    <StoreInfo>
      <StoreName>{store.name || '알 수 없음'}</StoreName>
      <StoreDescription>
        {store.description || '설명이 없습니다.'}
      </StoreDescription>
      <StoreAddress>
        {store.address || '주소 정보가 없습니다.'}
      </StoreAddress>
    </StoreInfo>
  );

  return (
    <AdminPage
      title="스토어 관리"
      createButtonText="새로 만들기"
      createPath="/admin/store"
      isLoading={isLoading}
      error={error}
      items={stores}
      emptyMessage="등록된 스토어가 없습니다. 새로 만들어보세요!"
      renderItem={renderStoreItem}
      onDelete={deleteStore}
      deleteConfirmMessage="정말로 이 스토어를 삭제하시겠습니까?"
      deleteSuccessMessage="스토어가 삭제되었습니다."
      deleteErrorMessage="삭제 중 오류가 발생했습니다."
    />
  );
};

export default StoreAdminPage;
