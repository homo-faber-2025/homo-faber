import { NextResponse } from 'next/server';
import { createServerSupabaseClientSimple } from '@/utils/supabase/server-client';

// GET /api/stores - 모든 스토어 조회
export async function GET(request) {
  try {
    const supabase = createServerSupabaseClientSimple();
    const { searchParams } = new URL(request.url);
    const searchKeyword = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = supabase
      .from('stores')
      .select(`
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
      `, { count: 'exact' })
      .order('priority', { ascending: false })
      .order('name')
      .range(offset, offset + limit - 1);

    // 검색 키워드가 있는 경우
    if (searchKeyword && searchKeyword.trim() !== '') {
      query = query.or(`name.ilike.%${searchKeyword}%,keyword.cs.{${searchKeyword}}`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '스토어 목록을 불러오는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      data: data || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: count ? offset + limit < count : false
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/stores - 스토어 생성
export async function POST(request) {
  try {
    const supabase = createServerSupabaseClientSimple();
    const body = await request.json();

    const {
      name,
      person,
      description,
      address,
      latitude,
      longitude,
      close,
      move,
      move_address,
      move_latitude,
      move_longitude,
      priority,
      keyword,
      card_img,
      thumbnail_img,
      contacts,
      capacities,
      industries,
      materials,
      gallery
    } = body;

    // 입력 검증
    if (!name || !person) {
      return NextResponse.json(
        { error: '스토어명과 담당자는 필수입니다.' },
        { status: 400 }
      );
    }

    // 1. 스토어 기본 정보 생성
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .insert({
        name,
        person,
        description,
        address,
        latitude,
        longitude,
        close,
        move,
        move_address,
        move_latitude,
        move_longitude,
        priority: priority || false,
        keyword: keyword || null,
        card_img: card_img || null,
        thumbnail_img: thumbnail_img || null,
      })
      .select()
      .single();

    if (storeError) {
      console.error('Store creation error:', storeError);
      return NextResponse.json(
        { error: '스토어 생성 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    const storeId = store.id;

    // 2. 연락처 정보 생성
    if (contacts) {
      const { error: contactsError } = await supabase
        .from('store_contacts')
        .insert({
          store_id: storeId,
          phone: contacts.phone,
          telephone: contacts.telephone,
          fax: contacts.fax,
          email: contacts.email,
          website: contacts.website,
        });

      if (contactsError) {
        console.error('Contacts creation error:', contactsError);
        return NextResponse.json(
          { error: '연락처 정보 생성 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }
    }

    // 3. 용량 타입 정보 생성
    if (capacities && capacities.length > 0) {
      const capacityInserts = capacities.map((capacityId) => ({
        store_id: storeId,
        capacity_type_id: capacityId,
      }));

      const { error: capacityError } = await supabase
        .from('store_capacity')
        .insert(capacityInserts);

      if (capacityError) {
        console.error('Capacity creation error:', capacityError);
        return NextResponse.json(
          { error: '용량 타입 정보 생성 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }
    }

    // 4. 업종 타입 정보 생성
    if (industries && industries.length > 0) {
      const industryInserts = industries.map((industryId) => ({
        store_id: storeId,
        industry_type_id: industryId,
      }));

      const { error: industryError } = await supabase
        .from('store_industry')
        .insert(industryInserts);

      if (industryError) {
        console.error('Industry creation error:', industryError);
        return NextResponse.json(
          { error: '업종 타입 정보 생성 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }
    }

    // 5. 재료 타입 정보 생성
    if (materials && materials.length > 0) {
      const materialInserts = materials.map((materialId) => ({
        store_id: storeId,
        material_type_id: materialId,
      }));

      const { error: materialError } = await supabase
        .from('store_material')
        .insert(materialInserts);

      if (materialError) {
        console.error('Material creation error:', materialError);
        return NextResponse.json(
          { error: '재료 타입 정보 생성 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }
    }

    // 6. 갤러리 정보 생성
    if (gallery && gallery.length > 0) {
      const galleryInserts = gallery.map((image, index) => ({
        store_id: storeId,
        image_url: image.image_url,
        order_num: image.order_num || index + 1,
      }));

      const { error: galleryError } = await supabase
        .from('store_gallery')
        .insert(galleryInserts);

      if (galleryError) {
        console.error('Gallery creation error:', galleryError);
        return NextResponse.json(
          { error: '갤러리 정보 생성 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ data: store });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
