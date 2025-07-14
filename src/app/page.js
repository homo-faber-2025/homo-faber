'use client';

import Map3D from '@/components/Map3D';
import { getStores } from '@/utils/supabase/stores';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

const ExampleFont = styled.div`
  font-size: ${(props) => props.theme.fontSize.xlg};
`;

export default function Home() {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStores() {
      try {
        const data = await getStores();
        setStores(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStores();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Map3D stores={stores} />
  );
}
