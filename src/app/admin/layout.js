'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styled from '@emotion/styled';

const AdminWrapper = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const AdminTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const AdminButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.active ? '#007bff' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#333'};
  
  &:hover {
    background-color: ${props => props.active ? '#0056b3' : '#e9ecef'};
  }
`;

const ContentArea = styled.div`
  min-height: 400px;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
`;

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('store');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    router.push(`/admin/${tab}`);
  };

  return (
    <AdminWrapper>
      <AdminTitle>관리자 페이지</AdminTitle>

      <ButtonGroup>
        <AdminButton
          active={activeTab === 'store'}
          onClick={() => handleTabClick('store')}
        >
          가게 관리
        </AdminButton>
        <AdminButton
          active={activeTab === 'interview'}
          onClick={() => handleTabClick('interview')}
        >
          인터뷰 관리
        </AdminButton>
        <AdminButton
          active={activeTab === 'word'}
          onClick={() => handleTabClick('word')}
        >
          단어 관리
        </AdminButton>
      </ButtonGroup>

      <ContentArea>
        {children}
      </ContentArea>
    </AdminWrapper>
  );
}
