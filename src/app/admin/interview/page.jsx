"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInterviews } from '@/hooks/useInterviews';
import { deleteInterview } from '@/utils/supabase/interview';
import styled from '@emotion/styled';

const AdminInterviewPage = styled.div`
  padding: 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  background: white;
  z-index: 10;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e1e5e9;
  position: sticky;
  top:0;
  background: white;

  h1 {
    margin: 0;
    color: #333;
    font-size: 2rem;
  }
`;

const CreateButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #28a745;
  color: white;

  &:hover {
    background-color: #218838;
  }
`;

const InterviewList = styled.div`
  display: grid;
  gap: 20px;
`;

const InterviewCard = styled.div`
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const InterviewTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
`;

const InterviewActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.edit {
    background-color: #007bff;
    color: white;

    &:hover {
      background-color: #0056b3;
    }
  }

  &.delete {
    background-color: #dc3545;
    color: white;

    &:hover {
      background-color: #c82333;
    }
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
`;

const InterviewAdminPage = () => {
  const router = useRouter();
  const { interviews, isLoading, error } = useInterviews();

  const handleCreateNew = () => {
    router.push('/admin/interview/create');
  };

  const handleEdit = (interviewId) => {
    router.push(`/admin/interview/edit/${interviewId}`);
  };

  const handleDelete = async (interviewId) => {
    if (confirm('정말로 이 인터뷰를 삭제하시겠습니까?')) {
      try {
        await deleteInterview(interviewId);
        alert('인터뷰가 삭제되었습니다.');
        // 목록 새로고침
        window.location.reload();
      } catch (error) {
        console.error('삭제 중 오류 발생:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <AdminInterviewPage>
        <Header>
          <h1>인터뷰 관리</h1>
          <CreateButton onClick={handleCreateNew}>새로 작성</CreateButton>
        </Header>
        <LoadingMessage>인터뷰 목록을 불러오는 중...</LoadingMessage>
      </AdminInterviewPage>
    );
  }

  if (error) {
    return (
      <AdminInterviewPage>
        <Header>
          <h1>인터뷰 관리</h1>
          <CreateButton onClick={handleCreateNew}>새로 작성</CreateButton>
        </Header>
        <div style={{ color: 'red', textAlign: 'center', padding: '40px' }}>
          오류가 발생했습니다: {error.message}
        </div>
      </AdminInterviewPage>
    );
  }

  return (
    <AdminInterviewPage>
      <Header>
        <h1>인터뷰 관리</h1>
        <CreateButton onClick={handleCreateNew}>새로 작성</CreateButton>
      </Header>

      {interviews.length === 0 ? (
        <EmptyMessage>
          등록된 인터뷰가 없습니다. 새로 작성해보세요!
        </EmptyMessage>
      ) : (
        <InterviewList>
          {interviews.map((interview) => (
            <InterviewCard key={interview.id}>
              <InterviewTitle>
                {interview.stores?.name || '알 수 없음'}
              </InterviewTitle>
              <InterviewActions>
                <ActionButton
                  className="edit"
                  onClick={() => handleEdit(interview.id)}
                >
                  수정
                </ActionButton>
                <ActionButton
                  className="delete"
                  onClick={() => handleDelete(interview.id)}
                >
                  삭제
                </ActionButton>
              </InterviewActions>
            </InterviewCard>
          ))}
        </InterviewList>
      )}
    </AdminInterviewPage>
  );
};

export default InterviewAdminPage;
