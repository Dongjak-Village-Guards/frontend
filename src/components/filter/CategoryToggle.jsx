import React from 'react';
import styled from 'styled-components';

const CategoryToggle = ({ label = '업종', active, onClick }) => {
  return (
    <Button type="button" onClick={onClick} $active={active} aria-pressed={!!active}>
      {label}
    </Button>
  );
};

export default CategoryToggle;

const Button = styled.button`
  width: clamp(60px, 20vw, 72px);
  height: clamp(30px, 7vh, 36px);
  padding: clamp(3px, 1vw, 5px) clamp(12px, 4vw, 18px);
  border-radius: clamp(12px, 3vw, 16px);
  border: 1px solid ${props => props.$active ? '#DA2538' : '#CCC'};
  background: #fff;
  color: ${props => props.$active ? '#DA2538' : '#666'};
  font-size: clamp(13px, 4vw, 15px);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover { background: #f8f8f8; }
`;

