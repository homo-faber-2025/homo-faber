import { useMemo } from 'react';

export function useStores(stores, searchKeyword) {
  return useMemo(() => {
    if (!searchKeyword || searchKeyword.length < 2) return stores;

    const keyword = searchKeyword.toLowerCase();

    return stores.filter(
      (store) =>
        store.name?.toLowerCase().includes(keyword) ||
        (Array.isArray(store.keyword) &&
          store.keyword.some((k) => k.toLowerCase().includes(keyword))),
    );
  }, [stores, searchKeyword]);
}
