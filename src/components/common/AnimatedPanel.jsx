'use client';

import { usePathname } from 'next/navigation';
import styled from '@emotion/styled';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SidePanelWrapper = styled(motion.main)`
  width: 80dvw;
  height: 100dvh;
  position: fixed;
  right: ${(props) => props.right};
  top: 0px;
  z-index: 3;
  overflow: hidden;
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
        {children}
      </SidePanelWrapper>
    </AnimatePresence>
  );
}

export default AnimatedPanel;