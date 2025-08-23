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
