/**
 * 가게 상세 페이지 구현
 * 와이어프레임에 따라 두 가지 case를 처리:
 * 1. hasDesigners=true: 디자이너 목록 표시 후, 디자이너 선택 시 메뉴 표시
 * 2. hasDesigners=false: 바로 메뉴 표시
 * mockShopList.js의 STORES_DATA에서 데이터 동적 로드
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useStore from '../hooks/store/useStore';
import Card from '../components/home/shop/Card';
import Spinner from '../components/common/Spinner';
import TimeToggle from '../components/filter/TimeToggle';
import CategoryToggle from '../components/filter/CategoryToggle';
import { getNearestHour } from '../components/filter/TimeFilter';
import { useNavigate } from 'react-router-dom';

const FavoritePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    stores, 
    currentTime, 
    setCurrentPage,
    updateCurrentTime,
    filters,
    time
  } = useStore();

  // 컴포넌트 마운트 시 초기 로딩 처리
  useEffect(() => {
    const initializePage = async () => {
      setIsLoading(true);
      console.log("FavoritePage 렌더링함 updateCurrentTime호출됨",updateCurrentTime);
      updateCurrentTime();
      
      // 0.1초 지연으로 렌더링 시간 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsLoading(false);
    };

    initializePage();
  }, [updateCurrentTime]);

  // 찜한 가게만 필터링
  const favoriteStores = stores.filter(store => store.isLiked);

  // 업종 필터 라벨 생성
  const getCategoryLabel = () => {
    if (filters.categories.length === 0) return '업종';
    if (filters.categories.length === 1) {
      const categoryMap = { hair: '미용실', nail: '네일샵', pilates: '필라테스' };
      return categoryMap[filters.categories[0]] || '업종';
    }
    const categoryMap = { hair: '미용실', nail: '네일샵', pilates: '필라테스' };
    const firstCategory = categoryMap[filters.categories[0]] || '업종';
    const remainingCount = filters.categories.length - 1;
    return `${firstCategory} 외 ${remainingCount}종`;
  };

  // 가게 카드 클릭 시 상세 페이지로 이동
//  const handleCardClick = (storeId) => {
//    setCurrentPage(`shop-detail-${storeId}`);
//  };
  const navigate = useNavigate();
  const handleCardClick = (storeId) => navigate(`/shop/${storeId}`);

  return (
    <PageContainer>
      {/* 상단 헤더 */}
      <Header>
        <HeaderTitle>찜한 가게</HeaderTitle>
      </Header>

      {/* 필터 영역 */}
      <FilterRow>
        <TimeToggle
          label={time || getNearestHour(currentTime)}
          onClick={() => !isLoading && console.log('시간 필터 클릭')}
        />

        <CategoryToggle
          label={getCategoryLabel()}
          active={filters.categories.length > 0}
          onClick={() => !isLoading && console.log('업종 필터 클릭')} 
        />
      </FilterRow>

      {/* 찜한 가게 목록 */}
      <ContentContainer>
        {isLoading ? (
          <LoadingContainer>
            <Spinner />
          </LoadingContainer>
        ) : favoriteStores.length > 0 ? (
          <StoreList>
            {favoriteStores.map(store => (
              <Card 
                key={store.id} 
                store={store} 
                onClick={() => handleCardClick(store.id)}
              />
            ))}
          </StoreList>
        ) : (
          <EmptyState>
            <EmptyText>찜한 가게가 없어요</EmptyText>
            <EmptySubText>마음에 드는 가게를 찜해보세요!</EmptySubText>
          </EmptyState>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default FavoritePage;

// ===== Styled Components ===== //

const PageContainer = styled.div`
  padding-top: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: Pretendard;
  padding: 0 16px;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  padding: 52px 0 16px 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  z-index: 10;
  border-bottom: 2px solid #DA2538;
`;

const HeaderTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  line-height: 14px;
  color: #000;
`;

const FilterRow = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 84px;
  z-index: 15;
  padding: clamp(8px, 2vh, 16px) 0;
  display: flex;
  align-items: center;
  gap: clamp(6px, 2vw, 10px);
  background: #fff;
  transition: all 0.3s ease;
  width: 100%;
  transform: translateZ(0);
  will-change: transform;
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const StoreList = styled.div`
  background: #fff;
  width: 100%;
  overflow-x: hidden;
`;

const LoadingContainer = styled.div`
  height: 100%;
  overflow-y: hidden;
  position: relative;
  top: 1rem;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
`;

const EmptyText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
`;

const EmptySubText = styled.div`
  font-size: 14px;
  color: #999;
`;