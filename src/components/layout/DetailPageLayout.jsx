/**
 * 상세 페이지 공통 레이아웃 컴포넌트
 * 모든 store 상세 페이지에서 공통으로 사용하는 레이아웃
 */

import React from 'react';
import styled from 'styled-components';
import Layout from './Layout';
import TopNavBar from './TopNavBar/TopNavBar';
import useStore from '../../hooks/store/useStore';

const DetailPageLayout = ({ 
  children, 
  shopId, 
  title, 
  showLike = true, 
  onBack 
}) => {
  // 기존 useStore에서 좋아요 상태 가져오기
  const { stores, toggleLikeWithAPI } = useStore();
  
  // 현재 가게의 좋아요 상태 가져오기
  const currentStore = stores.find(store => store.id === parseInt(shopId));
  const isLiked = currentStore?.isLiked || false;
  
  // 좋아요 토글 처리
  const handleLikeToggle = async () => {
    await toggleLikeWithAPI(parseInt(shopId));
  };

  return (
    <Layout currentPage="shop-detail">
      <PageContainer>
        <TopNavBar
          onBack={onBack}
          title={title}
          showLike={showLike}
          storeId={parseInt(shopId)}
          isLiked={isLiked}
          onLikeToggle={handleLikeToggle}
        />
        <ContentContainer>
          {children}
        </ContentContainer>
      </PageContainer>
    </Layout>
  );
};

export default DetailPageLayout;

// ===== Styled Components ===== //

/* 페이지 전체 컨테이너 */
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
`;

/* 콘텐츠 영역 (스크롤 가능) */
const ContentContainer = styled.div`
  flex: 1;
`; 