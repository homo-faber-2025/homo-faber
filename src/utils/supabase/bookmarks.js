import { createClient } from './client';

/**
 * 사용자의 북마크 목록을 가져옵니다.
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Array>} 북마크 목록
 */
export async function getBookmarks(userId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookmarks')
    .select(`
      *,
      stores (
        id,
        name,
        address,
        keyword,
        store_industry (
          industry_types (name)
        ),
        store_contacts (
          phone
        )
      )
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

/**
 * 북마크를 추가합니다.
 * @param {string} userId - 사용자 ID
 * @param {string} storeId - 스토어 ID
 * @returns {Promise<Object>} 생성된 북마크 데이터
 */
export async function addBookmark(userId, storeId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookmarks')
    .insert([
      {
        user_id: userId,
        store_id: storeId,
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 북마크를 삭제합니다.
 * @param {string} userId - 사용자 ID
 * @param {string} storeId - 스토어 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export async function removeBookmark(userId, storeId) {
  const supabase = createClient();

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('store_id', storeId);

  if (error) throw error;
  return { success: true };
}

/**
 * 특정 스토어가 북마크되어 있는지 확인합니다.
 * @param {string} userId - 사용자 ID
 * @param {string} storeId - 스토어 ID
 * @returns {Promise<boolean>} 북마크 여부
 */
export async function isBookmarked(userId, storeId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('store_id', storeId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116은 결과가 없을 때
  return !!data;
}
