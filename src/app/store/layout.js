import StoreDetailContainer from '@/container/StoreDetailContainer';

export const metadata = {
  title: '업체 목록 - 산림동의 만드는 사람들: 호모파베르',
  description: '내 작업에 맞는 청계천·을지로 기술자들을  직접 찾아볼 수 있습니다. 나에게 맞는 키워드를 선택하거나 검색하며 내 작업에 꼭 맞는 기술자를 찾아보세요!',
  openGraph: {
    title: `업체 목록 - 산림동의 만드는 사람들: 호모파베르`,
    description: '내 작업에 맞는 청계천·을지로 기술자들을  직접 찾아볼 수 있습니다. 나에게 맞는 키워드를 선택하거나 검색하며 내 작업에 꼭 맞는 기술자를 찾아보세요!',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: '/img/DSC03100.jpg',
        width: 1200,
        height: 630,
        alt: '산림동의 만드는 사람들: 호모파베르',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `업체 목록 - 산림동의 만드는 사람들: 호모파베르`,
    description: '내 작업에 맞는 청계천·을지로 기술자들을  직접 찾아볼 수 있습니다. 나에게 맞는 키워드를 선택하거나 검색하며 내 작업에 꼭 맞는 기술자를 찾아보세요!',
    images: ['/img/DSC03100.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <>
      <StoreDetailContainer />
      {children}
    </>
  );
}