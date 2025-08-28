"use client";

import { useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { updateStore } from '@/utils/supabase/stores';
import StoreForm from '@/components/admin/StoreForm';

const StoreEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const storeId = params.id;
  const [isSaving, setIsSaving] = useState(false);
  const saveFormRef = useRef(null);

  const handleSave = async (storeData) => {
    try {
      setIsSaving(true);
      await updateStore(storeId, storeData);
      alert('수정 완료');
      router.push('/admin/store');
    } catch (error) {
      console.error('수정 중 오류 발생:', error);
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/store');
  };

  return (
    <StoreForm
      mode="edit"
      storeId={storeId}
      onSave={handleSave}
      onBack={handleBack}
      isSaving={isSaving}
      onSaveClick={saveFormRef}
    />
  );
};

export default StoreEditPage;
