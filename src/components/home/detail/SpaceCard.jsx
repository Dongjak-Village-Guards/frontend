import styled from 'styled-components';
import placeholderImage from '../../../assets/images/placeholder.svg';
import useStore from '../../../hooks/store/useStore';
import ReservationButton from '../../ui/ReservationButton';

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

// ===== Styled Components ===== //

/* Space 카드 컨테이너 (기존 DesignerCard와 동일한 스타일) */
const Card = styled.div`
    background: #fff;
    border-radius: 16px;
    border: 1px solid #CCC;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
`;

const Div = styled.div`
    display: flex;
    align-items: center;
`;

/* Space 이미지 (기존 DesignerCard와 동일한 스타일) */
const SpaceImage = styled.img`
  width: 68px;
  height: 68px;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 10px;
  margin: 16px;
`;

const Detail = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

/* Space 이름 (기존 DesignerCard와 동일한 스타일) */
const SpaceName = styled.h3`
    font-size: 14px;
    font-weight: 600;
    line-height: 14px;
    color: #000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

/* 최대 할인율 텍스트 (기존 DesignerCard와 동일한 스타일) */
const DiscountText = styled.p`
    font-size: 14px;
    color: #da2538;
    font-weight: 600;
    line-height: 14px;
`;

const StyledSpan = styled.span`
    color: #000;
    font-size: 14px;
    line-height: 14px;
    font-weight: 500;
`;

/* 예약 가능 여부 텍스트 */
const StatusText = styled.span`
    font-size: 12px;
    color: ${props => props.$isPossible ? '#4CAF50' : '#999'};
    font-weight: 500;
    line-height: 14px;
`;

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 16px;
`; 