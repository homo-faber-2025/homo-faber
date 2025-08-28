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
      store_capacity(
        capacity_types(id, name)
      ),
      store_industry(
        industry_types(id, name)
      ),
      store_material(
        material_types(id, name)
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
        telephone,
        fax,
        email,
        website
      ),
      store_capacity(
        capacity_types(id, name)
      ),
      store_industry(
        industry_types(id, name)
      ),
      store_material(
        material_types(id, name)
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
    console.log('Creating store with data:', storeData);
    console.log('Keyword data:', storeData.keyword);

    // 1. stores 테이블에 기본 정보 삽입
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .insert({
        name: storeData.name,
        description: storeData.description,
        address: storeData.address,
        keyword: storeData.keyword || null,
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
          telephone: storeData.contacts.telephone,
          fax: storeData.contacts.fax,
          email: storeData.contacts.email,
          website: storeData.contacts.website,
        });

      if (contactsError) throw contactsError;
    }

    // 2. store_capacity 데이터 삽입
    if (storeData.capacities && storeData.capacities.length > 0) {
      const capacityInserts = storeData.capacities.map((capacityId) => ({
        store_id: storeId,
        capacity_type_id: capacityId,
      }));

      const { error: capacityError } = await supabase
        .from('store_capacity')
        .insert(capacityInserts);

      if (capacityError) throw capacityError;
    }

    // 3. store_industry 데이터 삽입
    if (storeData.industries && storeData.industries.length > 0) {
      const industryInserts = storeData.industries.map((industryId) => ({
        store_id: storeId,
        industry_type_id: industryId,
      }));

      const { error: industryError } = await supabase
        .from('store_industry')
        .insert(industryInserts);

      if (industryError) throw industryError;
    }

    // 4. store_material 데이터 삽입
    if (storeData.materials && storeData.materials.length > 0) {
      const materialInserts = storeData.materials.map((materialId) => ({
        store_id: storeId,
        material_type_id: materialId,
      }));

      const { error: materialError } = await supabase
        .from('store_material')
        .insert(materialInserts);

      if (materialError) throw materialError;
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

    // 2. store_capacity 삭제
    const { error: capacityError } = await supabase
      .from('store_capacity')
      .delete()
      .eq('store_id', storeId);

    if (capacityError) throw capacityError;

    // 3. store_industry 삭제
    const { error: industryError } = await supabase
      .from('store_industry')
      .delete()
      .eq('store_id', storeId);

    if (industryError) throw industryError;

    // 4. store_material 삭제
    const { error: materialError } = await supabase
      .from('store_material')
      .delete()
      .eq('store_id', storeId);

    if (materialError) throw materialError;

    // 5. store_contacts 삭제
    const { error: contactsError } = await supabase
      .from('store_contacts')
      .delete()
      .eq('store_id', storeId);

    if (contactsError) throw contactsError;

    // 6. stores 테이블에서 삭제
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
          telephone: storeData.contacts.telephone,
          fax: storeData.contacts.fax,
          email: storeData.contacts.email,
          website: storeData.contacts.website,
        });

      if (contactsError) throw contactsError;
    }

    // 3. store_capacity 업데이트 (기존 데이터 삭제 후 새로 삽입)
    if (storeData.capacities) {
      // 기존 capacity 삭제
      const { error: deleteCapacityError } = await supabase
        .from('store_capacity')
        .delete()
        .eq('store_id', storeId);

      if (deleteCapacityError) throw deleteCapacityError;

      // 새 capacity 삽입
      if (storeData.capacities.length > 0) {
        const capacityInserts = storeData.capacities.map((capacityId) => ({
          store_id: storeId,
          capacity_type_id: capacityId,
        }));

        const { error: capacityError } = await supabase
          .from('store_capacity')
          .insert(capacityInserts);

        if (capacityError) throw capacityError;
      }
    }

    // 4. store_industry 업데이트 (기존 데이터 삭제 후 새로 삽입)
    if (storeData.industries) {
      // 기존 industry 삭제
      const { error: deleteIndustryError } = await supabase
        .from('store_industry')
        .delete()
        .eq('store_id', storeId);

      if (deleteIndustryError) throw deleteIndustryError;

      // 새 industry 삽입
      if (storeData.industries.length > 0) {
        const industryInserts = storeData.industries.map((industryId) => ({
          store_id: storeId,
          industry_type_id: industryId,
        }));

        const { error: industryError } = await supabase
          .from('store_industry')
          .insert(industryInserts);

        if (industryError) throw industryError;
      }
    }

    // 5. store_material 업데이트 (기존 데이터 삭제 후 새로 삽입)
    if (storeData.materials) {
      // 기존 material 삭제
      const { error: deleteMaterialError } = await supabase
        .from('store_material')
        .delete()
        .eq('store_id', storeId);

      if (deleteMaterialError) throw deleteMaterialError;

      // 새 material 삽입
      if (storeData.materials.length > 0) {
        const materialInserts = storeData.materials.map((materialId) => ({
          store_id: storeId,
          material_type_id: materialId,
        }));

        const { error: materialError } = await supabase
          .from('store_material')
          .insert(materialInserts);

        if (materialError) throw materialError;
      }
    }

    // 6. store_gallery 업데이트 (기존 데이터 삭제 후 새로 삽입)
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
