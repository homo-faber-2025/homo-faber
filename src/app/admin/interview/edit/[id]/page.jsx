"use client";

import { useParams } from 'next/navigation';
import InterviewForm from '@/components/admin/InterviewForm';

const InterviewEditPage = () => {
  const params = useParams();
  const interviewId = params.id;

  return (
    <InterviewForm
      mode="edit"
      interviewId={interviewId}
    />

  );
};

export default InterviewEditPage;
