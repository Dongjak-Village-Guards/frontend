/**
 * 좋아요 버튼 컴포넌트
 * 가게 카드의 우하단에 위치하며, 좋아요 상태를 토글함.
 */
import styled from "styled-components";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import useStore from "../../hooks/store/useStore";

/**
 * LikeButton 컴포넌트
 * @param {number} storeId - 가게 ID
 * @param {boolean} isLiked - 현재 좋아요 상태
 */
const LikeButton = ({ storeId, isLiked }) => {
  // Zustand 스토어에서 좋아요 토글 함수 가져오기
  const { toggleLike } = useStore();

  /* 좋아요 토글 handler 함수(클릭 시 해당 가게의 좋아요 상태 변경함) */
  const handleLikeToggle = () => {
    toggleLike(storeId);
  };

  return (
    <CardLike onClick={handleLikeToggle}>
      {isLiked ? (
        <AiFillHeart size={24} color="#FF001B" />
      ) : (
        <AiOutlineHeart size={24} color="#000" />
      )}
    </CardLike>
  );
};
export default LikeButton;

// ===== Styled Components ===== //

/* 좋아요 버튼
(하트 아이콘을 사용하여 좋아요 상태를 표시함.)
(호버 시 확대 효과가 적용됨) */
const CardLike = styled.button`
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  position: relative;

  &:hover {
    transform: scale(1.1);
  }
`;
