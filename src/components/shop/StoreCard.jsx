/**
 * 가게 사진 정보를 표시하는 컴포넌트
 * 메인 이미지와 썸네일 이미지들을 담당함.
 */
import styled from "styled-components";
import chickenImage from "../../assets/images/cardImage.png";

/**
 * StoreCard 컴포넌트
 * @param {Object} store - 가게 정보 객체 (현재는 사용하지 않음)
 */
const StoreCard = ({ store }) => {
  return (
    <CardImageContainer>
      <ImageGroup>
        <MainCardImage src={chickenImage} alt="치킨 메인 이미지" />
        <ThumbnailContainer>
          <CardImage src={chickenImage} alt="치킨 썸네일 1" />
          <CardImage src={chickenImage} alt="치킨 썸네일 2" />
        </ThumbnailContainer>
      </ImageGroup>
    </CardImageContainer>
  );
};
export default StoreCard;

// ===== Styled Components ===== //

/* 카드 이미지 컨테이너
(메인 이미지와 썸네일들을 담는 flex 컨테이너) */
const CardImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* 반응형 웹 수정: 고정 높이 대신 반응형 높이 사용 */
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
  /* 반응형 웹 수정: 전체 이미지 그룹의 최대 너비 제한 */
//  max-width: clamp(230px, 75vw, 320px);
  
  /* 반응형 웹 수정: 모바일에서 간격 조정 */
  @media (max-width: 480px) {
    gap: clamp(6px, 2vw, 8px);
  }

  width: 100%;
  height: 100%;
  //  border: 1px solid red; // Test용
`;

/* 메인 카드 이미지
(248x148 크기의 메인 이미지 영역)
*/
const MainCardImage = styled.img`
  /* 반응형 웹 수정: 고정 크기 대신 반응형 크기 사용 */
  width: clamp(180px, 60vw, 248px);
  height: clamp(120px, 35vh, 148px);
  object-fit: cover;
  flex-shrink: 0;
`;

/* 카드 이미지
(썸네일용 크기의 이미지) */
const CardImage = styled.img`
  /* 반응형 웹 수정: 고정 크기 대신 반응형 크기 사용 */
    width: clamp(50px, 15vw, 72px);
//  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: space-between;
//  height: clamp(50px, 15vw, 72px);
  object-fit: cover;
  flex-shrink: 0;
  aspect-ratio: 1/1;
`;

/* 썸네일 이미지 컨테이너
(두 개의 썸네일 이미지를 세로로 배치함) */
const ThumbnailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  
  /* 반응형 웹 수정: 모바일에서 간격 조정 */
  @media (max-width: 480px) {
    gap: clamp(6px, 2vw, 8px);
  }
`;