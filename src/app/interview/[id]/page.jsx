import { getInterviewById } from '@/utils/supabase/interview';

export async function generateMetadata({ params }) {
  const interviewId = params.id;
  console.log(interviewId);

  try {
    const interview = await getInterviewById(interviewId);
    if (!interview) {
      return {
        title: '인터뷰를 찾을 수 없습니다',
        description: '요청하신 인터뷰를 찾을 수 없습니다.',
      };
    }

    // 키워드 조합
    const keywords = [
      interview.stores?.name,
      interview.stores?.person,
      interview.intro,
      ...(interview.stores?.store_tags?.map(tag => tag.industry_types?.name).filter(Boolean) || [])
    ].filter(Boolean).join(', ');

    return {
      title: `${interview.stores?.name} 인터뷰 - 산림동의 만드는 사람들: 호모파베르`,
      description: interview.intro || `${interview.stores?.name}의 ${interview.stores?.person}님과의 인터뷰를 확인하세요.`,
      keywords: keywords,
      openGraph: {
        title: `${interview.stores?.name} 인터뷰 - 산림동의 만드는 사람들: 호모파베르`,
        description: interview.intro || `${interview.stores?.name}의 ${interview.stores?.person}님과의 인터뷰를 확인하세요.`,
        images: interview.cover_img ? [
          {
            url: interview.cover_img,
            width: 1200,
            height: 630,
            alt: `${interview.stores?.name} 인터뷰 커버 이미지`,
          }
        ] : [],
        type: 'article',
        locale: 'ko_KR',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${interview.stores?.name} 인터뷰 - 산림동의 만드는 사람들: 호모파베르`,
        description: interview.intro || `${interview.stores?.name}의 ${interview.stores?.person}님과의 인터뷰를 확인하세요.`,
        images: interview.cover_img ? [interview.cover_img] : [],
      },
    };
  } catch (error) {
    console.error('메타데이터 생성 중 오류:', error);
    return {
      title: '인터뷰 상세',
      description: '인터뷰 정보를 불러오는 중 오류가 발생했습니다.',
    };
  }
}

export default function InterviewDetailPage({ params }) {
  return <></>;
}