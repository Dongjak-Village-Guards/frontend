/**
 * 좋아요 버튼 컴포넌트
 * 가게 카드의 우하단에 위치하며, 좋아요 상태를 토글함.
 */

import styled from "styled-components";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import useStore from "../../../hooks/store/useStore";
import useUserInfo from "../../../hooks/user/useUserInfo";

/**
 * LikeButton 컴포넌트
 * @param {number} storeId - 가게 ID
 * @param {boolean} isLiked - 현재 좋아요 상태
 * @param {Function} onLikeToggle - 좋아요 토글 콜백 함수 (선택사항)
 */

const LikeButton = ({ storeId, isLiked, onLikeToggle }) => {
  // Zustand 스토어에서 좋아요 토글 함수와 로딩 상태 가져오기
  const { toggleLikeWithAPI, likeLoading, setCurrentPage } = useStore();
  const { accessToken } = useUserInfo();

  /* 좋아요 토글 handler 함수(클릭 시 해당 가게의 좋아요 상태 변경함) */
  const handleLikeToggle = async (e) => {
    // 이벤트 버블링 방지
    // Card 컴포넌트에서 CardContainer에 onClick을 걸어놔서 LikeButton 클릭 시에도 이 이벤트가 버블링되어 onClick이 같이 실행되는 문제 해결하고자 사용
    // 좋아요 버튼을 클릭해도 부모(Card)의 onClick이 실행되지 않아 상세페이지로 넘어가지 않음
    e.stopPropagation();

    // 로딩 중이면 클릭 무시
    if (likeLoading) {
      return;
    }

    // 로그인되지 않은 경우 로그인 페이지로 이동
    if (!accessToken) {
      setCurrentPage('login');
      return;
    }

    // 커스텀 토글 함수가 있으면 사용, 없으면 기본 함수 사용
    if (onLikeToggle) {
      await onLikeToggle();
    } else {
      // API 호출과 함께 찜 토글
      await toggleLikeWithAPI(storeId);
    }
  };

  return (
    <CardLike 
      onClick={handleLikeToggle}
      disabled={likeLoading}
      $isLoading={likeLoading}
    >
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
  cursor: ${props => props.$isLoading ? 'not-allowed' : 'pointer'};
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  position: relative;
  opacity: ${props => props.$isLoading ? 0.6 : 1};

  &:hover {
    transform: ${props => props.$isLoading ? 'none' : 'scale(1.1)'};
  }

  &:disabled {
    pointer-events: none;
  }
`;
