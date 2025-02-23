'use client';
import styled from '@emotion/styled';

const StoreListWrapper = styled.div`
  width: 100%;
  padding: 20px 0;
`;

const StoreCard = styled.div`
  padding: 20px;
  border: 1px solid ${(props) => props.theme.color.border};
  border-radius: 8px;
  margin-bottom: 16px;
  background-color: white;
`;

const StoreName = styled.h3`
  font-size: ${(props) => props.theme.fontSize.lg};
  font-weight: bold;
  margin-bottom: 8px;
`;

const StoreAddress = styled.p`
  color: ${(props) => props.theme.color.textSecondary};
  margin-bottom: 12px;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const Tag = styled.span`
  border-radius: 16px;
  font-size: ${(props) => props.theme.fontSize.sm};
`;

const ContactInfo = styled.p`
  font-size: ${(props) => props.theme.fontSize.sm};
`;

const StoreList = ({ stores }) => {
  return (
    <StoreListWrapper>
      {stores.map((store) => (
        <StoreCard key={store.id}>
          <StoreName>{store.name}</StoreName>
          <StoreAddress>{store.address}</StoreAddress>
          <TagList>
            {store.store_tags?.map((tag, index) => (
              <div key={`tag-${tag.id}-${index}`}>
                {tag.industry_types?.name && (
                  <div
                    key={`industry-${tag.id}-${tag.industry_types.name}-${index}`}
                  >
                    {tag.industry_types.name}
                  </div>
                )}
                {tag.capacity_types?.name && (
                  <div
                    key={`capacity-${tag.id}-${tag.capacity_types.name}-${index}`}
                  >
                    {tag.capacity_types.name}
                  </div>
                )}
                {tag.material_types?.name && (
                  <div
                    key={`material-${tag.id}-${tag.material_types.name}-${index}`}
                  >
                    {tag.material_types.name}
                  </div>
                )}
              </div>
            ))}
          </TagList>
          {store.store_contacts?.[0]?.phone && (
            <ContactInfo>연락처: {store.store_contacts[0].phone}</ContactInfo>
          )}
        </StoreCard>
      ))}
    </StoreListWrapper>
  );
};

export default StoreList;
