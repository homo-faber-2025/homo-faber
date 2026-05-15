export const metadata = {
  title: '문의 - 산림동의 만드는 사람들: 호모파베르',
  description: '청계천·을지로 기술자들에게 직접 작품을 의뢰해볼 수 있습니다. 작품에 대한 설명과 스케치를 보내주시면 적절한 기술자분들과 상담을 진행해드립니다!',
  openGraph: {
    title: '문의 - 산림동의 만드는 사람들: 호모파베르',
    description: '청계천·을지로 기술자들에게 직접 작품을 의뢰해볼 수 있습니다. 작품에 대한 설명과 스케치를 보내주시면 적절한 기술자분들과 상담을 진행해드립니다!',
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
    title: '문의 - 산림동의 만드는 사람들: 호모파베르',
    description: '청계천·을지로 기술자들에게 직접 작품을 의뢰해볼 수 있습니다. 작품에 대한 설명과 스케치를 보내주시면 적절한 기술자분들과 상담을 진행해드립니다!',
    images: ['/img/DSC03100.jpg'],
  },
};

export default function FnqLayout({ children }) {
  return <div>{children}</div>;
}