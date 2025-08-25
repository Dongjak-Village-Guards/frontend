/**  
 * 할인율 배지를 표시하는 컴포넌트
 * 가게 카드의 좌상단에 표시되는 할인율 정보를 표시함. 
 */

import { DiscountTag } from './DiscountBadge.styles';

/**
 * DiscountBadge 컴포넌트
 * @param {number} discountRate - 할인율 (퍼센트)
 */
const DiscountBadge = ({ discountRate }) => {
  return (
    <DiscountTag>
      최대 {discountRate}%
    </DiscountTag>
  );
};
export default DiscountBadge; 