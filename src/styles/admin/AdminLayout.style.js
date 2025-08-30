import styled from '@emotion/styled';

export const AdminPageWrapper = styled.div`
  padding: 20px;
  background: white;
`;

export const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e1e5e9;
  position: sticky;
  top: 0;
  background: white;
  font-weight:700;

  h1 {
    margin: 0;
    color: #333;
    font-size: 1.7rem;
  }
`;

export const AdminList = styled.div`
  display: grid;
  gap: 10px;
`;

export const AdminCard = styled.div`
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 10px 15px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

export const AdminActions = styled.div`
  display: flex;
  gap: 10px;
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
`;

export const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  padding: 40px;
`;
