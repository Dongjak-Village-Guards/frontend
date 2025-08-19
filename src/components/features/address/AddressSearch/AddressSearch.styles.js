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

export const NoResult = styled.div`
  position: relative;
  top: 108px;
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
`;

export const ResultContainer = styled.ul`
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const ResultItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-bottom: 1px solid #ccc;

  color: #000;
  font-variant-numeric: lining-nums tabular-nums;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  padding: 10px 16px;
  box-sizing: border-box;
  min-height: 50px;
  white-space: normal;
  word-break: break-word;

  user-select: none;
  cursor: pointer;
`;

export const SearchFixArea = styled.div`
  width: 100%;
// 스크롤시 고정역할
  position: sticky;
  background-color: white;
  top: 143px;
`; 