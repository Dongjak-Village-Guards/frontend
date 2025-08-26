import placeholderImage from '../../../../assets/images/placeholder.svg';
import ReservationButton from '../../../ui/ReservationButton/ReservationButton';
import { Card, Div, SpaceImage, Detail, SpaceName, DiscountText, StyledSpan, StatusText, ButtonContainer } from './SpaceCard.styles';

/**
 * Space 목록용 카드 컴포넌트 (기존 DesignerCard 스타일 유지)
 * @param {Object} space - Space 정보
 * @param {number} space.id - Space ID
 * @param {string} space.name - Space 이름
 * @param {string} space.image - Space 이미지 URL
 * @param {number} space.maxDiscountRate - 최대 할인율
 * @param {boolean} space.isPossible - 예약 가능 여부
 * @param {Function} onSelect - Space 선택 시 호출되는 함수
 */
const SpaceCard = ({ space, onSelect }) => {
//  const { startReservation } = useStore();

  // 이미지 처리
  const getImageSrc = (imageUrl) => {
    if (imageUrl && imageUrl !== '') {
      return imageUrl;
    }
    return placeholderImage;
  };

  const handleReserve = (e) => {
    e.stopPropagation();
    onSelect(space.id);
  };

  return (
    <Card>
      <Div>
        <SpaceImage 
          src={getImageSrc(space.image)} 
          alt={space.name}
          onError={(e) => {
            console.warn(`Space 이미지 로드 실패: ${space.id}, using fallback`);
            e.target.src = placeholderImage;
          }}
        />
        <Detail>
          <SpaceName>{space.name}</SpaceName>
          <DiscountText>
            <StyledSpan>최대 할인율</StyledSpan> {space.maxDiscountRate}%
          </DiscountText>
          <StatusText $isPossible={space.isPossible}>
            {space.isPossible ? '예약 가능' : '예약 불가'}
          </StatusText>
        </Detail>
      </Div>
      <ButtonContainer>
        <ReservationButton onClick={handleReserve} disabled={!space.isPossible}>
          {space.isPossible ? "예약하기" : "예약불가"}
        </ReservationButton>
      </ButtonContainer>
    </Card>
  );
};

export default SpaceCard; 