import { Gothic_A1, Noto_Serif_KR, ABeeZee } from 'next/font/google';
import './globals.css';
import Providers from '@/app/providers';
import Map3DWrapper from '@/container/Map3DWrapper';
import Navigation from '@/components/common/Navigation';
import AnimatedPanel from '@/components/common/AnimatedPanel';
import StoreContainer from '@/container/StoreContainer';

const gothic = Gothic_A1({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-gothic',
});
const noto = Noto_Serif_KR({
  weight: ['200', '300', '400', '500', '600', '700', '900'],
  subsets: ['latin'],
  variable: '--font-noto',
});
const abeezee = ABeeZee({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-abeezee',
});


export const metadata = {
  title: '산림동의 만드는 사람들: 호모파베르',
  description: '',
  openGraph: {
    title: '산림동의 만드는 사람들: 호모파베르',
    description: '',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: '',
    title: '산림동의 만드는 사람들: 호모파베르',
    description: '',
    images: '',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body
        className={`${gothic.variable} ${noto.variable} ${abeezee.variable}`}
      >
        <Providers>
          <Map3DWrapper />
          <StoreContainer />
          <Navigation />
          <AnimatedPanel baseRoute='interview' />
          <AnimatedPanel baseRoute='word' />
          <AnimatedPanel baseRoute='info' />
          <AnimatedPanel baseRoute='login' />
          {children}
        </Providers>
      </body>
    </html>
  );
}
