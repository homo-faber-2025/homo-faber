import StoreDetailContainer from '@/container/StoreDetailContainer';
import { getStoreById } from '@/utils/supabase/stores';

export async function generateMetadata({ params }) {
  const storeId = params.id;
  console.log(storeId);

  try {
    const store = await getStoreById(storeId);
    if (!store) {
      return {
        title: '스토어를 찾을 수 없습니다',
        description: '요청하신 스토어를 찾을 수 없습니다.',
      };
    }

    // 키워드 조합
    const keywords = [
      store.name,
      ...(store.keyword || []),
      ...(store.store_tags?.map(tag => tag.industry_types?.name).filter(Boolean) || [])
    ].join(', ');

    return {
      title: `${store.name} - 산림동의 만드는 사람들: 호모파베르`,
      description: store.description || `${store.name}의 상세 정보와 연락처를 확인하세요. ${store.address || ''}`,
      keywords: keywords,
      openGraph: {
        title: `${store.name} - 산림동의 만드는 사람들: 호모파베르`,
        description: store.description || `${store.name}의 상세 정보를 확인하세요.`,
        images: store.card_img ? [
          {
            url: store.card_img,
            width: 1200,
            height: 630,
            alt: `${store.name} 대표 이미지`,
          }
        ] : [],
        type: 'website',
        locale: 'ko_KR',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${store.name} - 산림동의 만드는 사람들: 호모파베르`,
        description: store.description || `${store.name}의 상세 정보를 확인하세요.`,
        images: store.card_img ? [store.card_img] : [],
      },
    };
  } catch (error) {
    console.error('메타데이터 생성 중 오류:', error);
    return {
      title: '스토어 상세',
      description: '스토어 정보를 불러오는 중 오류가 발생했습니다.',
    };
  }
}

export default function StoreDetailPage() {
  return <></>;
}
