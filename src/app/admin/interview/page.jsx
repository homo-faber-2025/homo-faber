"use client";

import { useInterviews } from '@/hooks/useInterviews';
import { deleteInterview } from '@/utils/supabase/interview';
import AdminPage from '@/components/admin/AdminPage';
import styled from '@emotion/styled';

const InterviewTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
`;

const InterviewAdminPage = () => {
  const { interviews, isLoading, error } = useInterviews();

  const renderInterviewItem = (interview) => (
    <InterviewTitle>
      {interview.stores?.name || '알 수 없음'}
    </InterviewTitle>
  );

  return (
    <AdminPage
      title="인터뷰 관리"
      createPath="/admin/interview"
      isLoading={isLoading}
      error={error}
      items={interviews}
      renderItem={renderInterviewItem}
      onDelete={deleteInterview}
    />
  );
};

export default InterviewAdminPage;
