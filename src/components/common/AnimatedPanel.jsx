'use client';

import { usePathname } from 'next/navigation';
import styled from '@emotion/styled';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import InterviewContainer from '@/container/InterviewContainer';
import WordContainer from '@/container/WordContainer';
import StoreContainer from '@/container/StoreContainer';

const SidePanelWrapper = styled(motion.main)`
  width: 80dvw;
  height: 100dvh;
  position: fixed;
  right: ${(props) => props.right};
  top: 0px;
  z-index: 5;
  overflow: hidden;
  background: blue;
`;

function AnimatedPanel({
  children,
  baseRoute,
  onWrapperClick,
  className
}) {
  const pathname = usePathname();
  const [right, setRight] = useState('-81dvw');


  useEffect(() => {
    const newRight = pathname.startsWith(`/${baseRoute}`) ? '0' : '-81dvw';
    setRight(newRight);
  }, [pathname, baseRoute]);


  // baseRoute에 따라 컴포넌트 렌더링
  const renderComponent = () => {
    switch (baseRoute) {
      case 'store':
        return <StoreContainer />;
      case 'interview':
        return <InterviewContainer />;
      case 'word':
        return <WordContainer />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <SidePanelWrapper
        pathname={pathname}
        baseRoute={baseRoute}
        onClick={onWrapperClick}
        initial={{ right: '-81dvw' }}
        animate={{ right: right }}
        exit={{ right: '-81dvw' }}
        transition={{ duration: 1, ease: [0.2, 0, 0.4, 1] }}
        right={right}
        className={className}
      >
        {renderComponent()}
      </SidePanelWrapper>
    </AnimatePresence>
  );
}

export default AnimatedPanel;