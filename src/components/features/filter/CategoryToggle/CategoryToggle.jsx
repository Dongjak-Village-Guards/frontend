import React from 'react';
import { Button } from './CategoryToggle.styles';

const CategoryToggle = ({ label = '업종', active, onClick }) => {
  return (
    <Button type="button" onClick={onClick} $active={active} aria-pressed={!!active}>
      <span>{label}</span>
    </Button>
  );
};

export default CategoryToggle; 