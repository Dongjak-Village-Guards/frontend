import styled from "styled-components";

/**
 * 카드 컨테이너
 * 가게 카드의 전체 레이아웃을 담당합니다.
 * 할인 배지, 이미지, 텍스트, 좋아요 버튼을 포함합니다.
 */
export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;

  /* 반응형 웹 수정: 고정 너비 제거하고 유동적 너비 사용 */
  width: 100%;

  /* 반응형 웹 수정: 고정 높이 대신 반응형 높이 사용 */
  height: clamp(180px, 50vh, 216px);

  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid #CCC;
  background: #fff;
  position: relative;
  overflow: hidden;
  /* 반응형 웹 수정: 반응형 마진 사용 */
  margin-bottom: clamp(12px, 3vh, 16px);
  
  /* 반응형 웹 수정: 모바일에서 간격 조정 */
  @media (max-width: 480px) {
    gap: clamp(6px, 2vw, 8px);
  }
`;

export const CardHeader = styled.div`
  width: 100%;
`;

export const CardFooter = styled.div`
    width: 100%;
    height: 100% - 148px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    /* 반응형 웹 수정: 반응형 패딩 사용 */
    padding: 0px clamp(12px, 4vw, 16.5px);

    // 레이아웃 확인용
    //border: 1px solid blue;
`; 