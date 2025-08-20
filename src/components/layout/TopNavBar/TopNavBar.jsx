import { AiOutlineLeft } from 'react-icons/ai';
import LikeButton from '../../features/shop/LikeButton/LikeButton';
import {
  FixedHeader,
  TopSpacer,
  NavBar,
  NavButtonArea,
  NavTitle
} from './TopNavBar.styles';

const TopNavBar = ({
  onBack,
  title,
  showLike = false,
  storeId,
  isLiked,
  onLikeToggle
}) => (
  <FixedHeader>
    <TopSpacer />
    <NavBar>
      <NavButtonArea onClick={onBack}>
        <AiOutlineLeft className='back-button' size={16} />
        <NavTitle>{title}</NavTitle>
      </NavButtonArea>
      {showLike && <LikeButton storeId={storeId} isLiked={isLiked} onLikeToggle={onLikeToggle} />}
    </NavBar>
  </FixedHeader>
);

export default TopNavBar; 