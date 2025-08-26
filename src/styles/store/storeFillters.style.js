import styled from '@emotion/styled';
import theme from '@/styles/Theme';

export const FilterWrapper = styled.aside`
  width: 100vw;
  background-color: #FAF8DB;
  padding: 13px 6px 12px 10px;
  border-top: 1.6px solid #363315;
  display: flex;
  height: 100%;

  ${theme.media.mobile} {
    position: absolute;
    height: 100dvh;
    top: 25px;
    left: -2px;
    width: 100dvw;
    z-index: 3;
    flex-direction: column;
    padding: 15px 10px;
  }
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: flex-start;
  flex-direction: column;

  ${theme.media.mobile} {
    border-bottom: 0.4px solid rgba(0,0,0,0.4);
    padding: 11px 8px;
    flex-direction: row;
    width: 100%;
  }
`;

export const TagsSortingContainer = styled(TagsContainer)`
  display: flex;
  align-items: flex-start;
  justify-contents: left;

  ${theme.media.mobile} {
    padding-top: 0px;
    column-gap: 0px;
  }
`;

export const TagsIndustryContainer = styled(TagsContainer)`
  width: 123px;
  margin-left: 23px;

  ${theme.media.mobile} {
    margin-left: 0;
    
  }
`
export const TagsMaterialContainer = styled(TagsContainer)`
  width: 200px;
  margin-right: 200px;
  flex-direction: row;
  align-content: flex-start;
  row-gap: 6px;
  column-gap: 4px;

  ${theme.media.mobile} {

  }
`

export const Tag = styled.button`
  border:none;
  background: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  font-size: 1.1rem;
  font-family: var(--font-gothic);
  font-weight: 800;
  transition: all 0.2s;
  color: ${(props) => (props.active ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.3)')};
  padding: 0px;
  margin: 0px;
  transform: scaleX(0.8);
  transform-origin: left;

  &:hover{
    color: black;
  }
`;

export const TagTxt = styled.div`

`
