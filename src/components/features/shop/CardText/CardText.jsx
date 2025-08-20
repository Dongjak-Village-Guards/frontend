/**
 * 가게 정보 텍스트를 표시하는 컴포넌트
 * 가게 이름, 메뉴, 거리, 가격 정보 담당
 */

import {
  StoreInfo,
  InfoWrapperLeft,
  InfoWrapperRight,
  StoreName,
  StoreMeta,
  MetaDistance,
  MetaWorkTime,
  StoreMenu,
  StorePrice,
  StoreDiscountPrice
} from './CardText.styles';

/**
 * CardText 컴포넌트
 * @param {Object} store - 가게 정보 객체
 * @param {string} store.name - 가게 이름
 * @param {string} store.menu - 메뉴 정보
 * @param {number} store.distance - 거리 (미터)
 * @param {number} store.walkTime - 도보 시간 (분)
 * @param {Object[]} store.menus - 메뉴 목록
 * @param {Object[]} store.designers - 디자이너 목록
 * @param {boolean} store.hasDesigners - 디자이너 유무
 */

const CardText = ({ store }) => {
  const { name, distance, walkTime } = store;
  
  // 최대 할인율 메뉴 선택
  const featuredMenu = (() => {
    // 디자이너가 있는 경우
    if (store.hasDesigners && store.designers?.length > 0) {
      const allMenus = store.designers.flatMap(designer => designer.menus || []);
      if (allMenus.length === 0) {
        return { discountRate: 0, originalPrice: 0, discountPrice: 0, name: '메뉴 없음' };
      }
      return allMenus.reduce(
        (prev, curr) => (prev.discountRate > curr.discountRate ? prev : curr),
        { discountRate: 0, originalPrice: 0, discountPrice: 0, name: '메뉴 없음' }
      );
    }
    // 디자이너가 없는 경우
    if (!store.menus || store.menus.length === 0) {
      return { discountRate: 0, originalPrice: 0, discountPrice: 0, name: '메뉴 없음' };
    }
    return store.menus.reduce(
      (prev, curr) => (prev.discountRate > curr.discountRate ? prev : curr),
      { discountRate: 0, originalPrice: 0, discountPrice: 0, name: '메뉴 없음' }
    );
  })();

  return (
    <StoreInfo>
      <InfoWrapperLeft>
        {/* 제목 6글자까지 표시 */}
        <StoreName>{name.length > 6 ? `${name.slice(0, 6)}...` : name}</StoreName>
        <StoreMeta>
            <MetaDistance>{distance}m </MetaDistance>
            <MetaWorkTime>도보 {walkTime}분</MetaWorkTime>
        </StoreMeta>
      </InfoWrapperLeft>

      <InfoWrapperRight>
        <StoreMenu>{store.menu}</StoreMenu>
        <StorePrice>
            {featuredMenu.discountRate}%
            <span>{featuredMenu.originalPrice.toLocaleString()}원</span> {/* CSS 분리할려고 span에 감쌈 */}
        </StorePrice>
        <StoreDiscountPrice>
            {featuredMenu.discountPrice.toLocaleString()}원
        </StoreDiscountPrice>
      </InfoWrapperRight>
    </StoreInfo>
  );
};
export default CardText; 