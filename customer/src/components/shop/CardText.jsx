/**
 * 가게 정보 텍스트를 표시하는 컴포넌트
 * 가게 이름, 메뉴, 거리, 가격 정보 담당
 */
import styled from "styled-components";

/**
 * CardText 컴포넌트
 * @param {Object} store - 가게 정보 객체
 * @param {string} store.name - 가게 이름
 * @param {string} store.menu - 메뉴 정보
 * @param {number} store.distance - 거리 (미터)
 * @param {number} store.walkTime - 도보 시간 (분)
 * @param {number} store.originalPrice - 원가
 * @param {number} store.discountPrice - 할인가
 * @param {number} store.discontRate - 할인율
 */
const CardText = ({ store }) => {
  const { name,
          menu, 
          distance, 
          walkTime, 
          originalPrice, 
          discountPrice, 
          discountRate 
        } = store;

  return (
    <StoreInfo>
      <InfoWrapperLeft>
        {/* 제목 6글자까지 표시*/}
        <StoreName>{name.length > 6 ? `${name.slice(0, 6)}...` : name}</StoreName>
        <StoreMeta>
            <MetaDistance>{distance}m </MetaDistance>
            <MetaWorkTime>도보 {walkTime}분</MetaWorkTime>
        </StoreMeta>
      </InfoWrapperLeft>

      <InfoWrapperRight>
        <StoreMenu>{menu}</StoreMenu>
        <StorePrice>
            {discountRate}%
            <span>{originalPrice.toLocaleString()}원</span> {/* CSS 분리할려고 span에 감쌈 */}
        </StorePrice>
        <StoreDiscountPrice>
            {discountPrice.toLocaleString()}원
        </StoreDiscountPrice>
      </InfoWrapperRight>
    </StoreInfo>
  );
};
export default CardText;

// ===== Styled Components ===== //

/* 텍스트 간격 임시 설정을 위한 영역 분리 */
const InfoWrapperLeft = styled.div`
margin-right: 24px;
`;
const InfoWrapperRight = styled.div`
`;

/* 가게 정보 컨테이너
(텍스트 정보들을 담는 flex 컨테이너) */
const StoreInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-shrink: 0;
  // 레이아웃 확인용
  //  border: 1px solid red;
`;

/* 가게 이름 (가장 큰 폰트로 표시되는 가게명) */
const StoreName = styled.div`
  font-family: Pretendard;

  //  긴 text ...으로 대체
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  color: var(--, #000);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 14px; /* 87.5% */
  margin-bottom: 8px;
  white-space: nowrap;
  max-width: 120px;
`;

/* 메뉴 정보
(가게의 주요 메뉴 표시) */
const StoreMenu = styled.div`
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
const StoreDiscountPrice = styled.div`
    color: var(--, #000);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 14px; /* 116.667% */
    margin-top: 5px;
`;

/* 거리 및 도보 시간 정보 담는 컨테이너
(가게까지의 거리 & 예상 도보 시간 표시) */
const StoreMeta = styled.div`
  font-size: 12px;
  color: #888;
  color: var(--, #000);
`;
/* 거리 정보(가게까지의 거리 표시) */
const MetaDistance = styled.span`
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  color: #000;
  line-height: 14px; /* 100% */
  margin-right: 6px;
`;
/* 도보 시간 정보(예상 도보 시간 표시) */
const MetaWorkTime = styled.span`
  color: #6D6D6D;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px; /* 116.667% */
`;

/* 가격 정보 (원가(취소선)와 할인가 표시) */
const StorePrice = styled.div`
  font-size: 12px;
  color: #DA2538;
  font-weight: 600;
  margin-top: 3px;

  // 원가 표시를 위한 CSS
  span {
    text-decoration: line-through;
    color: #888;
    font-weight: 400;
  }
`;
