import React, { useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as SearchIcon } from '../../assets/images/search.svg';
import { fetchAddressResults } from '../../apis/addressAPI';
import Spinner from '../common/Spinner';

const Search = () => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setHasSearched(true);
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetchAddressResults(keyword);
      setResults(res);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchWrapper>
      <SearchBar>
        <input
          type='text'
          placeholder='도로명 또는 건물명으로 검색'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <SearchIcon className='search-icon' onClick={handleSearch} />
      </SearchBar>

      {loading && hasSearched && <Spinner />}
      {!loading && !error && hasSearched && results.length === 0 && <NoResult>검색 결과가 없어요</NoResult>}

      <ResultContainer>
        {results.map((item, index) => (
          <ResultItem key={index}>
            {item.roadAddr} ({item.zipNo})
          </ResultItem>
        ))}
      </ResultContainer>
    </SearchWrapper>
  )
}

export default Search

const SearchWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SearchBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 328px;
  height: 48px;
  border-radius: 16px;
  border: 1px solid #737373;
  margin-bottom: 16px;

  input {
    width: 100%;
    padding: 0;
    margin-left: 16px;
    border: none;
    outline: none;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    color: #000;
  }

  .search-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    margin-right: 16px;
    cursor: pointer;
  }
`
/*
const LoadingSpinner = styled.div`
  position: relative;
  top: 108px;
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
`
*/

const NoResult = styled.div`
  position: relative;
  top: 108px;
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
`

const ResultContainer = styled.ul`
  width: 100%;
  max-width: 328px;
  list-style: none;
  padding: 0;
  margin: 0;
`

const ResultItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-bottom: 1px solid #ccc;

  color: #000;
  font-variant-numeric: lining-nums tabular-nums;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  padding: 10px 16px;
  box-sizing: border-box;
  min-height: 50px;
  white-space: normal;
  word-break: break-word;
`