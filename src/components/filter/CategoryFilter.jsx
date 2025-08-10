import React from 'react';
import styled from 'styled-components';
import { CATEGORY_OPTIONS } from '../../apis/mock/mockShopList';

const CategoryFilter = ({ selectedCategories = [], onCategoryChange, onClose }) => {
  const handleCategoryClick = (categoryValue) => {
    if (categoryValue === 'none') {
      // 선택안함 클릭 시 모든 선택 해제하고 바텀시트 닫기
      onCategoryChange([]);
      // onClose는 HomePage에서 로딩 애니메이션과 함께 처리됨
    } else {
      // 기존 선택된 업종들에서 토글
      const newCategories = selectedCategories.includes(categoryValue)
        ? selectedCategories.filter(cat => cat !== categoryValue)
        : [...selectedCategories, categoryValue];
      
      onCategoryChange(newCategories);
    }
  };

  return (
    <CategoryList>
      {CATEGORY_OPTIONS.map((category) => (
        <CategoryItem
          key={category.value}
          onClick={() => handleCategoryClick(category.value)}
          $selected={selectedCategories.includes(category.value)}
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