import React, { useState, useEffect } from 'react'
import { ReactComponent as SearchIcon } from '../../../../assets/images/search.svg';
import { ReactComponent as CaretLeftIcon } from '../../../../assets/images/AiFillCaretLeft.svg';
import { ReactComponent as CaretRightIcon } from '../../../../assets/images/AiFillCaretRight.svg';
import { fetchAddressResults } from '../../../../apis/addressAPI';
import Spinner from '../../../ui/Spinner/Spinner';
import AddressResultContainer from '../AddressResultContiner/AddressResultContainer';
import useUserInfo from '../../../../hooks/user/useUserInfo';
import useStore from '../../../../hooks/store/useStore';
import {
  SearchWrapper,
  SearchBar,
  SearchFixArea,
  PaginationWrapper,
  PageButton,
  PageNumSpan,
} from './AddressSearch.styles';

const PAGE_SIZE = 7;   // 한 페이지에 보여줄 결과 개수
const BLOCK_SIZE = 5;  // 페이지네이션에 표시할 페이지 개수

const AddressSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ list: [], totalCount: 0 });
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);

  const { setUserAddress } = useUserInfo();
  const { setCurrentPage } = useStore();

  // 전체 페이지 수
  const totalPages = Math.ceil(results.totalCount / PAGE_SIZE);

  // 현재 블록 계산
  const currentBlock = Math.floor((page - 1) / BLOCK_SIZE);
  const startPage = currentBlock * BLOCK_SIZE + 1;
  const endPage = Math.min(startPage + BLOCK_SIZE - 1, totalPages);

  // 검색 실행 (검색 버튼/엔터 눌렀을 때 1페이지부터 시작)
  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setHasSearched(true);
    setPage(1); // 항상 첫 페이지부터
  };

  // page 또는 keyword가 바뀔 때마다 API 호출
  useEffect(() => {
    const fetchData = async () => {
      if (!hasSearched) return;
      setLoading(true);
      setError('');
      try {
        const res = await fetchAddressResults(keyword, page, PAGE_SIZE);
        setResults({
          list: res.results,
          totalCount: res.totalCount,
        });
      } catch (err) {
        setError(err.message);
        setResults({ list: [], totalCount: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [keyword, page, hasSearched]);

  // 주소 선택 시
  const handleAddressSelect = async (address) => {
    try {
      await setUserAddress(address);
      setCurrentPage("home");
    } catch (error) {
      console.error('주소 설정 실패:', error);
      alert('주소 설정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <SearchWrapper>
      <SearchFixArea>
        <SearchBar>
          <input
            type='text'
            placeholder='도로명 또는 건물명으로 검색'
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setHasSearched(false); // 입력 시에는 검색 상태 해제
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <SearchIcon className='search-icon' onClick={handleSearch} />
        </SearchBar>
      </SearchFixArea>
      
      {loading && hasSearched && <Spinner />}
      <AddressResultContainer
        results={results.list}
        loading={loading}
        error={error}
        hasSearched={hasSearched}
        onSelect={handleAddressSelect}
      />

      {/* 페이지네이션 UI */}
      {totalPages > 1 && (
        <PaginationWrapper>
          <PageButton
            onClick={() => setPage(startPage - BLOCK_SIZE)}
            disabled={startPage === 1}
            isCaret
          >
            <CaretLeftIcon style={{ width: 28, height: 28, opacity: startPage === 1 ? 0.5 : 1 }} />
          </PageButton>
          {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
            const pageNum = startPage + idx;
            const isLast = idx === endPage - startPage;
            return (
              <PageButton
                key={pageNum}
                onClick={() => setPage(pageNum)}
                active={pageNum === page ? 1 : 0}
                disabled={pageNum === page}
              >
                <PageNumSpan hasBorder={!isLast}>{pageNum}</PageNumSpan>
              </PageButton>
            );
          })}
          <PageButton
            onClick={() => setPage(startPage + BLOCK_SIZE)}
            disabled={endPage === totalPages}
            isCaret
          >
            <CaretRightIcon style={{ width: 28, height: 28, opacity: endPage === totalPages ? 0.5 : 1 }} />
          </PageButton>
        </PaginationWrapper>
      )}
    </SearchWrapper>
  );
};

export default AddressSearch;