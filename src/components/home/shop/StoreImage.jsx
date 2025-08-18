/**
 * 가게 사진 정보를 표시하는 컴포넌트
 * 메인 이미지를 담당함
 */

import styled from "styled-components";
import chickenImage from "../../../assets/images/chicken.png";
import pizzaImage from "../../../assets/images/pizza.png";
import saladImage from "../../../assets/images/salad.png";
import steakImage from "../../../assets/images/steak.png";
import koreanImage from "../../../assets/images/korean.png";
import hairImage from "../../../assets/images/hair.png";
import placeholderImage from "../../../assets/images/placeholder.svg";

/**
 * StoreCard 컴포넌트
 * @param {Object} store - 가게 정보 객체
 * @param {string} store.id - 가게 ID
 * @param {string} store.name - 가게 이름 (alt 텍스트용)
 */
const StoreCard = ({ store }) => {
  // 가게 ID에 따라 이미지 매핑 (임시)
  const imageMap = {
    1: chickenImage,
    2: pizzaImage,
    3: saladImage,
    4: steakImage,
    5: koreanImage,
    6: hairImage,
    7: hairImage,
  };

  const imageSrc = imageMap[store.id] || placeholderImage;

  return (
    <CardImageContainer>
      <ImageGroup>
        <MainCardImage
          src={imageSrc}
          alt={`${store.name} 메인 이미지`}
          onError={(e) => {
            console.warn(`이미지 로드 실패: ${store.id}, using fallback`);
            e.target.src = placeholderImage;
          }}
        />
      </ImageGroup>
    </CardImageContainer>
  );
};
export default StoreCard;

// ===== Styled Components ===== //

/* 카드 이미지 컨테이너
(메인 이미지를 담는 flex 컨테이너) */
const CardImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: clamp(120px, 35vh, 148px);
  flex-shrink: 0;
`;

/* 이미지 그룹 컨테이너
(메인 이미지와 썸네일을 하나의 그룹으로 묶음) */
const ImageGroup = styled.div`
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
const MainCardImage = styled.img`
  /* 반응형 웹 수정: 고정 크기 대신 반응형 크기 사용 */
  width: 100%;
  height: clamp(120px, 35vh, 148px);
  object-fit: cover;
  flex-shrink: 0;
`;