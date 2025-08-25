import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getBookmarks, addBookmark, removeBookmark, isBookmarked } from '@/utils/supabase/bookmarks';

export const useBookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkedStores, setBookmarkedStores] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 북마크 목록 로드
  const loadBookmarks = useCallback(async () => {
    if (!user) {
      setBookmarks([]);
      setBookmarkedStores(new Set());
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getBookmarks(user.id);
      setBookmarks(data);

      // 북마크된 스토어 ID들을 Set으로 관리
      const bookmarkedIds = new Set(data.map(bookmark => bookmark.store_id));
      setBookmarkedStores(bookmarkedIds);
    } catch (err) {
      setError(err.message);
      console.error('북마크 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 북마크 추가/제거 토글
  const toggleBookmark = useCallback(async (storeId) => {
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    try {
      setError(null);
      const isCurrentlyBookmarked = bookmarkedStores.has(storeId);

      if (isCurrentlyBookmarked) {
        // 북마크 제거
        await removeBookmark(user.id, storeId);
        setBookmarkedStores(prev => {
          const newSet = new Set(prev);
          newSet.delete(storeId);
          return newSet;
        });
        setBookmarks(prev => prev.filter(bookmark => bookmark.store_id !== storeId));
      } else {
        // 북마크 추가
        await addBookmark(user.id, storeId);
        setBookmarkedStores(prev => new Set([...prev, storeId]));
        // 새로 추가된 북마크는 나중에 loadBookmarks에서 전체 목록을 다시 로드
        await loadBookmarks();
      }
    } catch (err) {
      setError(err.message);
      console.error('북마크 토글 오류:', err);
    }
  }, [user, bookmarkedStores, loadBookmarks]);

  // 특정 스토어가 북마크되어 있는지 확인
  const isStoreBookmarked = useCallback((storeId) => {
    return bookmarkedStores.has(storeId);
  }, [bookmarkedStores]);

  // 사용자 변경 시 북마크 목록 다시 로드
  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  return {
    bookmarks,
    bookmarkedStores,
    loading,
    error,
    toggleBookmark,
    isStoreBookmarked,
    loadBookmarks
  };
};
