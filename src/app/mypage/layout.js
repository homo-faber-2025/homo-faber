import MypageEditContainer from '@/container/MypageEditContainer';
import MypageFnqDeatilContainer from '@/container/MypageFnqDeatilContainer';

export const metadata = {
  title: '내정보 - 산림동의 만드는 사람들: 호모파베르',
  description: '내 정보를 확인하고 수정할 수 있습니다. 내 정보를 확인하고 수정할 수 있습니다.',
  openGraph: {
    title: '내정보 - 산림동의 만드는 사람들: 호모파베르',
    description: '내 정보를 확인하고 수정할 수 있습니다. 내 정보를 확인하고 수정할 수 있습니다.',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: '',
    title: '내정보 - 산림동의 만드는 사람들: 호모파베르',
    description: '내 정보를 확인하고 수정할 수 있습니다. 내 정보를 확인하고 수정할 수 있습니다.',
  }
};

export default function MyPageLayout({ children }) {
  return <>
    <MypageEditContainer />
    <MypageFnqDeatilContainer />
    {children}
  </>
}