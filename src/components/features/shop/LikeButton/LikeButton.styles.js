import styled from "styled-components";

/* 좋아요 버튼
(하트 아이콘을 사용하여 좋아요 상태를 표시함.)
(호버 시 확대 효과가 적용됨) */
export const CardLike = styled.button`
  border: none;
  background: none;
  padding: 0;
  cursor: ${props => props.$isLoading ? 'not-allowed' : 'pointer'};
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  position: relative;
  opacity: ${props => props.$isLoading ? 0.6 : 1};

  &:hover {
    transform: ${props => props.$isLoading ? 'none' : 'scale(1.1)'};
  }

  &:disabled {
    pointer-events: none;
  }
`; 