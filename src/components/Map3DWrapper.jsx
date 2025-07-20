'use client';

import Map3D from './Map3D';
import { getStores } from '@/utils/supabase/stores';
import { usePOI } from '@/hooks/usePOI';
import { useEffect, useState } from 'react';

export default function Map3DWrapper() {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStores() {
      try {
        const data = await getStores();
        setStores(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStores();
  }, []);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Map3D stores={stores} />
} 