export const metadata = {
  title: '소개 - 산림동의 만드는 사람들: 호모파베르',
  description: '산림동의 만드는 사람들: 호모파베르에 대한 소개를 확인할 수 있습니다. 산림동의 만드는 사람들: 호모파베르에 대한 소개를 확인할 수 있습니다.',
  openGraph: {
    title: '소개 - 산림동의 만드는 사람들: 호모파베르',
    description: '산림동의 만드는 사람들: 호모파베르에 대한 소개를 확인할 수 있습니다. 산림동의 만드는 사람들: 호모파베르에 대한 소개를 확인할 수 있습니다.',
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
    title: '소개 - 산림동의 만드는 사람들: 호모파베르',
    description: '산림동의 만드는 사람들: 호모파베르에 대한 소개를 확인할 수 있습니다. 산림동의 만드는 사람들: 호모파베르에 대한 소개를 확인할 수 있습니다.',
    images: ['/img/DSC03100.jpg'],
  },
};

export default function InfoLayout({ children }) {
  return <div>{children}</div>;
}