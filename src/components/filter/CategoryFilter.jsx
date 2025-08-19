import React from 'react';
import styled from 'styled-components';

// 업종 목록 데이터 (백엔드 API에 맞게 업데이트)
export const CATEGORY_OPTIONS = [
  { value: "스포츠시설", label: "스포츠시설" },
  { value: "스터디카페", label: "스터디카페" },
  { value: "미용실", label: "미용실" },
  { value: "PT/필라테스", label: "PT/필라테스" },
  { value: "사진 스튜디오", label: "사진 스튜디오" }
];

const CategoryFilter = ({ selectedCategory = null, onCategorySelect, onClose }) => {
  const handleCategoryClick = (categoryValue) => {
    if (categoryValue === 'none') {
      // 선택안함 클릭 시 선택 해제하고 바텀시트 닫기
      onCategorySelect(null);
      onClose();
    } else {
      // 이미 선택된 카테고리를 다시 클릭하면 선택 해제, 아니면 새로 선택
      const newCategory = selectedCategory === categoryValue ? null : categoryValue;
      onCategorySelect(newCategory);
      onClose();
    }
  };

  return (
    <CategoryList>
      {CATEGORY_OPTIONS.map((category) => (
        <CategoryItem
          key={category.value}
          onClick={() => handleCategoryClick(category.value)}
          $selected={selectedCategory === category.value}
          aria-label={`업종 ${category.label} 선택`}
        >
          {category.label}
        </CategoryItem>
      ))}
      <CategoryItem
        onClick={() => handleCategoryClick('none')}
        $selected={false}
        aria-label="선택안함"
      >
        선택안함
      </CategoryItem>
    </CategoryList>
  );
};

export default CategoryFilter;

const CategoryList = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  margin-bottom: 200px; //임시
`;

const CategoryItem = styled.button`
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid #CCC;
  background: #fff;
  font-size: 15px;
  display: flex;
  justify-content: flex-start;
  color: ${props => props.$selected ? '#DA2538' : '#000'};
  font-weight: ${props => props.$selected ? '600' : '400'};

  &:hover {
    color: #DA2538;
  }

  &:last-child {
    border-bottom: none;
  }
`;