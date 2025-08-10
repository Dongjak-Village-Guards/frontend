/**
 * 메인 페이지(HomePage) 컴포넌트
 * 주소 표시, 배너, 필터, 가게 목록을 포함함.
 */
import { useEffect, useState } from "react";
import styled from "styled-components";
import { FiChevronDown } from "react-icons/fi";
import { AiFillCaretDown } from "react-icons/ai";
import BottomSheet from "../components/common/BottomSheet";
import TimeToggle from "../components/filter/TimeToggle";
import CategoryToggle from "../components/filter/CategoryToggle";
import CategoryFilter from "../components/filter/CategoryFilter";
import Spinner from "../components/common/Spinner";
import useStore from "../hooks/store/useStore";
import useUserInfo from "../hooks/user/useUserInfo";
import Card from "../components/shop/Card";
import bannerImage from "../assets/images/bannerImage.png";
import { type } from "@testing-library/user-event/dist/type";

// 간격 시간(1시간) 옵션 생성
//const generateTimeOptions = (currentTime) => {

//    const [h, m] = String(currentTime).split(':').map(Number);

//    let startHour = (m === 0 ? (h + 1) : (h + 1)) % 24;
//    const result = [];
//    for (let i = 0; i < 12; i += 1) {
//        const hour = (startHour + i) % 24;
//        result.push(`${String(hour).padStart(2, '0')}:00`);
//    }
//    return result;
//};

// 현재 시간 이후부터 12시간, 1시간 단위로 생성
const generateTimeOptions = (currentTime) => {
  const [currentHour, currentMinute] = String(currentTime).split(':').map(Number);
  
  const result = [];
  // 다음 정각부터 시작 (현재가 정각이면 그 다음 시간)
  let startHour = currentMinute === 0 ? (currentHour + 1) % 24 : (currentHour + 1) % 24;
  
  for (let i = 0; i < 12; i++) {
    const hour = (startHour + i) % 24;
    result.push(`${String(hour).padStart(2, '0')}:00`);
  }
  
  return result;
};


export default function HomePage() {
  /* 토글 상태 관리 */
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isTimeSheetOpen, setIsTimeSheetOpen] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  
  /* 로딩 상태 관리 */
  const [isLoading, setIsLoading] = useState(false);
  
  // 디버깅: setIsLoading 래퍼 함수 (콜백 사용)
  const setLoadingWithLog = (loading) => {
    console.log('setIsLoading 호출됨:', loading);
    setIsLoading(loading);
  };
  
  // 디버깅: isLoading 상태 변화 추적
  useEffect(() => {
    console.log('isLoading 상태 변화됨:', isLoading);
  }, [isLoading]);
  
  /* Zustand 스토어에서 필요한 상태와 액션 가져오기 */
  const { 
    currentAddress, 
    currentTime, 
    updateCurrentTime, 
    sortOption, 
    setSortOption, 
    getSortedStores,
    filters,
    setFilters,
  } = useStore();

  /* 사용자 정보에서 등록된 주소 가져오기 */
  const { userAddress } = useUserInfo();

  /* 컴포넌트 마운트 시 초기 로딩 처리 */
  useEffect(() => {
    console.log('useEffect 실행됨 - 초기 로딩 시작');
    const initializePage = async () => {
      console.log('initializePage 함수 시작');
      setLoadingWithLog(true);
      
      // 초기 시간 설정 (새로고침 시에만 실행)
      console.log('updateCurrentTime 호출');
      updateCurrentTime();
      
      // 0.1초 지연으로 렌더링 시간 시뮬레이션
      console.log('0.1초 지연 시작');
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('0.1초 지연 완료');
      
      setLoadingWithLog(false);
      console.log('initializePage 함수 완료');
    };

    initializePage();
  }, [updateCurrentTime]);

  /**
   * 정렬 옵션 변경 핸들러
   * @param {string} option - 정렬 옵션
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

  /**
   * 업종 필터 변경 핸들러
   * @param {Array} categories - 선택된 업종 배열
   */
  const handleCategoryChange = (categories) => {
    console.log('업종 선택됨:', categories);
    setFilters({ categories });
    
    // 업종 필터 변경 시 로딩 처리
    setLoadingWithLog(true);
    setTimeout(async () => {
      console.log('업종필터 로딩 시작');
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('업종필터 로딩 완료');
      setLoadingWithLog(false);
      
      // 업종이 모두 해제되었을 때(선택안함 클릭 시) 바텀시트 닫기
      if (categories.length === 0) {
        setIsCategorySheetOpen(false);
      }
    }, 300);
  };

  // 정렬된 가게 목록 가져오기
  const sortedStores = getSortedStores();

  // 표시할 주소 결정 (등록된 주소가 있으면 사용, 없으면 기본 주소)
  const displayAddress = userAddress ? userAddress.roadAddr : currentAddress;

  // 업종 필터 라벨 생성
  const getCategoryLabel = () => {
    if (filters.categories.length === 0) return '업종';
    if (filters.categories.length === 1) {
      const categoryMap = { hair: '미용실', nail: '네일샵', pilates: '필라테스' };
      return categoryMap[filters.categories[0]] || '업종';
    }
    // 2개 이상 선택 시: "첫번째업종 외 N종" 형태
    const categoryMap = { hair: '미용실', nail: '네일샵', pilates: '필라테스' };
    const firstCategory = categoryMap[filters.categories[0]] || '업종';
    const remainingCount = filters.categories.length - 1;
    return `${firstCategory} 외 ${remainingCount}종`;
  };

  return (
    <HomeContainer>
      {/* 상단 주소 선택 바 (Layout 내부에서 고정) */}
      <AddressBar>
        <AddressText>
          {/* 제목 8글자까지 표시*/}
          {displayAddress.length > 8 ? `${displayAddress.slice(0, 8)}...` : displayAddress}
          <FiChevronDown size={24} color="#DA2538" />
        </AddressText>
      </AddressBar>

      {/* 프로모션 배너 */}
      <BannerWrapper>
        <BannerImage src={bannerImage} alt="배너 이미지" />
        <BannerSub>꾸미기 딱 좋은 날♥</BannerSub>
        <BannerText>
          우리동네 네일샵<br />
          최대 50% 할인!
        </BannerText>
      </BannerWrapper>

      {/* 필터/정렬 영역 (배너 아래에 위치, 스크롤 시 주소바 바로 아래에 고정) */}
      <FilterRow>
        <TimeToggle
          label={filters.availableAt || currentTime}
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
        <TimeList>
          {generateTimeOptions(currentTime).map((t) => (
            <TimeItem
              key={t}
              onClick={async () => {
                console.log('시간 선택됨:', t);
                // 시간 선택 시 로딩 처리
                setFilters({ availableAt: t });
                setIsTimeSheetOpen(false);
                
                console.log('setTimeout 설정 - 0.3초 후 로딩 시작');
                // 0.3초 후 바텀시트 닫힘, 2초 로딩 (테스트용)
                setTimeout(async () => {
                  console.log('setTimeout 콜백 실행 - 로딩 시작');
                  setLoadingWithLog(true);
                  console.log('0.3초 로딩 시작');
                  await new Promise(resolve => setTimeout(resolve, 300));
                  console.log('0.3초 로딩 완료');
                  setLoadingWithLog(false);
                  console.log('시간필터 로딩 완료');
                }, 300);
              }}
              aria-label={`시간 ${t} 선택`}
            >
              {t}
            </TimeItem>
          ))}
        </TimeList>
      </BottomSheet>

      {/* 업종 선택 바텀시트 */}
      <BottomSheet
        open={isCategorySheetOpen}
        title="업종"
        onClose={() => {
          console.log('업종 바텀시트 닫기');
          // 업종 바텀시트 닫기 시 로딩 처리
          setLoadingWithLog(true);
          setTimeout(async () => {
            console.log('업종 바텀시트 로딩 시작');
            await new Promise(resolve => setTimeout(resolve, 300));
            console.log('업종 바텀시트 로딩 완료');
            setLoadingWithLog(false);
        }, 300);
        setIsCategorySheetOpen(false);
        }}
      >
        <CategoryFilter
          selectedCategories={filters.categories}
          onCategoryChange={handleCategoryChange}
          onClose={() => setIsCategorySheetOpen(false)}
        />
      </BottomSheet>

      {/* 매장 리스트 */}
      <StoreList>
        {isLoading ? (
          <LoadingContainer>
                <Spinner />
          </LoadingContainer>
        ) : (
          <>
            {sortedStores.map(store => (
              <Card key={store.id} store={store} />
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
  /* sticky 포지션이 작동하도록 overflow 제거 */
`;

/* 상단 주소 바(Layout 내부에서 상단에 고정되어 스크롤에 영향을 받지 않음) */
const AddressBar = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  padding: clamp(16px, 4vh, 32px) 0 clamp(8px, 2vh, 16px) 0; // 주소바 하단 padding 변경요구 반영
  gap: 6px;
  justify-content: space-between;
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
  color: var(--, #000);
  text-overflow: ellipsis;
  font-family: Pretendard;
  // font-size: clamp(16px, 5vw, 22px); // iOS 폰트 자동 확대 방지 수정 -> 해결 안 됨
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  display: flex;
  align-items: center;
  gap: clamp(2px, 2vw, 4px);
`;

/* 배너 광고 영역(주소바 아래에 위치) */
const BannerWrapper = styled.div`
//  margin: clamp(8px, 2vh, 16px) 0 0 0;
  border-radius: clamp(8px, 2vw, 10px);
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

/* 배너 이미지 위에 Overlay되는 텍스트 */
const BannerText = styled.div`
  position: absolute;
  left: 0; right: 3px; bottom: 5px;
  color: #fff;
  font-size: clamp(18px, 5vw, 22px);
  font-weight: 700;
  line-height: normal;
  text-align: right;
`;

/* 배너 서브 텍스트 배너 상단에 표시되는 작은 텍스트(폰트 적용 X) */
const BannerSub = styled.div`
  position: absolute;
  right: 3px; bottom: 58px;
  color: #FFB1B9;
  font-size: clamp(10px, 3vw, 12px);
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

/* 필터 라인 영역
(배너 아래에 위치, 스크롤 시 주소바 바로 아래에 Layout 내부에서 고정됨.) */
const FilterRow = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: clamp(40px, 10vh, 4rem); // 약간의 편법
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

/* Time list for bottom sheet */
const TimeList = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
//  gap: 10px;
`;

const TimeItem = styled.button`
  // 픽셀 눈바디가 안 맞아서 임의 수정
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid #CCC;
  background: #fff;
  font-size: 15px;
  display: flex;
  justify-contents: flex-start;

  &:hover {
    color: #DA2538;
  }
`;

/* 정렬 토글 컨테이너(토글 버튼 & 드롭다운) */
const SortToggleContainer = styled.div`
  margin-left: auto;
  position: relative;
`;

/* 정렬 토글 버튼(할인율순/가격순 정렬 옵션) */
const SortToggle = styled.button`
  font-size: clamp(12px, 3.5vw, 14px);
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
//  border: 3px solid red; /* 디버깅용 테두리 */
  min-height: 200px; /* 최소 높이 보장 */
  
  /* 디버깅용 스타일 강화 */
//  &::before {
//    content: 'LoadingContainer 영역';
//    position: absolute;
//    top: 10px;
//    left: 10px;
//    color: red;
//    font-size: 12px;
//    font-weight: bold;
//  }
`;