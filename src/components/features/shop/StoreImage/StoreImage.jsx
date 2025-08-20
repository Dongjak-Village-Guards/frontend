/**
 * 가게 사진 정보를 표시하는 컴포넌트
 * 메인 이미지를 담당함
 */

import chickenImage from "../../../../assets/images/chicken.png";
import pizzaImage from "../../../../assets/images/pizza.png";
import saladImage from "../../../../assets/images/salad.png";
import steakImage from "../../../../assets/images/steak.png";
import koreanImage from "../../../../assets/images/korean.png";
import hairImage from "../../../../assets/images/hair.png";
import placeholderImage from "../../../../assets/images/placeholder.svg";
import {
  CardImageContainer,
  ImageGroup,
  MainCardImage
} from './StoreImage.styles';

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