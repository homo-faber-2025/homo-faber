"use client";

import { useParams } from 'next/navigation';
import WordForm from '@/components/admin/WordForm';

const WordEditPage = () => {
  const params = useParams();
  const wordId = params.id;

  return <WordForm mode="edit" wordId={wordId} />;
};

export default WordEditPage;
