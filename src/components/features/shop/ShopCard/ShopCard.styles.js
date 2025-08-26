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

  width: 100%;
  height: 216px;

  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid #CCC;
  background: #fff;
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
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
`; 