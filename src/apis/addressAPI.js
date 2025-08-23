/**
 * 검색 키워드에서 숫자를 제거하고 동까지만 추출하는 함수
 * @param {string} keyword - 원본 검색 키워드
 * @returns {string} 동까지만 포함된 키워드
 */
const extractDongFromKeyword = (keyword) => {
  console.log('동 추출 시작 - 원본 키워드:', keyword);
  
  // 숫자 제거
  const withoutNumbers = keyword.replace(/\d+/g, '');
  console.log('숫자 제거 후:', withoutNumbers);
  
  // 다양한 동 패턴 찾기
  const patterns = [
    /([가-힣]+동)/,           // 일반적인 동 (노량진동, 상도동)
    /([가-힣]+가)/,           // 가 (신길동, 영등포동)
    /([가-힣]+로)/,           // 로 (도로명)
    /([가-힣]+길)/,           // 길 (도로명)
    /([가-힣]+구)/,           // 구 (영등포구, 강남구)
    /([가-힣]+시)/,           // 시 (서울시, 부산시)
    /([가-힣]+군)/,           // 군
    /([가-힣]+읍)/,           // 읍
    /([가-힣]+면)/            // 면
  ];
  
  for (const pattern of patterns) {
    const match = withoutNumbers.match(pattern);
    if (match) {
      const extracted = match[1];
      console.log(`패턴 매치 성공: ${pattern.source} -> ${extracted}`);
      return extracted;
    }
  }
  
  // 패턴이 없는 경우 숫자만 제거한 결과 반환
  const result = withoutNumbers.trim();
  console.log('패턴 매치 실패, 숫자만 제거한 결과 반환:', result);
  return result;
};

/**
 * 여러 페이지의 결과를 모두 가져오는 함수
 * @param {string} keyword - 검색 키워드
 * @param {number} maxPages - 최대 페이지 수 (기본값: 10페이지 = 300개 결과)
 * @returns {Promise<Array>} 모든 결과
 */
const fetchAllAddressResults = async (keyword, maxPages = 10) => {
  const API_KEY = process.env.REACT_APP_JUSO_API_KEY;
  const allResults = [];
  const targetCount = 176; // 목표 결과 수
  
  console.log(`주소 검색 시작 - 키워드: "${keyword}", 목표: ${targetCount}개, 최대 페이지: ${maxPages}`);
  
  for (let page = 1; page <= maxPages; page++) {
    const url = `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${API_KEY}&currentPage=${page}&countPerPage=30&keyword=${encodeURIComponent(keyword)}&resultType=json`;
    
    try {
      console.log(`페이지 ${page} 요청 중...`);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API 호출 실패 (페이지 ${page})`);
      
      const data = await response.json();
      const results = data.results?.juso || [];
      
      if (results.length === 0) {
        console.log(`페이지 ${page}에서 더 이상 결과가 없습니다.`);
        break;
      }
      
      allResults.push(...results);
      console.log(`페이지 ${page} 결과: ${results.length}개, 누적: ${allResults.length}개`);
      
      // 목표 개수에 도달하면 중단
      if (allResults.length >= targetCount) {
        console.log(`목표 ${targetCount}개에 도달했습니다. (실제: ${allResults.length}개)`);
        break;
      }
      
      // API 호출 간격 조절 (서버 부하 방지)
      if (page < maxPages) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.error(`페이지 ${page} 조회 실패:`, error);
      break;
    }
  }
  
  console.log(`최종 수집 결과: ${allResults.length}개`);
  return allResults;
};

// 전역 변수로 검색 결과 저장소
const searchResultCache = new Map();

export const fetchAddressResults = async (keyword) => {
  // 검색 키워드에서 숫자 제거
  const keywordWithoutNumbers = keyword.replace(/\d+/g, '').trim();
  console.log('원본 키워드:', keyword);
  console.log('숫자 제거 후 키워드:', keywordWithoutNumbers);
  
  // 캐시에 이미 있는지 확인
  if (searchResultCache.has(keywordWithoutNumbers)) {
    console.log(`캐시된 결과 사용: "${keywordWithoutNumbers}"`);
    return searchResultCache.get(keywordWithoutNumbers);
  }
  
  try {
    // 숫자 제거된 키워드로 검색하여 최대 176개 결과 수집
    const results = await fetchAllAddressResults(keywordWithoutNumbers);
    console.log(`수집된 결과: ${results.length}개`);
    
    // 중복 제거 (roadAddr + jibunAddr 기준)
    const uniqueResults = results.filter((result, index, self) => {
      const currentKey = `${result.roadAddr}|${result.jibunAddr}`;
      const firstIndex = self.findIndex(r => 
        `${r.roadAddr}|${r.jibunAddr}` === currentKey
      );
      return index === firstIndex;
    });
    
    console.log(`중복 제거 후 결과: ${uniqueResults.length}개`);
    
    // 결과를 캐시에 저장
    searchResultCache.set(keywordWithoutNumbers, uniqueResults);
    console.log(`캐시에 저장됨: "${keywordWithoutNumbers}" -> ${uniqueResults.length}개 결과`);
    
    // 캐시 상태 로그
    console.log('=== 현재 캐시 상태 ===');
    searchResultCache.forEach((results, key) => {
      console.log(`"${key}": ${results.length}개 결과`);
    });
    console.log('=== 캐시 상태 끝 ===');
    
    return uniqueResults;
  } catch (error) {
    console.error('주소 검색 오류:', error);
    return [];        
  }
};

// 캐시된 결과를 가져오는 함수
export const getCachedResults = () => {
  const allResults = [];
  searchResultCache.forEach((results, keyword) => {
    allResults.push(...results);
  });
  
  // 중복 제거
  const uniqueResults = allResults.filter((result, index, self) => {
    const currentKey = `${result.roadAddr}|${result.jibunAddr}`;
    const firstIndex = self.findIndex(r => 
      `${r.roadAddr}|${r.jibunAddr}` === currentKey
    );
    return index === firstIndex;
  });
  
  console.log('=== 캐시된 모든 결과 ===');
  console.log('캐시된 키워드 수:', searchResultCache.size);
  console.log('캐시된 총 결과 수:', allResults.length);
  console.log('중복 제거 후 결과 수:', uniqueResults.length);
  console.log('=== 캐시 결과 끝 ===');
  
  return uniqueResults;
};

// 캐시 초기화 함수
export const clearCache = () => {
  searchResultCache.clear();
  console.log('캐시가 초기화되었습니다.');
};