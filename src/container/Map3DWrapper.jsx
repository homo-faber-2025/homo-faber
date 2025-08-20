'use client';

import Map3D from '../components/common/Map3D';
import { useStores } from '@/hooks/useStores';

export default function Map3DWrapper() {
  const { stores, isLoading, error } = useStores();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading stores</div>;
  }

  return <Map3D stores={stores} />
} 