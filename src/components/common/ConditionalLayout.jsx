'use client';

import { usePathname } from 'next/navigation';
import Map3DWrapper from '@/container/Map3DWrapper';
import AnimatedPanel from '@/components/common/AnimatedPanel';
import StoreContainer from '@/container/StoreContainer';

export default function ConditionalLayout() {
  const pathname = usePathname();

  // admin 라우터인지 확인
  const isAdminRoute = pathname?.startsWith('/admin');

  // admin 라우터가 아닐 때만 Map3D, AnimatedPanel, StoreContainer 렌더링
  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      <Map3DWrapper />
      <StoreContainer />
      <AnimatedPanel baseRoute='interview' />
      <AnimatedPanel baseRoute='word' />
      <AnimatedPanel baseRoute='info' />
      <AnimatedPanel baseRoute='login' />
    </>
  );
}
