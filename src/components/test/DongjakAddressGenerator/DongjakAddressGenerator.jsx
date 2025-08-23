import React, { useState } from 'react';
import { fetchAddressResults, getCachedResults, clearCache } from '../../../apis/addressAPI';
import styled from 'styled-components';

const DongjakAddressGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 176 });
  const [generatedAddresses, setGeneratedAddresses] = useState([]);
  const [searchLog, setSearchLog] = useState([]);

  // 동작구 관련 키워드들
  const dongjakKeywords = [
    '동작구', '동작', '사당', '대방', '신대방', '상도', '상도동', '노량진', '노량진동',
    '본동', '흑석', '흑석동', '동작대로', '사당로', '대방로', '신대방로', '상도로',
    '노량진로', '흑석로', '동작구 사당', '동작구 대방', '동작구 신대방', '동작구 상도',
    '동작구 노량진', '동작구 흑석', '서울 동작구', '서울특별시 동작구'
  ];

  // 랜덤 숫자 생성 (1-999)
  const getRandomNumber = () => Math.floor(Math.random() * 999) + 1;

  // 랜덤 키워드 선택
  const getRandomKeyword = () => {
    return dongjakKeywords[Math.floor(Math.random() * dongjakKeywords.length)];
  };

  // 주소 생성 및 검증
  const generateDongjakAddresses = async () => {
    setIsGenerating(true);
    setProgress({ current: 0, total: 176 });
    setGeneratedAddresses([]);
    setSearchLog([]);

    const addresses = [];
    const log = [];

    // 먼저 캐시된 결과 확인
    const cachedResults = getCachedResults();
    if (cachedResults.length > 0) {
      log.push(`캐시된 결과 발견: ${cachedResults.length}개`);
      console.log(`캐시된 결과 발견: ${cachedResults.length}개`);
      
      // 동작구 주소만 필터링
      const dongjakCached = cachedResults.filter(result => 
        result.sigungu?.includes('동작구') || 
        result.roadAddr?.includes('동작구') ||
        result.jibunAddr?.includes('동작구')
      );
      
      log.push(`캐시된 동작구 주소: ${dongjakCached.length}개`);
      console.log(`캐시된 동작구 주소: ${dongjakCached.length}개`);
      
      // 캐시된 결과에서 176개 선택
      const selectedFromCache = dongjakCached.slice(0, 176);
      selectedFromCache.forEach(result => {
        addresses.push(result.roadAddr);
      });
      
      log.push(`캐시에서 ${selectedFromCache.length}개 주소 선택됨`);
      console.log(`캐시에서 ${selectedFromCache.length}개 주소 선택됨`);
    }

    // 부족한 경우 추가 검색
    const remainingCount = 176 - addresses.length;
    if (remainingCount > 0) {
      log.push(`추가 검색 필요: ${remainingCount}개`);
      console.log(`추가 검색 필요: ${remainingCount}개`);

      for (let i = 0; i < remainingCount; i++) {
        try {
          // 랜덤 키워드와 숫자로 주소 생성
          const keyword = getRandomKeyword();
          const number = getRandomNumber();
          const searchQuery = `${keyword} ${number}`;

          log.push(`추가 검색 ${i + 1}: "${searchQuery}"`);
          console.log(`추가 검색 ${i + 1}: "${searchQuery}"`);

          // API로 주소 검색 (숫자 제거된 키워드로 검색됨)
          const results = await fetchAddressResults(searchQuery);

          if (results.length > 0) {
            // 동작구 주소만 필터링
            const dongjakResults = results.filter(result => 
              result.sigungu?.includes('동작구') || 
              result.roadAddr?.includes('동작구') ||
              result.jibunAddr?.includes('동작구')
            );

            if (dongjakResults.length > 0) {
              // 랜덤하게 하나 선택
              const randomResult = dongjakResults[Math.floor(Math.random() * dongjakResults.length)];
              addresses.push(randomResult.roadAddr);
              log.push(`✅ 성공: ${randomResult.roadAddr}`);
              console.log(`✅ 성공: ${randomResult.roadAddr}`);
            } else {
              log.push(`❌ 동작구 주소 없음`);
              console.log(`❌ 동작구 주소 없음`);
            }
          } else {
            log.push(`❌ 검색 결과 없음`);
            console.log(`❌ 검색 결과 없음`);
          }

          setProgress({ current: addresses.length, total: 176 });
          setSearchLog([...log]);

          // API 호출 간격 조절
          await new Promise(resolve => setTimeout(resolve, 300));

        } catch (error) {
          log.push(`❌ 오류: ${error.message}`);
          console.log(`❌ 오류: ${error.message}`);
          setSearchLog([...log]);
        }
      }
    }

    setGeneratedAddresses(addresses);
    setIsGenerating(false);
    setProgress({ current: 0, total: 176 });
    
    // 최종 캐시 상태 확인
    const finalCachedResults = getCachedResults();
    log.push(`최종 캐시 상태: ${finalCachedResults.length}개 결과`);
    console.log(`최종 캐시 상태: ${finalCachedResults.length}개 결과`);
    
    // 콘솔에 결과 출력
    console.log('=== 동작구 주소 176개 생성 완료 ===');
    console.log('생성된 주소 개수:', addresses.length);
    console.log('dongjak_addresses = [');
    addresses.forEach((address, index) => {
      console.log(`  "${address}",`);
    });
    console.log('];');
    console.log('=== 생성 완료 ===');
  };

  // 결과를 배열 형태로 복사
  const copyToClipboard = () => {
    const addressArray = `dongjak_addresses = [\n${generatedAddresses.map(addr => `  "${addr}"`).join(',\n')}\n];`;
    navigator.clipboard.writeText(addressArray);
    console.log('=== 클립보드에 복사된 배열 ===');
    console.log(addressArray);
    alert('주소 배열이 클립보드에 복사되었습니다!');
  };

  // JSON 형태로 복사
  const copyAsJSON = () => {
    const jsonData = JSON.stringify(generatedAddresses, null, 2);
    navigator.clipboard.writeText(jsonData);
    console.log('=== 클립보드에 복사된 JSON ===');
    console.log(jsonData);
    alert('JSON 형태로 클립보드에 복사되었습니다!');
  };

  // 캐시 초기화
  const handleClearCache = () => {
    clearCache();
    alert('캐시가 초기화되었습니다!');
  };

  // 캐시 상태 확인
  const handleCheckCache = () => {
    const cachedResults = getCachedResults();
    alert(`현재 캐시 상태:\n캐시된 키워드 수: ${cachedResults.length > 0 ? '있음' : '없음'}\n캐시된 총 결과 수: ${cachedResults.length}개`);
  };

  return (
    <Container>
      <Title>동작구 주소 176개 생성기</Title>
      
      <Description>
        동작구 내 유효한 주소 176개를 랜덤으로 생성합니다.
        <br />
        기존 주소 API를 활용하여 실제 존재하는 주소만 수집합니다.
      </Description>

      <ButtonSection>
        <GenerateButton 
          onClick={generateDongjakAddresses} 
          disabled={isGenerating}
        >
          {isGenerating ? `생성 중... (${progress.current}/${progress.total})` : '동작구 주소 176개 생성'}
        </GenerateButton>
        
        <CacheButtons>
          <CacheButton onClick={handleCheckCache}>
            캐시 상태 확인
          </CacheButton>
          <CacheButton onClick={handleClearCache} style={{ backgroundColor: '#dc3545' }}>
            캐시 초기화
          </CacheButton>
        </CacheButtons>
      </ButtonSection>

      {isGenerating && (
        <ProgressSection>
          <ProgressBar>
            <ProgressFill progress={(progress.current / progress.total) * 100} />
          </ProgressBar>
          <ProgressText>{progress.current} / {progress.total} 주소 생성 완료</ProgressText>
        </ProgressSection>
      )}

      {generatedAddresses.length > 0 && (
        <ResultsSection>
          <ResultsHeader>
            <ResultsTitle>
              생성된 동작구 주소 ({generatedAddresses.length}개)
            </ResultsTitle>
            <CopyButtons>
              <CopyButton onClick={copyToClipboard}>
                배열 형태로 복사
              </CopyButton>
              <CopyButton onClick={copyAsJSON}>
                JSON 형태로 복사
              </CopyButton>
            </CopyButtons>
          </ResultsHeader>

          <AddressList>
            {generatedAddresses.map((address, index) => (
              <AddressItem key={index}>
                <AddressNumber>{index + 1}.</AddressNumber>
                <AddressText>{address}</AddressText>
              </AddressItem>
            ))}
          </AddressList>

          <ArrayPreview>
            <PreviewTitle>배열 형태 미리보기:</PreviewTitle>
            <PreviewCode>
              {`dongjak_addresses = [\n${generatedAddresses.slice(0, 5).map(addr => `  "${addr}"`).join(',\n')}${generatedAddresses.length > 5 ? ',\n  ...' : ''}\n];`}
            </PreviewCode>
          </ArrayPreview>
        </ResultsSection>
      )}

      {searchLog.length > 0 && (
        <LogSection>
          <LogTitle>검색 로그 (최근 20개)</LogTitle>
          <LogList>
            {searchLog.slice(-20).map((log, index) => (
              <LogItem key={index} isSuccess={log.includes('✅')}>
                {log}
              </LogItem>
            ))}
          </LogList>
        </LogSection>
      )}
    </Container>
  );
};

export default DongjakAddressGenerator;

// ===== Styled Components ===== //

const Container = styled.div`
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  font-family: Pretendard;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const ButtonSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const CacheButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
`;

const CacheButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #5a6268;
  }
`;

const GenerateButton = styled.button`
  background: #DA2538;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #b91c2e;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ProgressSection = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #DA2538;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #DA2538;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 14px;
  color: #666;
  text-align: center;
`;

const ResultsSection = styled.div`
  margin-bottom: 30px;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
`;

const ResultsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const CopyButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const CopyButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #218838;
  }
`;

const AddressList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  margin-bottom: 20px;
`;

const AddressItem = styled.div`
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f8f9fa;
  }
`;

const AddressNumber = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #666;
  min-width: 40px;
`;

const AddressText = styled.div`
  font-size: 14px;
  color: #333;
  flex: 1;
`;

const ArrayPreview = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const PreviewTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
`;

const PreviewCode = styled.pre`
  background: #2d3748;
  color: #e2e8f0;
  padding: 15px;
  border-radius: 6px;
  font-size: 12px;
  overflow-x: auto;
  margin: 0;
`;

const LogSection = styled.div`
  margin-top: 30px;
`;

const LogTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
`;

const LogList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
`;

const LogItem = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 12px;
  color: ${props => props.isSuccess ? '#28a745' : '#666'};
  
  &:last-child {
    border-bottom: none;
  }
`; 