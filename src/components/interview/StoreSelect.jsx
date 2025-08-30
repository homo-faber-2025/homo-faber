"use client";

import { useStoreList } from '@/hooks/useStores';
import styled from '@emotion/styled';

const Container = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;

  &::after {
    content: ' *';
    color: #dc3545;
    font-weight: bold;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  color: #333;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &:disabled {
    background-color: #f8f9fa;
    color: #6c757d;
    cursor: not-allowed;
  }
`;

const Loading = styled.div`
  padding: 12px 16px;
  background-color: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  color: #6c757d;
  font-size: 14px;
  text-align: center;
`;

const Error = styled.div`
  padding: 12px 16px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  color: #721c24;
  font-size: 14px;
  text-align: center;
`;

const StoreSelect = ({ selectedStoreId, onStoreChange, placeholder = "스토어를 선택하세요" }) => {
  const { stores, loading, error } = useStoreList();

  const handleChange = (e) => {
    const storeId = e.target.value;
    onStoreChange(storeId);
  };

  if (loading) {
    return (
      <Container>
        <Loading>스토어 목록을 불러오는 중...</Loading>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Error>스토어 목록을 불러올 수 없습니다: {error}</Error>
      </Container>
    );
  }

  return (
    <Container>
      <Label htmlFor="store-select">연결할 스토어</Label>
      <Select
        id="store-select"
        value={selectedStoreId || ''}
        onChange={handleChange}
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
      </Select>
    </Container>
  );
};

export default StoreSelect;
