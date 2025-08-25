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
  // 스크롤 시 고정 역할
  position: sticky;
  background-color: white;
`;

export const ResultAreaWrapper = styled.div`
  width: 100%;
  min-height: 420px; // 결과 + 페이지네이션 예상 높이
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${props => props.center ? 'center' : 'flex-start'};
`;

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-top: 22px;
`;

export const PageButton = styled.button`
  background: none;
  border: none;
  color: ${({ active }) => (active ? '#da2538' : '#000')};
  text-decoration: ${({ active }) => (active ? 'underline' : 'none')};
  font-size: 16px;
  font-weight: 400;
  cursor: ${({ disabled, isCaret }) => (disabled && isCaret ? 'default' : 'pointer')};
  padding: 0;
  width: 28px;
  height: 28px;

  &:hover {
    text-decoration: underline;
  }
`;

export const PageNumSpan = styled.span`
  font-size: 16px;
  font-weight: inherit;
  color: inherit;
  display: inline-block;
  height: 19px;
  vertical-align: middle;
`;

export const PageInfo = styled.span`
  font-size: 14px;
  color: #333;
`;