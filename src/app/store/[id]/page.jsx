import StoreDetailContainer from '@/container/StoreDetailContainer';

function StoreDetailPage({ params }) {
  return (
    <>
      <StoreDetailContainer storeId={params.id} />
    </>
  );
}

export default StoreDetailPage; 