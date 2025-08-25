import styled from '@emotion/styled';

export const TableWrapper = styled.article`
  width: 100vw;
  overflow-x: visible;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* Safari sticky support */
  -webkit-overflow-scrolling: touch;
`;

export const StoreTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-gothic);
  /* Safari sticky support */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
`;

export const TableHeader = styled.thead`
  background-color: #322F18;
  color: #FFF8B8;
  position: sticky;
  top: 0;
  z-index: 10;
  /* Safari sticky support */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  /* Remove display: flex as it breaks table structure */
`;

export const TableHeaderCell = styled.th`
  padding: 14px 15px 13px 15px;
  text-align: left;
  font-size: 1.2rem;
  font-weight: 800;
  transform: scaleX(0.8);
  transform-origin: left;
  /* Safari sticky support */
  -webkit-transform: scaleX(0.8) translateZ(0);
  transform: scaleX(0.8) translateZ(0);
`;

export const TableBody = styled.tbody`
  overflow-y: auto;
  letter-spacing: 0.1rem;
  /* Safari sticky support */
  -webkit-overflow-scrolling: touch;
`

export const TableRow = styled.tr`
  padding-left: 1px;
  display: flex;
  align-items: center;
  &:hover {
    background-color: ${(props) => props.theme.color.rowHover || '#f9f9f9'};
    cursor: pointer;
  }
`;

export const TableCell = styled.td`
  padding: 12px 0px 10px 0px;
  vertical-align: middle;
  font-size: 1.1rem;
`;

export const BookmarkCell = styled(TableCell)`
  width: 15px;
  padding: unset;
  margin-left: -14px;
  text-align: center;
`;

export const BookmarkButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  hsla(0, 0.00%, 0.00%, 0.05)
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const BookmarkIcon = styled.span`
  font-size: 18px;
  color: ${props => props.isBookmarked ? '#ff6b6b' : '#ccc'};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.isBookmarked ? '#ff5252' : '#999'};
    transform: scale(1.1);
  }
`;

export const TitleCell = styled(TableCell)`
  display: flex;
  align-items: center;
  padding-left: 10px;
  letter-spacing: 0.18rem;
  width: 201.8px;
`

export const Name = styled.div`
  font-weight: 700;
  margin-right: 12px;
`
export const Industry = styled.div`
  margin-right: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`

export const Line = styled.div`
  border-bottom: 1.6px dotted; 
  flex: 1;
`

export const KeywordCell = styled(TableCell)`
  width: 570px;
  display: block;
`;

export const ContactCell = styled(TableCell)`
  padding-left: 15px;
  font-family: var(--font-abeezee);
  letter-spacing: 0.05rem;
  font-size: 1.14rem;
  text-align: right;
  padding-right: 7px;
  width: 140px;
`;

