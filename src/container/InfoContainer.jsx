import { useEffect } from 'react';

function InfoContainer({ onLoadComplete }) {
  useEffect(() => {
    if (onLoadComplete) {
      onLoadComplete();
    }
  }, [onLoadComplete]);

  return <div>InfoContainer</div>;
}

export default InfoContainer;