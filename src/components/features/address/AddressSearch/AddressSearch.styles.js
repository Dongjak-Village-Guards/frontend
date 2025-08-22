import styled from 'styled-components';

export const SearchWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SearchBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 48px;
  border-radius: 16px;
  border: 1px solid #737373;
  margin-bottom: 16px;

  input {
    width: 100%;
    padding: 0;
    margin-left: 16px;
    border: none;
    outline: none;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    color: #000;
  }

  .search-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    margin-right: 16px;
    cursor: pointer;
  }
`;

export const SearchFixArea = styled.div`
  width: 100%;
// 스크롤시 고정역할
  position: sticky;
  background-color: white;
  top: 143px;
`; 