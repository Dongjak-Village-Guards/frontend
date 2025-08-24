/**
 * 가게 사진 정보를 표시하는 컴포넌트
 * 메인 이미지를 담당함
 */

import placeholderImage from "../../../../assets/images/placeholder.svg";
import {
  CardImageContainer,
  ImageGroup,
  MainCardImage
} from './StoreImage.styles';

/**
 * StoreImage 컴포넌트
 * @param {Object} store - 가게 정보 객체
 * @param {string} store.id - 가게 ID
 * @param {string} store.name - 가게 이름 (alt 텍스트용)
 */
const StoreImage = ({ storeSrc, storeName, storeId }) => {
  return (
    <CardImageContainer>
      <ImageGroup>
        <MainCardImage
          src={storeSrc}
          alt={`${storeName} 메인 이미지`}
          onError={(e) => {
            console.warn(`이미지 로드 실패: ${storeId}, using fallback`);
            e.target.src = placeholderImage;
          }}
        />
      </ImageGroup>
    </CardImageContainer>
  );
};
export default StoreImage; 