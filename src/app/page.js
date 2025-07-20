'use client';

import StorePageContent from '@/components/StorePageContent';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import StorePage from '@/app/store/page';

const PreviewContent = styled.div`
  cursor: pointer;
`;

export default function Home() {
  const { stores, isLoading } = useApp();
  const router = useRouter();

  const handlePreviewClick = () => {
    router.push('/store', { scroll: false });
  };

  const handleStoreSelect = (store) => {
    router.push(`/store/${store.id}`, { scroll: false });
  };

  return (
    <>
      {/* 30% 미리보기 표시 */}
      <PreviewContent onClick={handlePreviewClick}>
        {isLoading ? (
          <div
            style={{ padding: '8px', textAlign: 'center', fontSize: '0.75rem' }}
          >
            로딩 중...
          </div>
        ) : (
          <StorePage />
        )}
      </PreviewContent>
    </>
  );
}
