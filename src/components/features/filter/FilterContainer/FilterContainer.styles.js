import styled from 'styled-components';

/* 필터 라인 영역 */
export const FilterRow = styled.div`
  padding: 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  /* sticky 포지션이 확실히 작동하도록 추가 설정 */
  transform: translateZ(0);
  will-change: transform;
`; 