"use client";

import { useParams } from 'next/navigation';
import WordContainer from '@/container/WordContainer';

function WordDetailPage() {
  const params = useParams();
  const wordId = params.id;

  return (
    <WordContainer
      onLoadComplete={() => { }}
      selectedWordId={wordId}
    />
  );
}

export default WordDetailPage;
