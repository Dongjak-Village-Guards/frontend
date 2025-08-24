/**
 * 가게 상세 페이지 구현
 * 와이어프레임에 따라 두 가지 case를 처리:
 * 1. hasDesigners=true: 디자이너 목록 표시 후, 디자이너 선택 시 메뉴 표시
 * 2. hasDesigners=false: 바로 메뉴 표시
 * mockShopList.js의 STORES_DATA에서 데이터 동적 로드
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useStore from '../hooks/store/useStore';
import Card from '../components/features/shop/ShopCard/ShopCard';
import Spinner from '../components/ui/Spinner/Spinner';
import FilterContainer from '../components/features/filter/FilterContainer/FilterContainer';
import ScrollContainer from '../components/layout/ScrollContainer';

const FavoritePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    stores, 
    currentTime, 
    setCurrentPage,
    updateCurrentTime,
    filters,
    time,
    setTime,
    setFilters,
    fetchStores,
    checkAndUpdateTimeIfExpired, // 새로 추가
  } = useStore();

  // 컴포넌트 마운트 시 초기 로딩 처리
  useEffect(() => {
    const initializePage = async () => {
      setIsLoading(true);
      
      // 시간 만료 체크 및 자동 업데이트
      checkAndUpdateTimeIfExpired();
      
      console.log("FavoritePage 렌더링함 updateCurrentTime호출됨",updateCurrentTime);
      updateCurrentTime();
      
      // 0.1초 지연으로 렌더링 시간 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsLoading(false);
    };

    initializePage();
  }, [updateCurrentTime, checkAndUpdateTimeIfExpired, currentTime]); // currentTime 의존성 추가

  // 찜한 가게만 필터링
  const favoriteStores = stores.filter(store => store.isLiked);

  // 시간 선택 핸들러
  const handleTimeSelect = async (selectedTime) => {
    console.log('FavoritePage 시간 선택됨:', selectedTime);
    setTime(selectedTime);
    
    try {
      // 현재 설정된 카테고리 필터도 함께 사용
      await fetchStores(selectedTime, filters.categories.length > 0 ? filters.categories[0] : null);
    } catch (error) {
      console.error('FavoritePage 시간 필터 적용 실패:', error);
    }
    
    // 로딩 처리
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // 업종 선택 핸들러
  const handleCategorySelect = async (category) => {
    console.log('FavoritePage 업종 선택됨:', category);
    setFilters({ categories: category ? [category] : [] });
    
    try {
      await fetchStores(time, category);
    } catch (error) {
      console.error('FavoritePage 업종 필터 적용 실패:', error);
    }
    
    // 로딩 처리
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // 가게 카드 클릭 시 상세 페이지로 이동
  const handleCardClick = (storeId) => {
    navigate(`/shop/${storeId}`);
  };

  return (
    <PageContainer>
      {/* 상단 헤더 */}
      <Header>
        <HeaderTitle>찜한 가게</HeaderTitle>
      </Header>

      {/* 필터 영역 */}
      <SubContainer>
        <FilterContainer
            time={time}
            filters={filters}
            onTimeSelect={handleTimeSelect}
            onCategorySelect={handleCategorySelect}
            isLoading={isLoading}
        />
      </SubContainer>

      <ScrollContainer offsettop={128}>
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
      </ScrollContainer>
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
  padding: 16px 0;
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
  color: #000;
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0px 16px 52px 16px;
`;

const StoreList = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 0;
`;

const EmptyText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const EmptySubText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #555;
`;

const SubContainer = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 60px;
  z-index: 15;
  background-color: #fff;
`;