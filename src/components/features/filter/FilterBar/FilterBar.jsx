import React from "react";
import { FilterRow, FilterTab, FilterSelect } from './FilterBar.styles';

const FilterBar = ({ activeFilter, onFilterChange, sortOptions, onSortChange }) => {
  return (
    <FilterRow>
      <FilterTab 
        active={activeFilter === 'time'} 
        onClick={() => onFilterChange('time')}
      >
        시간순==
      </FilterTab>

      <FilterTab 
        active={activeFilter === 'category'} 
        onClick={() => onFilterChange('category')}
      >
        업종
      </FilterTab>

      <FilterSelect onChange={(e) => onSortChange(e.target.value)}>
        {sortOptions.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </FilterSelect>
    </FilterRow>
  );
};

export default FilterBar; 