"use client";

import { useWords } from '@/hooks/useWord';
import { deleteWord } from '@/utils/supabase/word';
import AdminPage from '@/components/admin/AdminPage';
import styled from '@emotion/styled';

const WordInfo = styled.div`
  flex: 1;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const WordName = styled.h3`
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
`;

const WordMeaning = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const WordAdminPage = () => {
  const { words, loading: isLoading, error } = useWords();

  const renderWordItem = (word) => (
    <WordInfo>
      <WordName>{word.name || '알 수 없음'}</WordName>
      <WordMeaning>
        {word.meaning || '의미가 없습니다.'}
      </WordMeaning>
    </WordInfo>
  );

  return (
    <AdminPage
      title="단어 관리"
      createPath="/admin/word"
      isLoading={isLoading}
      error={error}
      items={words}
      renderItem={renderWordItem}
      onDelete={deleteWord}
    />
  );
};

export default WordAdminPage;
