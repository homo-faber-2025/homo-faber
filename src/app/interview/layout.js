import InterviewContainer from '@/container/InterviewContainer';

export const metadata = {
  title: '인터뷰 - 산림동의 만드는 사람들: 호모파베르',
  description: '',
  openGraph: {
    title: '인터뷰 - 산림동의 만드는 사람들: 호모파베르',
    description: '',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: '',
    title: '인터뷰 - 산림동의 만드는 사람들: 호모파베르',
    description: '',
    images: '',
  },
};

export default function RootLayout({ children }) {
  return (
    <>
      <InterviewContainer />
      {children}
    </>
  );
}