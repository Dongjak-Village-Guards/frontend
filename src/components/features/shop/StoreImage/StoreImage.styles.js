import styled from "styled-components";

/* 카드 이미지 컨테이너
(메인 이미지를 담는 flex 컨테이너) */
export const CardImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: clamp(120px, 35vh, 148px);
  flex-shrink: 0;
`;

/* 이미지 그룹 컨테이너
(메인 이미지와 썸네일을 하나의 그룹으로 묶음) */
export const ImageGroup = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  
  /* 반응형 웹 수정: 모바일에서 간격 조정 */
  @media (max-width: 480px) {
    gap: clamp(6px, 2vw, 8px);
  }

  width: 100%;
  height: 100%;
`;

/* 메인 카드 이미지
(328x148 크기의 메인 이미지 영역)
*/
export const MainCardImage = styled.img`
  /* 반응형 웹 수정: 고정 크기 대신 반응형 크기 사용 */
  width: 100%;
  height: clamp(120px, 35vh, 148px);
  object-fit: cover;
  flex-shrink: 0;
`; 