import styled from 'styled-components';

const CategoryFilter = ({ options = [], selectedCategories = [], onCategoryChange, onClose }) => {
  const handleCategoryClick = (categoryValue) => {
    if (categoryValue === 'none') {
      onCategoryChange([]);
    } else {
      const newCategories = selectedCategories.includes(categoryValue)
        ? selectedCategories.filter(cat => cat !== categoryValue)
        : [...selectedCategories, categoryValue];
      onCategoryChange(newCategories);
    }
  };

  return (
    <CategoryList>
      {options.map((category) => (
        <CategoryItem
          key={category.value}
          onClick={() => handleCategoryClick(category.value)}
          $selected={selectedCategories.includes(category.value)}
        >
          {category.label}
        </CategoryItem>
      ))}
      <CategoryItem onClick={() => handleCategoryClick('none')} $selected={false}>
        선택안함
      </CategoryItem>
    </CategoryList>
  );
};

export default CategoryFilter;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
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