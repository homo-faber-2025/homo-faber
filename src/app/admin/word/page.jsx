"use client";

import { useWords } from '@/hooks/useWord';
import { deleteWord } from '@/utils/supabase/word';
import AdminPage from '@/components/admin/AdminPage';
import styled from '@emotion/styled';

const WordInfo = styled.div`
  flex: 1;
`;

const WordName = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
`;

const WordMeaning = styled.p`
  margin: 0 0 8px 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const WordSource = styled.p`
  margin: 0;
  color: #888;
  font-size: 0.8rem;
  font-style: italic;
`;

const WordAdminPage = () => {
  const { words, loading: isLoading, error } = useWords();

  const renderWordItem = (word) => (
    <WordInfo>
      <WordName>{word.name || '알 수 없음'}</WordName>
      <WordMeaning>
        {word.meaning || '의미가 없습니다.'}
      </WordMeaning>
      {word.source && (
        <WordSource>출처: {word.source}</WordSource>
      )}
    </WordInfo>
  );

  return (
    <AdminPage
      title="단어"
      createPath="/admin/word"
      isLoading={isLoading}
      error={error}
      items={words}
      emptyMessage="등록된 단어가 없습니다. 새로 만들어보세요!"
      renderItem={renderWordItem}
      onDelete={deleteWord}
    />
  );
};

export default WordAdminPage;
