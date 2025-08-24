/**
 * 메인 페이지(HomePage) 컴포넌트
 * 주소 표시, 배너, 필터, 가게 목록 표시
 * 정렬, 시간, 업종 필터 적용 가능
 * SORT_OPTIONS를 사용하여 모든 정렬 옵션 표시
 * 가게 카드 클릭 시 상세 페이지(/shop/:id)로 이동
 */

import { useEffect, useState } from "react";
import styled from "styled-components";
import { FiChevronDown } from "react-icons/fi";
import { AiFillCaretDown } from "react-icons/ai";
import FilterContainer from "../components/features/filter/FilterContainer/FilterContainer";
import Spinner from "../components/ui/Spinner/Spinner";
import useStore from "../hooks/store/useStore";
import useUserInfo from "../hooks/user/useUserInfo";
import Card from "../components/features/shop/ShopCard/ShopCard";
import bannerImage from "../assets/images/bannerImage.png";
import { useNavigate } from "react-router-dom";
import { CATEGORY_OPTIONS } from "../components/features/filter/CategoryFilter/CategoryFilter";

export default function HomePage() {
  const navigate = useNavigate();
  /** @state 토글 상태 */
  const [isSortOpen, setIsSortOpen] = useState(false);

  /** @state 로딩 상태 */
  const [isLoading, setIsLoading] = useState(false);
  
  // 로딩 상태 변경
  const setLoading = (loading) => setIsLoading(loading);
  
  /* Zustand 상태 */
  const { 
    currentAddress, 
    currentTime, 
    updateCurrentTime, 
    sortOption, 
    setSortOption, 
    getSortedStores,
    filters,
    setFilters,
    setCurrentPage,
    setFromHomePage,
    fetchStores, // Zustand 스토어 액션 (API 함수 아님)
    fetchUserLikes,
    loading,
    time,
    setTime,
    checkAndUpdateTimeIfExpired, // 새로 추가
  } = useStore();

  /** 사용자 주소 */
  const { userAddress, accessToken } = useUserInfo();

  /** 초기 로딩 처리 */
  useEffect(() => {
    const initializePage = async () => {
      setLoading(true);
      
      // 시간 만료 체크 및 자동 업데이트
      checkAndUpdateTimeIfExpired();
      
      // 초기 시간 설정 (새로고침 시에만 실행)
      console.log('updateCurrentTime 호출');
      updateCurrentTime();
      
      // 백엔드 API에서 가게 목록 가져오기 (현재 설정된 필터들 사용)
      try {
        await fetchStores(time, filters.categories.length > 0 ? filters.categories[0] : null);
        
        // 로그인된 사용자인 경우에만 찜 목록 가져오기
        if (accessToken) {
          await fetchUserLikes();
        }
      } catch (error) {
        console.error('초기 가게 목록 로딩 실패:', error);
      }
      
      // 0.1초 지연으로 렌더링 시간 시뮬레이션
      await new Promise(res => setTimeout(res, 100));
      setLoading(false);
    };
    initializePage();
  }, [updateCurrentTime, fetchStores, fetchUserLikes, time, filters.categories, accessToken, checkAndUpdateTimeIfExpired, currentTime]); // currentTime 의존성 추가

  /**
   * 정렬 변경
   * @param {string} option - 'discount' | 'price'
   */
  const handleSortChange = (option) => {
    setSortOption(option);
    setIsSortOpen(false);
  };

  /* 토글 상태 변경 handler 함수 */
  const handleToggleSort = () => {
    if (!isLoading) {
      setIsSortOpen(!isSortOpen);
    }
  };

  /** 주소 클릭 시 */
  const handleAddressClick = () => {
    if (!isLoading) {
      setCurrentPage('search-address');
      setFromHomePage(true); // 주소 설정 페이지로 이동할 때 fromHomePage 플래그를 true로 설정
      navigate('/search-address');
    } else {
      console.log('로딩 중이므로 클릭 무시');
    }
  };

  /**
   * 시간 선택 핸들러
   * @param {string} selectedTime - 선택된 시간
   */
  const handleTimeSelect = async (selectedTime) => {
    console.log('시간 선택됨:', selectedTime);
    setTime(selectedTime);
    
    try {
      // 현재 설정된 카테고리 필터도 함께 사용
      await fetchStores(selectedTime, filters.categories.length > 0 ? filters.categories[0] : null);
    } catch (error) {
      console.error('시간 필터 적용 실패:', error);
    }
    
    console.log('setTimeout 설정 - 0.3초 후 로딩 시작');
    // 0.3초 후 바텀시트 닫힘, 2초 로딩 (테스트용)
    setTimeout(async () => {
      console.log('setTimeout 콜백 실행 - 로딩 시작');
      setLoading(true);
      console.log('0.3초 로딩 시작');
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('0.3초 로딩 완료');
      setLoading(false);
      console.log('시간필터 로딩 완료');
    }, 300);
  };

  /**
   * 업종 선택 핸들러
   * @param {string|null} category - 선택된 업종 (단일 값)
   */
  const handleCategorySelect = async (category) => {
    console.log('handleCategorySelect 호출됨, category:', category);
    setFilters({ categories: category ? [category] : [] });
    
    // 카테고리 필터 적용 시 API 재호출 (현재 설정된 시간 필터도 함께 사용)
    try {
      await fetchStores(time, category);
    } catch (error) {
      console.error('카테고리 필터 적용 실패:', error);
    }
    
    // 로딩 처리 (시간 필터와 동일한 방식)
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  /**
   * 매장 클릭
   * @param {number} storeId - 가게 ID
   */
  const handleCardClick = (storeId) => navigate(`/shop/${storeId}`);

  /** 주소 표시
   * 등록된 주소가 있으면 사용, 없으면 기본 주소
   * 8글자까지 표시
   */
  const displayAddress = userAddress ? userAddress.roadAddr : currentAddress;
  const getAddressDisplayText = () => {
    return displayAddress.length > 15 ? `${displayAddress.slice(0, 15)}...` : displayAddress;
  };

  /** 업종 라벨 */
  const getCategoryLabel = () => {
    console.log('getCategoryLabel 호출됨, filters.categories:', filters.categories);
    if (filters.categories.length === 0) return '업종';
    
    // CATEGORY_OPTIONS에서 해당 카테고리의 label 찾기
    const selectedCategory = filters.categories[0];
    const categoryOption = CATEGORY_OPTIONS.find(option => option.value === selectedCategory);
    const label = categoryOption ? categoryOption.label : '업종';
    
    console.log('선택된 카테고리 라벨:', label);
    return label;
  };
  // 정렬된 가게 목록 가져오기
  const sortedStores = getSortedStores();

  return (
    <HomeContainer>
      {/* 상단 주소 */}
      <AddressBar>
        <AddressText onClick={handleAddressClick}>
          <AddressTextContent>{getAddressDisplayText()}</AddressTextContent>
          <AddressIcon>
            <FiChevronDown size={24} color="#DA2538" />
          </AddressIcon>
        </AddressText>
      </AddressBar>

      {/* 배너 */}
      <BannerWrapper>
        <BannerImage src={bannerImage} alt="배너 이미지" />
        <BannerTextContainer>
          <BannerSubTitle>꾸미기 딱 좋은 날 ♥</BannerSubTitle>
          <BannerTitle>
            우리동네 네일샵<br />
            최대 50% 할인!
          </BannerTitle>
        </BannerTextContainer>
      </BannerWrapper>
      
      <FilterAndSortToggleContainer>
        {/* 필터/정렬 영역 (배너 아래에 위치, 스크롤 시 주소바 바로 아래에 고정) */}
        <FilterContainer
            time={time}
            filters={filters}
            onTimeSelect={handleTimeSelect}
            onCategorySelect={handleCategorySelect}
            isLoading={isLoading}
        />

        {/* 정렬 토글 */}
        <SortToggleContainer>
            <SortToggle onClick={handleToggleSort}>
            <span>{sortOption === 'discount' ? '할인율순' : '가격순'}</span>
            <AiFillCaretDown size={16} color="#000" />
            </SortToggle>
            {isSortOpen && !isLoading && (
            <SortDropdown>
                <SortOption onClick={() => !isLoading && handleSortChange('discount')}>
                할인율순
                </SortOption>
                <SortOption onClick={() => !isLoading && handleSortChange('price')}>
                가격순
                </SortOption>
            </SortDropdown>
            )}
        </SortToggleContainer>
      </FilterAndSortToggleContainer>

      {/* 매장 리스트 */}
      <StoreList>
        {isLoading || loading ? (
          <LoadingContainer>
            <Spinner />
          </LoadingContainer>
        ) : sortedStores.length > 0 ? (
          sortedStores
          .filter(store => store && store.id) // undefined나 id가 없는 store 제거
          .map(store => (
            <Card 
              key={store.id} 
              store={store} 
              onClick={() => handleCardClick(store.id)}
            />
          ))
        ) : (
          <EmptyState>
            <EmptyText>해당 조건의 가게가 없어요</EmptyText>
            <EmptySubText>다른 조건으로 검색해보세요!</EmptySubText>
          </EmptyState>
        )}
      </StoreList>
    </HomeContainer>
  );
}

// ===== Styled Components ===== //

/* Layout 내부에서 스크롤 가능한 영역(내부 화면) */
const HomeContainer = styled.div`
  background: #fff;
  min-height: 100%;
  padding: 0 16px;
  width: 100%;
  max-width: 100%;
`;

/* 상단 주소 바(Layout 내부에서 상단에 고정되어 스크롤에 영향을 받지 않음) */
const AddressBar = styled.div`
  position: sticky;
  top: -0.5px;
  z-index: 20;
  height: 68px;
  display: flex;
  align-items: center;
  padding: 16px 0;
  background-color: #fff;
  width: 100%;

  touch-action: manipulation; // 모바일에서 주소바 클릭 시 자동 줌 방지 테스트 -> 해결 안 됨
`;

/* 주소 아이콘 */
const AddressIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 4px;
  flex-shrink: 0;
  will-change: transform;
  transition: transform 0.2s ease;
`;

/* 주소 텍스트 */
const AddressText = styled.div`
  overflow: hidden;
  color: #000;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-style: normal;
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover ${AddressIcon} {
    transform: rotate(180deg);
  }
`;

/* 주소 텍스트 내용 */
const AddressTextContent = styled.p`
  font-size: 22px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  user-select: none;
`;

/* 배너 광고 영역(주소바 아래에 위치) */
const BannerWrapper = styled.div`
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  background-color: #000000a9;
`;

/* 배너 이미지 */
const BannerImage = styled.img`
  width: 100%;
  height: 130px;
  opacity: 0.7;
  object-fit: cover;
  display: block;
`;

/* 배너 글씨 컨테이너 */
const BannerTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 6px;
  bottom: 6px;
`;

/* 배너 이미지 위에 Overlay되는 텍스트 */
const BannerTitle = styled.div`
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  line-height: normal;
  text-align: right;
`;

/* 배너 서브 텍스트 배너 상단에 표시되는 작은 텍스트 */
const BannerSubTitle = styled.div`
  color: #FFB1B9;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  align-self: flex-end;
`;

/* 정렬 토글 컨테이너(토글 버튼 & 드롭다운) */
const SortToggleContainer = styled.div`
  position: relative;
`;

/* 정렬 토글 버튼(할인율순/가격순 정렬 옵션) */
const SortToggle = styled.button`
  font-size: 14px;
  font-weight: 400;
  color: #000;
  cursor: pointer;
  border: none;
  background: none;
  outline: none;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
`;

/* 정렬 드롭다운 메뉴 */
const SortDropdown = styled.div`
  font-size: 14px;
  font-weight: 400;
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border: 1px solid #CCC;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 10;
  min-width: 80px;
`;

/* 정렬 옵션 */
const SortOption = styled.div`
  padding: 8px 12px;
  color: #000;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f8f8;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

/* 매장 리스트 컨테이너(가게 카드들 담는 컨테이너) */
const StoreList = styled.div`
  background: #fff;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  position: relative;
  padding-top: 1px;
  padding-bottom: 52px;
`;

/* 로딩 컨테이너 */
const LoadingContainer = styled.div`
  height: 100%;
  overflow-y: hidden;
  position: relative;
  top: 1rem;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px; /* 최소 높이 보장 */
`;

/* 빈 상태 컨테이너 */
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

/* 빈 상태 텍스트 */
const EmptyText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

/* 빈 상태 서브 텍스트 */
const EmptySubText = styled.div`
  font-size: 14px;
  color: #666;
`;

const FilterAndSortToggleContainer = styled.div`
  display: flex; 
  justify-content: space-between;
  align-items: center;
  position: -webkit-sticky;
  position: sticky;
  top: 66px;
  z-index: 19;
  background-color: #fff;
`;