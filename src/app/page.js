'use client';

import Map3D from '@/components/Map3D';
import styled from '@emotion/styled';

const ExampleFont = styled.div`
  font-size: ${(props) => props.theme.fontSize.xlg};
`;

export default function Home() {
  return (
    <Map3D />
  );
}
