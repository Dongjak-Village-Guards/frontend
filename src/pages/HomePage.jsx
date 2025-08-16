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
import BottomSheet from "../components/common/BottomSheet";
import TimeToggle from "../components/filter/TimeToggle";
import CategoryToggle from "../components/filter/CategoryToggle";
import CategoryFilter, { CATEGORY_OPTIONS } from "../components/filter/CategoryFilter";
import TimeFilter from "../components/filter/TimeFilter";
import Spinner from "../components/common/Spinner";
import useStore from "../hooks/store/useStore";
import useUserInfo from "../hooks/user/useUserInfo";
import Card from "../components/home/shop/Card";
import bannerImage from "../assets/images/bannerImage.png";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  /** @state 토글 상태 */
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isTimeSheetOpen, setIsTimeSheetOpen] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

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
    fetchStores,
    loading,
  } = useStore();

  /** 사용자 주소 */
  const { userAddress } = useUserInfo();

  /** 초기 로딩 처리 */
  useEffect(() => {
    const initializePage = async () => {
      setLoading(true);
      // 초기 시간 설정 (새로고침 시에만 실행)
      console.log('updateCurrentTime 호출');
      updateCurrentTime();
      
      // 백엔드 API에서 가게 목록 가져오기 (현재 설정된 필터들 사용)
      try {
        const timeParam = filters.availableAt ? parseInt(filters.availableAt.split(':')[0]) : null;
        const categoryParam = filters.categories.length > 0 ? filters.categories[0] : null;
        await fetchStores(timeParam, categoryParam);
      } catch (error) {
        console.error('초기 가게 목록 로딩 실패:', error);
      }
      
      // 0.1초 지연으로 렌더링 시간 시뮬레이션
      await new Promise(res => setTimeout(res, 100));
      setLoading(false);
    };
    initializePage();
  }, [updateCurrentTime, fetchStores, filters.availableAt, filters.categories]);

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
    } else {
      console.log('로딩 중이므로 클릭 무시');
    }
  };

  /**
   * 업종 변경 (하나만 선택)
   * @param {string|null} category - 선택된 업종 (단일 값)
   */
  const handleCategorySelect = async (category) => {
    console.log('handleCategorySelect 호출됨, category:', category);
    setFilters({ categories: category ? [category] : [] });
    
    // 카테고리 필터 적용 시 API 재호출 (현재 설정된 시간 필터도 함께 사용)
    const timeParam = filters.availableAt ? parseInt(filters.availableAt.split(':')[0]) : null;
    try {
      await fetchStores(timeParam, category);
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
    return displayAddress.length > 8 ? `${displayAddress.slice(0, 8)}...` : displayAddress;
  };

  /** 다음 정각 계산 */
  const getNearestHour = (currentTime) => {
    const [currentHour, currentMinute] = String(currentTime).split(':').map(Number);
    // 현재가 정각이면 다음 시간, 아니면 다음 정각
    const nextHour = currentMinute === 0 ? (currentHour + 1) % 24 : (currentHour + 1) % 24;
    return `${String(nextHour).padStart(2, '0')}:00`;
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
        <AddressText>
          <AddressTextContent>{getAddressDisplayText()}</AddressTextContent>
          <AddressIcon onClick={handleAddressClick}>
            <FiChevronDown size={16} color="#DA2538" />
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

      {/* 필터/정렬 영역 (배너 아래에 위치, 스크롤 시 주소바 바로 아래에 고정) */}
      <FilterRow>
        <TimeToggle
          label={filters.availableAt || getNearestHour(currentTime)}
          active={!!filters.availableAt}
          onClick={() => !isLoading && setIsTimeSheetOpen(true)}
        />

        <CategoryToggle
          label={getCategoryLabel()}
          active={filters.categories.length > 0}
          onClick={() => !isLoading && setIsCategorySheetOpen(true)} 
        />

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
      </FilterRow>

      {/* 예약 시간 선택 바텀시트 */}
      <BottomSheet
        open={isTimeSheetOpen}
        title="예약 시간"
        onClose={() => {
          console.log('HomePage에서 onClose 호출됨');
          setIsTimeSheetOpen(false);
        }}
      >
        <TimeFilter
          currentTime={currentTime}
          selectedTime={filters.availableAt}
          onTimeSelect={async (time) => {
            console.log('시간 선택됨:', time);
            setFilters({ availableAt: time });
            
            // 시간을 API time 파라미터로 변환 (HH:MM → 0~36)
            const timeParam = parseInt(time.split(':')[0]);
            
            try {
              // 현재 설정된 카테고리 필터도 함께 사용
              const categoryParam = filters.categories.length > 0 ? filters.categories[0] : null;
              await fetchStores(timeParam, categoryParam);
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
          }}
          onClose={() => setIsTimeSheetOpen(false)}
        />
      </BottomSheet>

      {/* 업종 선택 바텀시트 */}
      <BottomSheet
        open={isCategorySheetOpen}
        title="업종"
        onClose={() => setIsCategorySheetOpen(false)}
      >
        <CategoryFilter
          selectedCategory={filters.categories.length > 0 ? filters.categories[0] : null}
          onCategorySelect={handleCategorySelect}
          onClose={() => setIsCategorySheetOpen(false)}
        />
      </BottomSheet>

      {/* 매장 리스트 */}
      <StoreList>
        {isLoading || loading ? (
          <LoadingContainer>
                <Spinner />
          </LoadingContainer>
        ) : (
          <>
            {sortedStores.map(store => (
              <Card
            key={store.id}
            store={store}
            onClick={() => handleCardClick(store.id)}
          />
            ))}
          </>
        )}
      </StoreList>

    </HomeContainer>
  );
};

// ===== Styled Components ===== //

/* Layout 내부에서 스크롤 가능한 영역(내부 화면) */
const HomeContainer = styled.div`
  background: #fff;
  min-height: 100%;
  padding: 0 clamp(8px, 4vw, 16px);
  width: 100%;
  max-width: 100%;
`;

/* 상단 주소 바(Layout 내부에서 상단에 고정되어 스크롤에 영향을 받지 않음) */
const AddressBar = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  padding: 44px 0 16px 0;
  background: #fff;
  width: 100%;
  
  /* sticky 포지션이 확실히 작동하도록 추가 설정 */
  transform: translateZ(0);
  will-change: transform;

  touch-action: manipulation; // 모바일에서 주소바 클릭 시 자동 줌 방지 테스트 -> 해결 안 됨
`;

/* 주소 텍스트 */
const AddressText = styled.div`
  overflow: hidden;
  color: #000;
  text-overflow: ellipsis;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  display: flex;
  align-items: center;
  gap: clamp(2px, 2vw, 4px);
  padding: 4px 8px;
  border-radius: 8px;
`;

/* 주소 텍스트 내용 */
const AddressTextContent = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

/* 주소 아이콘 */
const AddressIcon = styled.span`
  cursor: pointer;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 4px;
  flex-shrink: 0;

  &:hover {
    transform: rotate(180deg);
  }
`;

/* 배너 광고 영역(주소바 아래에 위치) */
const BannerWrapper = styled.div`
  border-radius: 10px;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  background-color: #000000a9;
`;

/* 배너 이미지 */
const BannerImage = styled.img`
  width: 100%;
  height: clamp(100px, 25vh, 130px);
  opacity: 0.7;
  object-fit: cover;
  display: block;
`;

/* 배너 글씨 컨테이너 */
const BannerTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 6px; bottom: 6px;
`;

/* 배너 이미지 위에 Overlay되는 텍스트 */
const BannerTitle = styled.div`
  color: #fff;
  font-size: clamp(18px, 6.5vw, 22px);
  font-weight: 700;
  line-height: normal;
  text-align: right;
`;

/* 배너 서브 텍스트 배너 상단에 표시되는 작은 텍스트 */
const BannerSubTitle = styled.div`
  color: #FFB1B9;
  font-size: clamp(10px, 3.5vw, 12px);
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  align-self: flex-end;
`;

/* 필터 라인 영역
(배너 아래에 위치, 스크롤 시 주소바 바로 아래에 Layout 내부에서 고정됨.) */
const FilterRow = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 90px;
  z-index: 15;
  //  margin: 0px 0px clamp(8px, 2vh, 16px) 0px; // 필터바 padding 변경요구 반영
  padding: clamp(8px, 2vh, 16px) 0; // 약간의 편법
  display: flex;
  align-items: center;
  gap: clamp(6px, 2vw, 10px);
  background: #fff;
  transition: all 0.3s ease;
  width: 100%;
  
  /* sticky 포지션이 확실히 작동하도록 추가 설정 */
  transform: translateZ(0);
  will-change: transform;
`;

/* 정렬 토글 컨테이너(토글 버튼 & 드롭다운) */
const SortToggleContainer = styled.div`
  margin-left: auto;
  position: relative;
`;

/* 정렬 토글 버튼(할인율순/가격순 정렬 옵션) */
const SortToggle = styled.button`
  font-size: 14px;
  color: #000;
  cursor: pointer;
  border: none;
  background: none;
  outline: none;
  display: flex;
  align-items: center;
  gap: clamp(2px, 1vw, 4px);
  padding: 0;
`;

/* 정렬 드롭다운 메뉴 */
const SortDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border: 1px solid #CCC;
  border-radius: clamp(6px, 2vw, 8px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 10;
  min-width: clamp(70px, 20vw, 80px);
`;

/* 정렬 옵션 */
const SortOption = styled.div`
  padding: clamp(6px, 2vw, 8px) clamp(8px, 3vw, 12px);
  font-size: clamp(12px, 3.5vw, 14px);
  color: #000;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f8f8;
  }

  &:first-child {
    border-radius: clamp(6px, 2vw, 8px) clamp(6px, 2vw, 8px) 0 0;
  }

  &:last-child {
    border-radius: 0 0 clamp(6px, 2vw, 8px) clamp(6px, 2vw, 8px);
  }
`;

/* 매장 리스트 컨테이너(가게 카드들 담는 컨테이너) */
const StoreList = styled.div`
  background: #fff;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  position: relative;
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