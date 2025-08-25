import { createClient } from './client';

/**
 * 사용자 프로필을 업데이트합니다.
 * @param {string} userId - 사용자 ID
 * @param {Object} profileData - 업데이트할 프로필 데이터
 * @returns {Promise<Object>} 업데이트된 사용자 데이터
 */
export async function updateUserProfile(userId, profileData) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.updateUser({
    data: profileData
  });

  if (error) throw error;
  return data;
}
