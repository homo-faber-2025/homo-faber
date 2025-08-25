import { createClient } from './client';

export async function updateUserProfile(userId, profileData) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.updateUser({
    data: profileData
  });

  if (error) throw error;
  return data;
}
