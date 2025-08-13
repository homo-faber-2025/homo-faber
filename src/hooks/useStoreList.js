import { useState, useEffect } from 'react';
import { getStores } from '@/utils/supabase/stores';

/**
 * store 목록을 가져오는 커스텀 훅
 * @returns {Object} store 목록과 로딩 상태
 */
export const useStoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStores();
        setStores(data || []);
      } catch (err) {
        console.error('Store 목록 가져오기 오류:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return { stores, loading, error };
};
