import React from 'react';
import { ResultContainer, ResultItem, NoResult } from './AddressResultContainer.styles';

const AddressResultContainer = ({ results, loading, error, hasSearched, onSelect }) => {
  if (loading && hasSearched) return null; // 로딩 중에는 Spinner만 표시
  if (!loading && !error && hasSearched && results.length === 0)
    return <NoResult>검색 결과가 없어요</NoResult>;

  return (
    <ResultContainer>
      {results.map((item, index) => (
        <ResultItem key={index} onClick={() => onSelect(item)}>
          {item.roadAddr} ({item.zipNo})
        </ResultItem>
      ))}
    </ResultContainer>
  );
};

export default AddressResultContainer;