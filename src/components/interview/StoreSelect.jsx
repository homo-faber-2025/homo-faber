"use client";

import { useStoreList } from '@/hooks/useStoreList';
import styles from './StoreSelect.module.css';

const StoreSelect = ({ selectedStoreId, onStoreChange, placeholder = "스토어를 선택하세요" }) => {
  const { stores, loading, error } = useStoreList();

  const handleChange = (e) => {
    const storeId = e.target.value;
    onStoreChange(storeId);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>스토어 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>스토어 목록을 불러올 수 없습니다: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <label htmlFor="store-select" className={styles.label}>
        연결할 스토어
      </label>
      <select
        id="store-select"
        value={selectedStoreId || ''}
        onChange={handleChange}
        className={styles.select}
        required
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {stores.map((store) => (
          <option key={store.id} value={store.id}>
            {store.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StoreSelect;
