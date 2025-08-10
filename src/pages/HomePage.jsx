/**
 * 메인 페이지(HomePage) 컴포넌트
 * 주소 표시, 배너, 필터, 가게 목록을 포함
 * 배너의 최대 할인율은 STORES_DATA의 menus에서 동적으로 계산
 * 가게 카드 클릭 시 상세 페이지(/shop/:id)로 이동
 * SORT_OPTIONS를 사용하여 모든 정렬 옵션 표시
 */
import { useEffect, useState } from "react";
import styled from "styled-components";
import { FiChevronDown } from "react-icons/fi";
import { AiFillCaretDown } from "react-icons/ai";
import useStore from "../hooks/store/useStore";
import useUserInfo from "../hooks/user/useUserInfo";
import Card from "../components/shop/Card";
import bannerImage from "../assets/images/bannerImage.png";
import { useNavigate } from "react-router-dom";
import { STORES_DATA } from "../apis/mock/mockShopList";

export default function HomePage() {
  const navigate = useNavigate();
  /* 토글 상태 관리 */
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  /* Zustand 스토어에서 필요한 상태와 액션 가져오기 */
  const { 
    currentAddress, 
    currentTime, 
    updateCurrentTime, 
    sortOption, 
    setSortOption, 
    getSortedStores 
  } = useStore();

  /* 사용자 정보에서 등록된 주소 가져오기 */
  const { userAddress } = useUserInfo();

  /* 컴포넌트 마운트 시 현재 시간을 한 번만 설정(갱신기준: 새로고침) */
  useEffect(() => {
    // 초기 시간 설정 (새로고침 시에만 실행)
    updateCurrentTime();
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
    setIsSortOpen(!isSortOpen);
  };

  /**
   * 가게 카드 클릭 시 상세 페이지로 이동
   * @param {number} storeId - 가게 ID
   */
  const handleCardClick = (storeId) => {
    console.log(`shop/${storeId}로 이동`);    
    navigate(`/shop/${storeId}`);
  };

  // 정렬된 가게 목록 가져오기
  const sortedStores = getSortedStores();

  // 최대 할인율 계산
  const maxDiscount = Math.max(
    ...STORES_DATA.flatMap(store =>
      store.hasDesigners
        ? store.designers.flatMap(designer => designer.menus.map(menu => menu.discountRate))
        : store.menus.map(menu => menu.discountRate)
    )
  );

  // 표시할 주소 결정 (등록된 주소가 있으면 사용, 없으면 기본 주소)
  const displayAddress = userAddress ? userAddress.roadAddr : currentAddress;

  return (
    <HomeContainer>
      {/* 상단 주소 선택 바 (Layout 내부에서 고정) */}
      <AddressBar>
        <AddressText>
          {/* 제목 6글자까지 표시*/}
          {displayAddress.length > 6 ? `${displayAddress.slice(0, 6)}...` : displayAddress}
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
        <TimeFilterTab active>
          <span>{currentTime}</span>
          <FiChevronDown size={16} />
        </TimeFilterTab>
        <FilterTab>업종</FilterTab>
        <SortToggleContainer>
          <SortToggle onClick={handleToggleSort}>
            <span>{sortOption === 'discount' ? '할인율순' : '가격순'}</span>
            <AiFillCaretDown size={16} color="#000" />
          </SortToggle>
          {isSortOpen && (
            <SortDropdown>
              <SortOption onClick={() => handleSortChange('discount')}>
                할인율순
              </SortOption>
              <SortOption onClick={() => handleSortChange('price')}>
                가격순
              </SortOption>
            </SortDropdown>
          )}
        </SortToggleContainer>
      </FilterRow>

      {/* 매장 리스트 */}
      <StoreList>
        {sortedStores.map(store => (
          <Card
            key={store.id}
            store={store}
            onClick={() => handleCardClick(store.id)}
          />
        ))}
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

/* 시간 필터 탭 버튼
(시간 표시와 드롭다운 아이콘 포함.) */
const TimeFilterTab = styled.button`
  width: clamp(60px, 20vw, 74px);
  height: clamp(26px, 7vh, 30px);
  border-radius: clamp(12px, 3vw, 16px);
  border: 1px solid ${props => props.active ? "#DA2538" : "#CCC"};
  background: #fff;
  color: ${props => props.active ? "#DA2538" : "#666"};
  font-size: clamp(13px, 4vw, 15px);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(4px, 2vw, 8px);
  padding: 0 clamp(4px, 2vw, 8px);

  &:hover {
    background: #f8f8f8;
  }
`;

/* 필터 탭 버튼
(시간 표시와 업종 필터를 위한 버튼) */
const FilterTab = styled.button`
  padding: clamp(3px, 1vw, 5px) clamp(12px, 4vw, 18px);
  border-radius: clamp(12px, 3vw, 16px);
  border: 1px solid ${props => props.active ? "#DA2538" : "#CCC"};
  background: #fff;
  color: ${props => props.active ? "#DA2538" : "#666"};
  font-size: clamp(13px, 4vw, 15px);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f8f8;
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
  overflow-x: hidden;
`;