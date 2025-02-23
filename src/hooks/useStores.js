import { useMemo } from 'react';

export function useStores(stores, searchKeyword) {
  return useMemo(() => {
    if (!searchKeyword || searchKeyword.length < 2) return stores;

    const keyword = searchKeyword.toLowerCase();

    return stores.filter(
      (store) =>
        store.name?.toLowerCase().includes(keyword) ||
        store.address?.toLowerCase().includes(keyword) ||
        store.store_contacts?.[0]?.phone?.includes(keyword),
    );
  }, [stores, searchKeyword]);
}
