import InterviewDetailContainer from '@/container/InterviewDetailContainer';

export const metadata = {
  title: '인터뷰 - 산림동의 만드는 사람들: 호모파베르',
  description: '청계천·을지로 기술자들의 이야기를 들어볼 수 있습니다. 기술자분들이 어떻게 작업하고 있는지 어떻게 이 장소에서 작업을 이어가고 있는지 이야기를 들어보세요!',
  openGraph: {
    title: '인터뷰 - 산림동의 만드는 사람들: 호모파베르',
    description: '청계천·을지로 기술자들의 이야기를 들어볼 수 있습니다. 기술자분들이 어떻게 작업하고 있는지 어떻게 이 장소에서 작업을 이어가고 있는지 이야기를 들어보세요!',
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
    title: '인터뷰 - 산림동의 만드는 사람들: 호모파베르',
    description: '청계천·을지로 기술자들의 이야기를 들어볼 수 있습니다. 기술자분들이 어떻게 작업하고 있는지 어떻게 이 장소에서 작업을 이어가고 있는지 이야기를 들어보세요!',
    images: ['/img/DSC03100.jpg'],
  }
};

export default function RootLayout({ children }) {
  return (
    <>
      <InterviewDetailContainer />
      {children}
    </>
  );
}