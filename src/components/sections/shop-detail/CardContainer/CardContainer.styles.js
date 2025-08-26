import styled from 'styled-components';

/**
 * 공통 카드 컨테이너 스타일
 * SpaceCard와 DesignerCard에서 공통으로 사용
 */
export const CardContainer = styled.div`
  display: flex;
  padding: 16px;
  border: 1px solid #e2e4e9;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fff;
  
  &:hover {
    border-color: #DA2538;
    box-shadow: 0 2px 8px rgba(218, 37, 56, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;