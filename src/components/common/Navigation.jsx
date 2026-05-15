'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import useWindowSize from '@/hooks/useWindowSize';
import { useLanguage } from '@/hooks/useLanguage';
import * as S from '@/styles/common/navigation.style';
import LanguageToggle from '@/components/common/LanguageToggle';

function isActive(pathname, href) {
  // Treat '/' as home for '/home' as well
  if (href === '/home') {
    return pathname === '/' || pathname.startsWith('/home');
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navigation() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMap3D, setIsMap3D] = useState(false); // 지도 상태 추적 (기본값: 2D)
  const { t } = useLanguage();

  // 클라이언트에서만 실행되도록 설정
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 클라이언트에서만 useWindowSize 사용
  const windowSize = useWindowSize();
  const isMobile = isClient ? windowSize.isMobile : false;

  useEffect(() => {
    if (isClient) {
      setIsOpen(!isMobile);
    }
  }, [isMobile, isClient]);

  // 다국어 네비게이션 링크
  const links = [
    { href: '/', label: t('nav.home') },
    { href: '/store', label: t('nav.store') },
    { href: '/interview', label: t('nav.interview') },
    { href: '/word', label: t('nav.word') },
    { href: '/fnq', label: t('nav.fnq') },
    { href: '/info', label: t('nav.info') },
    { href: user ? '/mypage' : '/login', label: user ? t('nav.mypage') : t('nav.login') },
  ];

  const toggleNavigation = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // 지도 전환 함수
  const handleMapToggle = () => {
    setIsMap3D(!isMap3D); // 상태 업데이트
    window.dispatchEvent(new CustomEvent('toggleMapView'));
  };

  return (
    <>
      <S.NavigationIcon
        src="/navIcon.png"
        alt="home"
        onClick={toggleNavigation}
        isOpen={isOpen}
      />
      <S.NavigationBg isOpen={isOpen} />
      <S.NavigationWrapper isOpen={isOpen} onClick={isMobile ? handleLinkClick : undefined}>
        {links.map(({ href, label }) => {
          const active = isActive(pathname, href);
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <S.NavigationItem active={active}>
                {label}
              </S.NavigationItem>
            </Link>
          );
        })}
        <LanguageToggle isOpen={isMobile && isOpen} />


        {isClient && isMobile && (
          <S.CloseButton onClick={handleLinkClick}>
            ✕
          </S.CloseButton>
        )}
      </S.NavigationWrapper>

      <S.MapToggleButton isOpen={isMobile && isOpen} onClick={handleMapToggle} isActive={isMap3D}>
        <S.SwitchText isActive={!isMap3D}>
          2D
        </S.SwitchText>
        <S.SwitchTrack isActive={isMap3D}>
          <S.SwitchThumb isActive={isMap3D} />
        </S.SwitchTrack>
        <S.SwitchText isActive={isMap3D}>
          3D
        </S.SwitchText>
      </S.MapToggleButton>

    </>
  );
}


