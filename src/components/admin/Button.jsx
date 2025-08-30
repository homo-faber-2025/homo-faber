import styled from '@emotion/styled';

const ButtonComponent = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-gothic);
  background-color: ${props => props.active ? 'black' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#333'};

  &:hover {
    background-color: ${props => props.active ? 'black' : '#e9ecef'};
  }

  &.create {
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    font-size: 13px;

    &:hover {
      background-color: #218838;
    }
  }

  &.edit {
    background-color: #007bff;
    color: white;
    font-size: 11px;

    &:hover {
      background-color: #0056b3;
    }
  }

  &.delete {
    background-color: #dc3545;
    color: white;
    font-size: 11px;

    &:hover {
      background-color: #c82333;
    }
  }
`;

export default function Button({ children, className, active, onClick }) {
  return (
    <ButtonComponent className={className} active={active} onClick={onClick} >
      {children}
    </ButtonComponent>
  );
}