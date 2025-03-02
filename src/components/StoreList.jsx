'use client';

import styled from '@emotion/styled';

const TableWrapper = styled.div`
  width: 100%;
  padding: 20px 0;
  overflow-x: auto;
`;

const StoreTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
`;

const TableHeader = styled.thead`
  background-color: ${(props) => props.theme.color.tableHeader || '#f5f5f5'};
`;

const TableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: bold;
  border-bottom: 1px solid ${(props) => props.theme.color.border};
`;

const TableRow = styled.tr`
  &:hover {
    background-color: ${(props) => props.theme.color.rowHover || '#f9f9f9'};
  }
  border-bottom: 1px solid ${(props) => props.theme.color.border};
`;

const TableCell = styled.td`
  padding: 12px 16px;
  vertical-align: middle;
`;

const KeywordCell = styled(TableCell)`
  max-width: 150px;
`;

const TagCell = styled(TableCell)`
  max-width: 200px;
`;

const KeywordTag = styled.span`
  display: inline-block;
  margin: 2px;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: ${(props) => props.theme.fontSize.sm};
  background-color: ${(props) => props.theme.color.tagBackground || '#e6f7ff'};
`;

const TypeTag = styled.span`
  display: inline-block;
  margin: 2px;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: ${(props) => props.theme.fontSize.sm};
`;

// 테이블 헤더 추가할 것
const StoreList = ({ stores }) => {
  return (
    <TableWrapper>
      <StoreTable>
        <TableHeader>
          <tr>
            <TableHeaderCell>이름</TableHeaderCell>
            <TableHeaderCell>주소</TableHeaderCell>
            <TableHeaderCell>연락처</TableHeaderCell>
            <TableHeaderCell>키워드</TableHeaderCell>
            <TableHeaderCell>태그</TableHeaderCell>
          </tr>
        </TableHeader>
        <tbody>
          {stores.map((store) => (
            <TableRow key={store.id}>
              <TableCell>{store.name}</TableCell>
              <TableCell>{store.address}</TableCell>
              <TableCell>
                {store.store_contacts?.[0]?.phone || '연락처 없음'}
              </TableCell>
              <KeywordCell>
                {Array.isArray(store.keyword) &&
                  store.keyword.map((keyword, index) => (
                    <KeywordTag key={`${store.id}-keyword-${index}`}>
                      {keyword}
                    </KeywordTag>
                  ))}
              </KeywordCell>
              <TagCell>
                {store.store_tags?.map((tag, index) => (
                  <div key={`tag-group-${tag.id}-${index}`}>
                    {tag.industry_types?.name && (
                      <TypeTag
                        key={`industry-${tag.id}-${index}`}
                        style={{ backgroundColor: '#e3f2fd' }}
                      >
                        {tag.industry_types.name}
                      </TypeTag>
                    )}
                    {tag.capacity_types?.name && (
                      <TypeTag
                        key={`capacity-${tag.id}-${index}`}
                        style={{ backgroundColor: '#e8f5e9' }}
                      >
                        {tag.capacity_types.name}
                      </TypeTag>
                    )}
                    {tag.material_types?.name && (
                      <TypeTag
                        key={`material-${tag.id}-${index}`}
                        style={{ backgroundColor: '#fff3e0' }}
                      >
                        {tag.material_types.name}
                      </TypeTag>
                    )}
                  </div>
                ))}
              </TagCell>
            </TableRow>
          ))}
        </tbody>
      </StoreTable>
    </TableWrapper>
  );
};

export default StoreList;
