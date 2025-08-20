import StoreDetailContainer from '@/container/StoreDetailContainer';

export const metadata = {
  title: '업체 목록 - 산림동의 만드는 사람들: 호모파베르',
  description: '',
  openGraph: {
    title: `업체 목록 - 산림동의 만드는 사람들: 호모파베르`,
    description: '',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: '',
    title: `업체 목록 - 산림동의 만드는 사람들: 호모파베르`,
    description: '',
    images: '',
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