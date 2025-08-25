import MypageEditContainer from '@/container/MypageEditContainer';

export default function MyPageLayout({ children }) {
  return <>
    <MypageEditContainer />
    {children}
  </>
}