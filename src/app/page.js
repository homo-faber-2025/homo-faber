'use client';

import styled from '@emotion/styled';

const ExampleFont = styled.div`
  font-size: ${(props) => props.theme.fontSize.xlg};
`;

export default function Home() {
  return <ExampleFont>Welcome</ExampleFont>;
}
