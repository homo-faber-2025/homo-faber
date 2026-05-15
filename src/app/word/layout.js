export const metadata = {
  title: '용어 - 산림동의 만드는 사람들: 호모파베르',
  description: '제작에 필요한 용어를 알아볼 수 있습니다. 나에게 필요한 공정이 무엇인지 찾아보거나 새로운 용어를 발견하고 아이디어에 적용해보세요!',
  openGraph: {
    title: `용어 - 산림동의 만드는 사람들: 호모파베르`,
    description: '제작에 필요한 용어를 알아볼 수 있습니다. 나에게 필요한 공정이 무엇인지 찾아보거나 새로운 용어를 발견하고 아이디어에 적용해보세요!',
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
    title: `용어 - 산림동의 만드는 사람들: 호모파베르`,
    description: '제작에 필요한 용어를 알아볼 수 있습니다. 나에게 필요한 공정이 무엇인지 찾아보거나 새로운 용어를 발견하고 아이디어에 적용해보세요!',
    images: ['/img/DSC03100.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}