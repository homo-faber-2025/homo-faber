import { createClient } from './client';

/**
 * 단어를 생성합니다.
 * @param {Object} wordData - 단어 데이터
 * @param {string} wordData.name - 단어명
 * @param {string} wordData.meaning - 단어 의미
 * @param {string} wordData.source - 출처
 * @param {Array<string>} wordData.img - 이미지 URL 배열
 * @returns {Promise<Object>} 생성된 단어 데이터
 */
export async function createWord(wordData) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('word')
    .insert([
      {
        name: wordData.name,
        meaning: wordData.meaning,
        source: wordData.source,
        img: wordData.img || []
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 모든 단어를 가져옵니다.
 * @returns {Promise<Array>} 단어 목록
 */
export async function getWords() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('word')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * 특정 단어를 가져옵니다.
 * @param {string} wordId - 단어 ID
 * @returns {Promise<Object>} 단어 데이터
 */
export async function getWordById(wordId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('word')
    .select('*')
    .eq('id', wordId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * 이름으로 단어를 검색합니다.
 * @param {string} name - 검색할 단어명
 * @returns {Promise<Array>} 검색된 단어 목록
 */
export async function getWordsByName(name) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('word')
    .select('*')
    .ilike('name', `%${name}%`)
    .order('name', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * 의미로 단어를 검색합니다.
 * @param {string} meaning - 검색할 의미
 * @returns {Promise<Array>} 검색된 단어 목록
 */
export async function getWordsByMeaning(meaning) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('word')
    .select('*')
    .ilike('meaning', `%${meaning}%`)
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * 단어를 업데이트합니다.
 * @param {string} wordId - 단어 ID
 * @param {Object} updateData - 업데이트할 데이터
 * @returns {Promise<Object>} 업데이트된 단어 데이터
 */
export async function updateWord(wordId, updateData) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('word')
    .update(updateData)
    .eq('id', wordId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 단어를 삭제합니다.
 * @param {string} wordId - 단어 ID
 * @returns {Promise<boolean>} 삭제 성공 여부
 */
export async function deleteWord(wordId) {
  const supabase = createClient();

  const { error } = await supabase
    .from('word')
    .delete()
    .eq('id', wordId);

  if (error) throw error;
  return true;
}

/**
 * 단어에 이미지를 추가합니다.
 * @param {string} wordId - 단어 ID
 * @param {string} imageUrl - 추가할 이미지 URL
 * @returns {Promise<Object>} 업데이트된 단어 데이터
 */
export async function addImageToWord(wordId, imageUrl) {
  const supabase = createClient();

  // 먼저 현재 단어 데이터를 가져옵니다
  const { data: currentWord, error: fetchError } = await supabase
    .from('word')
    .select('img')
    .eq('id', wordId)
    .single();

  if (fetchError) throw fetchError;

  // 기존 이미지 배열에 새 이미지를 추가합니다
  const updatedImages = [...(currentWord.img || []), imageUrl];

  const { data, error } = await supabase
    .from('word')
    .update({
      img: updatedImages
    })
    .eq('id', wordId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 단어에서 이미지를 제거합니다.
 * @param {string} wordId - 단어 ID
 * @param {string} imageUrl - 제거할 이미지 URL
 * @returns {Promise<Object>} 업데이트된 단어 데이터
 */
export async function removeImageFromWord(wordId, imageUrl) {
  const supabase = createClient();

  // 먼저 현재 단어 데이터를 가져옵니다
  const { data: currentWord, error: fetchError } = await supabase
    .from('word')
    .select('img')
    .eq('id', wordId)
    .single();

  if (fetchError) throw fetchError;

  // 해당 이미지를 제거합니다
  const updatedImages = (currentWord.img || []).filter(img => img !== imageUrl);

  const { data, error } = await supabase
    .from('word')
    .update({
      img: updatedImages
    })
    .eq('id', wordId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
