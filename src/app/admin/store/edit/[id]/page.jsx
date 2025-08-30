"use client";

import { useParams } from 'next/navigation';
import StoreForm from '@/components/admin/StoreForm';

const StoreEditPage = () => {
  const params = useParams();
  const storeId = params.id;

  return (
    <StoreForm
      mode="edit"
      storeId={storeId}
    />
  );
};

export default StoreEditPage;
