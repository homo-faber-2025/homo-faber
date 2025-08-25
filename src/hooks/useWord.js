import { useState, useEffect, useCallback } from 'react';
import { getWordById, getWords, getWordsByName } from '@/utils/supabase/word';

// 단어 목록 조회 훅
export function useWords() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWords();
      setWords(data || []);
    } catch (err) {
      setError(err.message || '단어 목록을 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching words:', err);
      setWords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchWordsByName = useCallback(async (name) => {
    if (!name || name.trim() === '') {
      await fetchWords();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getWordsByName(name);
      setWords(data || []);
    } catch (err) {
      setError(err.message || '단어 검색 중 오류가 발생했습니다.');
      console.error('Error searching words by name:', err);
      setWords([]);
    } finally {
      setLoading(false);
    }
  }, [fetchWords]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  return {
    words,
    loading,
    error,
    fetchWords,
    searchWordsByName,
    clearError,
    refetch: fetchWords, // refetch 함수 추가
  };
}

// 단일 단어 조회 훅
export function useWord(wordId) {
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWord = useCallback(async (id) => {
    if (!id) {
      setWord(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getWordById(id);
      setWord(data);
    } catch (err) {
      setError(err.message || '단어를 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching word:', err);
      setWord(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchWord(wordId);
  }, [wordId, fetchWord]);

  return {
    word,
    loading,
    error,
    fetchWord,
    clearError,
  };
}

