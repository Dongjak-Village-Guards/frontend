import styled from 'styled-components';

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
  max-height: 320px;
  overflow-y: auto;
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