import styled from "styled-components";

/* 텍스트 간격 임시 설정을 위한 영역 분리 */
export const InfoWrapperLeft = styled.div`
  margin-right: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const InfoWrapperRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

/* 가게 정보 컨테이너
(텍스트 정보들을 담는 flex 컨테이너) */
export const StoreInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-shrink: 0;
  // 레이아웃 확인용
  //  border: 1px solid red;
`;

/* 가게 이름 (가장 큰 폰트로 표시되는 가게명) */
export const StoreName = styled.div`
  //  긴 text ...으로 대체
  white-space: nowrap;
  text-overflow: ellipsis;

  color: var(--, #000);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
  margin-bottom: 12px;
  white-space: nowrap;
  max-width: 120px;
`;

/* 메뉴 정보
(가게의 주요 메뉴 표시) */
export const StoreMenu = styled.div`
  font-size: 14px;
  color: var(--, #000);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-style: normal;
  font-weight: 600;
  line-height: 14px; /* 100% */
  max-width: 120px;
`;

/* 할인된 가격(우측 아래 최종 지불 가격) */
export const StoreDiscountPrice = styled.div`
    color: var(--, #000);
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 14px; /* 116.667% */
    margin-top: 3px;
`;

/* 거리 및 도보 시간 정보 담는 컨테이너
(가게까지의 거리 & 예상 도보 시간 표시) */
export const StoreMeta = styled.div`
  font-size: 12px;
  color: #888;
  color: var(--, #000);
`;

/* 거리 정보(가게까지의 거리 표시) */
export const MetaDistance = styled.span`
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  color: #000;
  line-height: 14px; /* 100% */
  margin-right: 6px;
`;

/* 도보 시간 정보(예상 도보 시간 표시) */
export const MetaWalkTime = styled.span`
  color: #6D6D6D;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px; /* 116.667% */
`;

/* 가격 정보 (원가(취소선)와 할인가 표시) */
export const StorePrice = styled.div`
  font-size: 12px;
  color: #DA2538;
  font-weight: 600;
  margin-top: 3px;

  // 원가 표시를 위한 CSS
  span {
    text-decoration: line-through;
    color: #888;
    font-weight: 400;
    padding-left: 2px;
  }
`; 