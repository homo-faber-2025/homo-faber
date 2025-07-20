'use client';

import StorePageContent from '@/components/StorePageContent';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import styled from '@emotion/styled';

const PanelHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #eee;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: bold;
    color: #333;
  }
`;

export default function StorePage() {
  const { isLoading } = useApp();
  const router = useRouter();

  const handleStoreSelect = (store) => {
    router.push(`/store/${store.id}`, { scroll: false });
  };

  return (
    <>
      <PanelHeader>
        <h2>상점 목록</h2>
      </PanelHeader>

      {isLoading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
      ) : (
        <StorePageContent onStoreSelect={handleStoreSelect} isPanel={true} />
      )}
    </>
  );
}
