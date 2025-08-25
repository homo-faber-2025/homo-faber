import { createClient } from './client';

export async function getStores() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('stores')
    .select(
      `
      *,
      store_contacts(
        phone
      ),
      store_tags(
        industry_types(name),
        capacity_types(name),
        material_types(name)
      )
    `,
    )
    .order('name');

  if (error) throw error;
  return data;
}

export async function getStoreById(id) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('stores')
    .select(
      `
      *,
      store_contacts(
        phone,
        fax,
        email,
        website
      ),
      store_tags(
        industry_types(name),
        capacity_types(name),
        material_types(name)
      ),
      store_gallery(
        image_url,
        order_num
      )
    `,
    )
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createStore(storeData) {
  const supabase = createClient();

  try {
    // 1. stores 테이블에 기본 정보 삽입
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .insert({
        name: storeData.name,
        description: storeData.description,
        address: storeData.address,
        card_img: storeData.card_img || null,
        thumbnail_img: storeData.thumbnail_img || null,
        // 기타 store 테이블 필드들
      })
      .select()
      .single();

    if (storeError) throw storeError;

    const storeId = store.id;

    if (storeData.contacts) {
      const { error: contactsError } = await supabase
        .from('store_contacts')
        .insert({
          store_id: storeId,
          phone: storeData.contacts.phone,
          fax: storeData.contacts.fax,
          email: storeData.contacts.email,
          website: storeData.contacts.website,
        });

      if (contactsError) throw contactsError;
    }

    if (storeData.tags && storeData.tags.length > 0) {
      const tagInserts = storeData.tags.map((tag) => ({
        store_id: storeId,
        industry_type_id: tag.industry_type_id,
        capacity_type_id: tag.capacity_type_id,
        material_type_id: tag.material_type_id,
      }));

      const { error: tagsError } = await supabase
        .from('store_tags')
        .insert(tagInserts);

      if (tagsError) throw tagsError;
    }

    if (storeData.gallery && storeData.gallery.length > 0) {
      const galleryInserts = storeData.gallery.map((image, index) => ({
        store_id: storeId,
        image_url: image.image_url,
        order_num: image.order_num || index + 1,
      }));

      const { error: galleryError } = await supabase
        .from('store_gallery')
        .insert(galleryInserts);

      if (galleryError) throw galleryError;
    }

    return store;
  } catch (error) {
    console.error('Store 생성 중 오류:', error);
    throw error;
  }
}

export async function getIndustryTypes() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('industry_types')
    .select('id, name')
    .order('name');

  if (error) throw error;
  return data;
}

export async function getCapacityTypes() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('capacity_types')
    .select('id, name')
    .order('name');

  if (error) throw error;
  return data;
}

export async function getMaterialTypes() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('material_types')
    .select('id, name')
    .order('name');

  if (error) throw error;
  return data;
}

export async function deleteStore(storeId) {
  const supabase = createClient();

  try {
    // 관련 데이터 삭제 (외래키 제약조건 때문에 순서 중요)
    // 1. store_gallery 삭제
    const { error: galleryError } = await supabase
      .from('store_gallery')
      .delete()
      .eq('store_id', storeId);

    if (galleryError) throw galleryError;

    // 2. store_tags 삭제
    const { error: tagsError } = await supabase
      .from('store_tags')
      .delete()
      .eq('store_id', storeId);

    if (tagsError) throw tagsError;

    // 3. store_contacts 삭제
    const { error: contactsError } = await supabase
      .from('store_contacts')
      .delete()
      .eq('store_id', storeId);

    if (contactsError) throw contactsError;

    // 4. stores 테이블에서 삭제
    const { error: storeError } = await supabase
      .from('stores')
      .delete()
      .eq('id', storeId);

    if (storeError) throw storeError;

    return { success: true };
  } catch (error) {
    console.error('Store 삭제 중 오류:', error);
    throw error;
  }
}

export async function updateStore(storeId, storeData) {
  const supabase = createClient();

  try {
    // 1. stores 테이블 업데이트
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .update({
        name: storeData.name,
        description: storeData.description,
        address: storeData.address,
        keyword: storeData.keyword || null,
        card_img: storeData.card_img || null,
        thumbnail_img: storeData.thumbnail_img || null,
        // 기타 store 테이블 필드들
      })
      .eq('id', storeId)
      .select()
      .single();

    if (storeError) throw storeError;

    // 2. store_contacts 업데이트 (기존 데이터 삭제 후 새로 삽입)
    if (storeData.contacts) {
      // 기존 연락처 삭제
      const { error: deleteContactsError } = await supabase
        .from('store_contacts')
        .delete()
        .eq('store_id', storeId);

      if (deleteContactsError) throw deleteContactsError;

      // 새 연락처 삽입
      const { error: contactsError } = await supabase
        .from('store_contacts')
        .insert({
          store_id: storeId,
          phone: storeData.contacts.phone,
          fax: storeData.contacts.fax,
          email: storeData.contacts.email,
          website: storeData.contacts.website,
        });

      if (contactsError) throw contactsError;
    }

    // 3. store_tags 업데이트 (기존 데이터 삭제 후 새로 삽입)
    if (storeData.tags && storeData.tags.length > 0) {
      // 기존 태그 삭제
      const { error: deleteTagsError } = await supabase
        .from('store_tags')
        .delete()
        .eq('store_id', storeId);

      if (deleteTagsError) throw deleteTagsError;

      // 새 태그 삽입
      const tagInserts = storeData.tags.map((tag) => ({
        store_id: storeId,
        industry_type_id: tag.industry_type_id,
        capacity_type_id: tag.capacity_type_id,
        material_type_id: tag.material_type_id,
      }));

      const { error: tagsError } = await supabase
        .from('store_tags')
        .insert(tagInserts);

      if (tagsError) throw tagsError;
    }

    // 4. store_gallery 업데이트 (기존 데이터 삭제 후 새로 삽입)
    if (storeData.gallery && storeData.gallery.length > 0) {
      // 기존 갤러리 삭제
      const { error: deleteGalleryError } = await supabase
        .from('store_gallery')
        .delete()
        .eq('store_id', storeId);

      if (deleteGalleryError) throw deleteGalleryError;

      // 새 갤러리 삽입
      const galleryInserts = storeData.gallery.map((image, index) => ({
        store_id: storeId,
        image_url: image.image_url,
        order_num: image.order_num || index + 1,
      }));

      const { error: galleryError } = await supabase
        .from('store_gallery')
        .insert(galleryInserts);

      if (galleryError) throw galleryError;
    }

    return store;
  } catch (error) {
    console.error('Store 업데이트 중 오류:', error);
    throw error;
  }
}
