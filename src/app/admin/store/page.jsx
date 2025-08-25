"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStores } from '@/hooks/useStores';
import { deleteStore } from '@/utils/supabase/stores';
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e1e5e9;
  position: sticky;
  top:0;
  background: white;

  h1 {
    margin: 0;
    color: #333;
    font-size: 2rem;
  }
`;

const CreateButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #28a745;
  color: white;

  &:hover {
    background-color: #218838;
  }
`;

const StoreList = styled.div`
  display: grid;
  gap: 20px;
`;

const StoreCard = styled.div`
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

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

const StoreActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.edit {
    background-color: #007bff;
    color: white;

    &:hover {
      background-color: #0056b3;
    }
  }

  &.delete {
    background-color: #dc3545;
    color: white;

    &:hover {
      background-color: #c82333;
    }
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
`;

const StoreAdminPage = () => {
  const router = useRouter();
  const { stores, isLoading, error } = useStores();

  const handleCreateNew = () => {
    router.push('/admin/store/create');
  };

  const handleEdit = (storeId) => {
    router.push(`/admin/store/edit/${storeId}`);
  };

  const handleDelete = async (storeId) => {
    if (confirm('정말로 이 스토어를 삭제하시겠습니까?')) {
      try {
        await deleteStore(storeId);
        alert('스토어가 삭제되었습니다.');
        // 목록 새로고침
        window.location.reload();
      } catch (error) {
        console.error('삭제 중 오류 발생:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <AdminStorePage>
        <Header>
          <h1>스토어 관리</h1>
          <CreateButton onClick={handleCreateNew}>새로 만들기</CreateButton>
        </Header>
        <LoadingMessage>스토어 목록을 불러오는 중...</LoadingMessage>
      </AdminStorePage>
    );
  }

  if (error) {
    return (
      <AdminStorePage>
        <Header>
          <h1>스토어 관리</h1>
          <CreateButton onClick={handleCreateNew}>새로 만들기</CreateButton>
        </Header>
        <div style={{ color: 'red', textAlign: 'center', padding: '40px' }}>
          오류가 발생했습니다: {error.message}
        </div>
      </AdminStorePage>
    );
  }

  return (
    <AdminStorePage>
      <Header>
        <h1>스토어 관리</h1>
        <CreateButton onClick={handleCreateNew}>새로 만들기</CreateButton>
      </Header>

      {stores.length === 0 ? (
        <EmptyMessage>
          등록된 스토어가 없습니다. 새로 만들어보세요!
        </EmptyMessage>
      ) : (
        <StoreList>
          {stores.map((store) => (
            <StoreCard key={store.id}>
              <StoreInfo>
                <StoreName>{store.name || '알 수 없음'}</StoreName>
                <StoreDescription>
                  {store.description || '설명이 없습니다.'}
                </StoreDescription>
                <StoreAddress>
                  {store.address || '주소 정보가 없습니다.'}
                </StoreAddress>
              </StoreInfo>
              <StoreActions>
                <ActionButton
                  className="edit"
                  onClick={() => handleEdit(store.id)}
                >
                  수정
                </ActionButton>
                <ActionButton
                  className="delete"
                  onClick={() => handleDelete(store.id)}
                >
                  삭제
                </ActionButton>
              </StoreActions>
            </StoreCard>
          ))}
        </StoreList>
      )}
    </AdminStorePage>
  );
};

export default StoreAdminPage;
