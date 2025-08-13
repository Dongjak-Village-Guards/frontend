import styled from 'styled-components';
import { AiOutlineLeft } from 'react-icons/ai';
import LikeButton from '../home/shop/LikeButton';

const TopNavBar = ({
  onBack,
  title,
  showLike = false,
  storeId,
  isLiked
}) => (
  <FixedHeader>
    <TopSpacer />
    <NavBar>
      <NavButtonArea onClick={onBack}>
        <AiOutlineLeft className='back-button' size={16} />
        <NavTitle>{title}</NavTitle>
      </NavButtonArea>
      {showLike && <LikeButton storeId={storeId} isLiked={isLiked} />}
    </NavBar>
  </FixedHeader>
);

export default TopNavBar;

// ===== Styled Components ===== //

const FixedHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  background: #fff;
`;

const TopSpacer = styled.div`
  height: 44px;
  background: #fff;
`;

const NavBar = styled.div`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`;

const NavButtonArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  height: 40px;
  transition: color 0.2s;

  .back-button {
    color: #000;
    transition: color 0.2s;
    vertical-align: middle;
  }
  &:hover .back-button {
    color: #DA2538;
  }
  &:hover h1 {
    color: #DA2538;
  }
`;

const NavTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: #000;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  line-height: 1;
`;