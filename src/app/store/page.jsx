'use client';

import Search from '@/components/Search';
import StoreList from '@/components/StoreList';
import { useStores } from '@/hooks/useStores';
import { getStores } from '@/utils/supabase/stores';
import { useEffect, useState } from 'react';

function StorePage() {
  const [stores, setStores] = useState([]);
  const [searchKeyword, setSearchKeyWord] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const filteredStores = useStores(stores, searchKeyword);

  useEffect(() => {
    async function fetchStores() {
      try {
        const data = await getStores();
        console.log('Fetched stores:', data);

        setStores(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStores();
  }, []);

  const handleSearch = (keyword) => {
    console.log('검색어:', keyword);
    setSearchKeyWord(keyword);
  };

  // 로딩 시 표시방법에 대해 의논할 것
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  // 테이블은 이름만 오름차순/내림차순 정렬
  return (
    <>
      <Search onSearch={handleSearch} />
      {isLoading ? (
        <div>로딩 중...</div>
      ) : (
        <StoreList stores={filteredStores} />
      )}
    </>
  );
}

export default StorePage;
