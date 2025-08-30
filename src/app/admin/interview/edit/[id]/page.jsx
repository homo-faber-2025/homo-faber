"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getInterviewById, updateInterview } from '@/utils/supabase/interview';
import InterviewForm from '@/components/admin/InterviewForm';

const InterviewEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const interviewId = params.id;

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const saveFormRef = useRef(null);

  useEffect(() => {
    const loadInterview = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getInterviewById(interviewId);
        setInterviewData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (interviewId) {
      loadInterview();
    }
  }, [interviewId]);

  const handleBack = () => {
    router.push('/admin/interview');
  };

  const handleSave = async (interviewData) => {
    try {
      setIsSaving(true);
      await updateInterview(interviewId, interviewData);
      alert('수정 완료');
      router.push('/admin/interview');
    } catch (error) {
      console.error('수정 중 오류 발생:', error);
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <InterviewForm
      mode="edit"
      initialData={interviewData}
      onSave={handleSave}
      onBack={handleBack}
      isSaving={isSaving}
      isLoading={isLoading}
      onSaveClick={saveFormRef}
    />

  );
};

export default InterviewEditPage;
