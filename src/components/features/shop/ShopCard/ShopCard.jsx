/**  
 * 가게 카드의 전체 구조를 담당하는 컴포넌트
 * 할인 배지, 이미지, 텍스트 정보, 좋아요 버튼 통합 
 * 카드 클릭 시 상세 페이지(/shop/:id)로 이동
 */

import CardText from "../CardText/CardText";
import DiscountBadge from "../DiscountBadge/DiscountBadge";
import LikeButton from "../LikeButton/LikeButton";
import StoreCard from "../StoreImage/StoreImage";
import {
  CardContainer,
  CardHeader,
  CardFooter
} from './ShopCard.styles';

/**
 * ShopCard 컴포넌트
 * @param {Object} store - 가게 정보 객체
 * @param {number} store.id - 가게 ID
 * @param {string} store.name - 가게 이름
 * @param {string} store.menu - 최대 할인율 메뉴 이름
 * @param {number} store.distance - 거리 (미터)
 * @param {number} store.walkTime - 도보 시간 (분)
 * @param {Object[]} store.menus - 메뉴 목록
 * @param {boolean} store.isLiked - 좋아요 상태
 * @param {Function} onClick - 카드 클릭 시 호출되는 함수
 */

const ShopCard = ({ store, onClick }) => {
  const { id, isLiked } = store;
  // 최대 할인율 계산 (디자이너 유무에 따라 다르게 처리)
  const discountRate = store.hasDesigners
    ? Math.max(...store.designers.flatMap(designer => designer.menus.map(menu => menu.discountRate)))
    : Math.max(...store.menus.map(menu => menu.discountRate));

  return (
    <CardContainer onClick={onClick}>
      <CardHeader>
        <DiscountBadge discountRate={discountRate} />
        <StoreCard store={store} />
      </CardHeader>

      <CardFooter>
        <CardText store={store} />
        <LikeButton storeId={id} isLiked={isLiked} />
      </CardFooter>
    </CardContainer>
  );
};
export default ShopCard; 