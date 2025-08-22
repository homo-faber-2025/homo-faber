import { createClient } from './client';

/**
 * 인터뷰를 생성합니다.
 * @param {Object} interviewData - 인터뷰 데이터
 * @param {string} interviewData.store_id - 연결된 스토어 ID
 * @param {Object} interviewData.contents - Editor.js 내용 (JSON)
 * @returns {Promise<Object>} 생성된 인터뷰 데이터
 */
export async function createInterview(interviewData) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('interview')
    .insert([
      {
        store_id: interviewData.store_id,
        contents: interviewData.contents,
        intro: interviewData.intro,
        cover_img: interviewData.cover_img,
        date: interviewData.date,
        interviewee: interviewData.interviewee,
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 모든 인터뷰를 가져옵니다.
 * @returns {Promise<Array>} 인터뷰 목록
 */
export async function getInterviews() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('interview')
    .select(`
      *,
      stores(
        id,
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * 특정 스토어의 인터뷰를 가져옵니다.
 * @param {string} storeId - 스토어 ID
 * @returns {Promise<Array>} 해당 스토어의 인터뷰 목록
 */
export async function getInterviewsByStore(storeId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('interview')
    .select(`
      *,
      stores(
        id,
        name,
        person
      )
    `)
    .eq('store_id', storeId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * 특정 인터뷰를 가져옵니다.
 * @param {string} interviewId - 인터뷰 ID
 * @returns {Promise<Object>} 인터뷰 데이터
 */
export async function getInterviewById(interviewId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('interview')
    .select(`
      *,
      stores(
        id,
        name,
        person
      )
    `)
    .eq('id', interviewId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * 인터뷰를 업데이트합니다.
 * @param {string} interviewId - 인터뷰 ID
 * @param {Object} updateData - 업데이트할 데이터
 * @returns {Promise<Object>} 업데이트된 인터뷰 데이터
 */
export async function updateInterview(interviewId, updateData) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('interview')
    .update(updateData)
    .eq('id', interviewId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 인터뷰를 삭제합니다.
 * @param {string} interviewId - 인터뷰 ID
 * @returns {Promise<boolean>} 삭제 성공 여부
 */
export async function deleteInterview(interviewId) {
  const supabase = createClient();

  const { error } = await supabase
    .from('interview')
    .delete()
    .eq('id', interviewId);

  if (error) throw error;
  return true;
}


