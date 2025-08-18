/**
 * 필터 컨테이너 컴포넌트
 * 시간 필터와 업종 필터를 포함한 공통 필터 UI
 * HomePage와 FavoritePage에서 재사용
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import BottomSheet from '../common/BottomSheet';
import TimeToggle from './TimeToggle';
import CategoryToggle from './CategoryToggle';
import CategoryFilter, { CATEGORY_OPTIONS } from './CategoryFilter';
import TimeFilter, { getNearestHour } from './TimeFilter';

const FilterContainer = ({ 
  time, 
  filters, 
  onTimeSelect, 
  onCategorySelect, 
  isLoading = false 
}) => {
  const [isTimeSheetOpen, setIsTimeSheetOpen] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

  // 업종 필터 라벨 생성
  const getCategoryLabel = () => {
    if (filters.categories.length === 0) return '업종';
    
    // CATEGORY_OPTIONS에서 해당 카테고리의 label 찾기
    const selectedCategory = filters.categories[0];
    const categoryOption = CATEGORY_OPTIONS.find(option => option.value === selectedCategory);
    const label = categoryOption ? categoryOption.label : '업종';
    
    return label;
  };

  // 시간 선택 핸들러
  const handleTimeSelect = async (selectedTime) => {
    console.log('시간 선택됨:', selectedTime);
    await onTimeSelect(selectedTime);
    setIsTimeSheetOpen(false);
  };

  // 업종 선택 핸들러
  const handleCategorySelect = async (category) => {
    console.log('업종 선택됨:', category);
    await onCategorySelect(category);
    setIsCategorySheetOpen(false);
  };

  return (
    <>
      {/* 필터/정렬 영역 */}
      <FilterRow>
        <TimeToggle
          label={time || getNearestHour(new Date().toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }))}
          onClick={() => !isLoading && setIsTimeSheetOpen(true)}
        />

        <CategoryToggle
          label={getCategoryLabel()}
          active={filters.categories.length > 0}
          onClick={() => !isLoading && setIsCategorySheetOpen(true)} 
        />
      </FilterRow>

      {/* 예약 시간 선택 바텀시트 */}
      <BottomSheet
        open={isTimeSheetOpen}
        title="예약 시간"
        onClose={() => setIsTimeSheetOpen(false)}
      >
        <TimeFilter
          currentTime={new Date().toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })}
          selectedTime={time}
          onTimeSelect={handleTimeSelect}
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
    </>
  );
};

export default FilterContainer;

// ===== Styled Components ===== //

/* 필터 라인 영역 */
const FilterRow = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 90px;
  z-index: 15;
  padding: clamp(8px, 2vh, 16px) 0;
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