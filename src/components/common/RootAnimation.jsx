'use client';

import AnimatedPanel from '@/components/common/AnimatedPanel';
import { usePathname } from 'next/navigation';

function RootAnimation() {
  const pathname = usePathname();
  // 현재 라우트에 맞는 컴포넌트 렌더링
  const renderComponent = () => {
    if (pathname.startsWith('/interview')) {
      return <AnimatedPanel baseRoute='interview' />;
    } else if (pathname.startsWith('/word')) {
      return <AnimatedPanel baseRoute='word' />;
    }
    return null;
  };

  return (
    <>
      {renderComponent()}
    </>
  );
}

export default RootAnimation;