'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { convertIndustryNameToKorean } from '@/utils/converters';

const TableWrapper = styled.article`
  width: 100vw;
  overflow-x: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* Safari sticky support */
  -webkit-overflow-scrolling: touch;
`;

const StoreTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-gothic);
  /* Safari sticky support */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
`;

const TableHeader = styled.thead`
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

const TableHeaderCell = styled.th`
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

const TableBody = styled.tbody`
  overflow-y: auto;
  letter-spacing: 0.1rem;
  /* Safari sticky support */
  -webkit-overflow-scrolling: touch;
`

const TableRow = styled.tr`
  padding-left: 1px;
  display: flex;
  align-items: center;
  &:hover {
    background-color: ${(props) => props.theme.color.rowHover || '#f9f9f9'};
    cursor: pointer;
  }
`;

const TableCell = styled.td`
  padding: 12px 0px 10px 0px;
  vertical-align: middle;
  font-size: 1.1rem;
  min-width: 140px;
`;

const TitleCell = styled(TableCell)`
  display: flex;
  align-items: center;
  padding-left: 10px;
  letter-spacing: 0.18rem;
  width: 201.8px;
`

const Name = styled.div`
  font-weight: 700;
  margin-right: 12px;
`
const Industry = styled.div`
  margin-right: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`

const Line = styled.div`
  border-bottom: 1.6px dotted; 
  flex: 1;
`

const KeywordCell = styled(TableCell)`
  width: 570px;
  display: block;
`;

const ContactCell = styled(TableCell)`
  padding-left: 15px;
  font-family: var(--font-abeezee);
  letter-spacing: 0.05rem;
  font-size: 1.14rem;
  text-align: right;
  padding-right: 7px;
  // margin-right: 12px;
`


// 테이블 헤더 추가할 것
const StoreList = ({ stores }) => {
  const router = useRouter();

  const handleStoreClick = (storeId) => {
    router.push(`/store/${storeId}`);
  };

  return (
    <TableWrapper>
      <StoreTable>
        <TableHeader>
          <tr style={{ display: 'flex' }}>
            <TableHeaderCell style={{ width: '200px' }}>이름</TableHeaderCell>
            <TableHeaderCell style={{ width: '572px' }}>취급 품목</TableHeaderCell>
            <TableHeaderCell style={{ width: '148px' }}>연락처</TableHeaderCell>
            <TableHeaderCell>주소</TableHeaderCell>
          </tr>
        </TableHeader>
        <TableBody>
          {stores.map((store) => (
            <TableRow key={store.id} onClick={() => handleStoreClick(store.id)}>
              <TitleCell>
                <Name>{store.name}</Name>
                {store.store_industry?.length > 0 && (
                  <Industry>
                    {store.store_industry
                      .map(item => item.industry_types?.name)
                      .filter(Boolean)
                      .map(convertIndustryNameToKorean)
                      .join(' • ')}
                  </Industry>
                )}
                <Line style={{ marginRight: '8px' }} ></Line>
              </TitleCell>
              <KeywordCell>
                {Array.isArray(store.keyword) && store.keyword.length > 0
                  ? <div style={{ paddingLeft: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{store.keyword.join(', ')}</div>
                  : <Line style={{ marginLeft: '-7px' }}></Line>}
              </KeywordCell>
              <ContactCell>
                {store.store_contacts?.[0]?.phone || <Line style={{ marginLeft: '-14px', marginRight: '-4px' }}></Line>}
              </ContactCell>
              <TableCell style={{ paddingLeft: '19px' }}>{store.address}</TableCell>


            </TableRow>
          ))}
        </TableBody>
      </StoreTable>
    </TableWrapper>
  );
};

export default StoreList;
