import React, { useState } from 'react';
import { fetchAddressResults } from '../../../apis/addressAPI';
import styled from 'styled-components';

const AddressValidator = () => {
  const [addresses, setAddresses] = useState('');
  const [validationResults, setValidationResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // 주소 목록 검증 함수
  const validateAddresses = async () => {
    if (!addresses.trim()) {
      alert('주소를 입력해주세요.');
      return;
    }

    // 줄바꿈으로 주소 분리
    const addressList = addresses
      .split('\n')
      .map(addr => addr.trim())
      .filter(addr => addr.length > 0);

    if (addressList.length === 0) {
      alert('유효한 주소가 없습니다.');
      return;
    }

    setIsLoading(true);
    setProgress({ current: 0, total: addressList.length });
    setValidationResults([]);

    const results = [];

    for (let i = 0; i < addressList.length; i++) {
      const address = addressList[i];
      
      try {
        const searchResults = await fetchAddressResults(address);
        
        results.push({
          address: address,
          isValid: searchResults.length > 0,
          results: searchResults,
          resultCount: searchResults.length
        });

        setProgress({ current: i + 1, total: addressList.length });
        
        // API 호출 간격 조절 (서버 부하 방지)
        if (i < addressList.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        results.push({
          address: address,
          isValid: false,
          results: [],
          resultCount: 0,
          error: error.message
        });
      }
    }

    setValidationResults(results);
    setIsLoading(false);
    setProgress({ current: 0, total: 0 });
  };

  // 개별 주소 검증 함수
  const validateSingleAddress = async (address) => {
    try {
      const results = await fetchAddressResults(address);
      return {
        address: address,
        isValid: results.length > 0,
        results: results,
        resultCount: results.length
      };
    } catch (error) {
      return {
        address: address,
        isValid: false,
        results: [],
        resultCount: 0,
        error: error.message
      };
    }
  };

  return (
    <Container>
      <Title>주소 목록 검증 크롤링 테스트</Title>
      
      <InputSection>
        <InputLabel>검증할 주소 목록 (줄바꿈으로 구분):</InputLabel>
        <AddressTextarea
          value={addresses}
          onChange={(e) => setAddresses(e.target.value)}
          placeholder="도로명주소를 줄바꿈으로 구분하여 입력하세요&#10;예시:&#10;강남대로 123&#10;서울특별시 강남구 테헤란로 123&#10;부산광역시 해운대구 해운대로 264"
          rows={10}
        />
        <ButtonGroup>
          <ValidateButton onClick={validateAddresses} disabled={isLoading}>
            {isLoading ? `검증 중... (${progress.current}/${progress.total})` : '전체 검증하기'}
          </ValidateButton>
          <ClearButton onClick={() => {
            setAddresses('');
            setValidationResults([]);
          }}>
            초기화
          </ClearButton>
        </ButtonGroup>
      </InputSection>

      {isLoading && (
        <ProgressSection>
          <ProgressBar>
            <ProgressFill progress={(progress.current / progress.total) * 100} />
          </ProgressBar>
          <ProgressText>{progress.current} / {progress.total} 검증 완료</ProgressText>
        </ProgressSection>
      )}

      {validationResults.length > 0 && (
        <ResultsSection>
          <ResultsHeader>
            <ResultsTitle>검증 결과 ({validationResults.length}개)</ResultsTitle>
            <SummaryStats>
              <StatItem>
                <StatLabel>유효한 주소:</StatLabel>
                <StatValue valid={true}>
                  {validationResults.filter(r => r.isValid).length}개
                </StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>유효하지 않은 주소:</StatLabel>
                <StatValue valid={false}>
                  {validationResults.filter(r => !r.isValid).length}개
                </StatValue>
              </StatItem>
            </SummaryStats>
          </ResultsHeader>
          
          <ResultsList>
            {validationResults.map((result, index) => (
              <ResultItem key={index} isValid={result.isValid}>
                <ResultHeader>
                  <ResultStatus isValid={result.isValid}>
                    {result.isValid ? '✅' : '❌'}
                  </ResultStatus>
                  <ResultAddress>{result.address}</ResultAddress>
                  <ResultCount>
                    {result.isValid ? `${result.resultCount}개 결과` : '결과 없음'}
                  </ResultCount>
                </ResultHeader>
                
                {result.isValid && result.results.length > 0 && (
                  <ResultDetails>
                    {result.results.slice(0, 3).map((detail, detailIndex) => (
                      <DetailItem key={detailIndex}>
                        <DetailAddress>{detail.roadAddr}</DetailAddress>
                        <DetailInfo>
                          <DetailText>지번: {detail.jibunAddr}</DetailText>
                          <DetailText>우편번호: {detail.zipNo}</DetailText>
                          <DetailText>시도: {detail.sido}</DetailText>
                          <DetailText>시군구: {detail.sigungu}</DetailText>
                        </DetailInfo>
                      </DetailItem>
                    ))}
                    {result.results.length > 3 && (
                      <MoreResults>... 외 {result.results.length - 3}개 더</MoreResults>
                    )}
                  </ResultDetails>
                )}
                
                {!result.isValid && result.error && (
                  <ErrorMessage>오류: {result.error}</ErrorMessage>
                )}
              </ResultItem>
            ))}
          </ResultsList>
        </ResultsSection>
      )}
    </Container>
  );
};

export default AddressValidator;

// ===== Styled Components ===== //

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: Pretendard;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
`;

const InputSection = styled.div`
  margin-bottom: 30px;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
`;

const AddressTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 15px;
  resize: vertical;
  min-height: 200px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #DA2538;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const ValidateButton = styled.button`
  background: #DA2538;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  flex: 1;
  
  &:hover {
    background: #b91c2e;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ClearButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #5a6268;
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
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
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
  margin-top: 30px;
`;

const ResultsHeader = styled.div`
  margin-bottom: 20px;
`;

const ResultsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
`;

const SummaryStats = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

const StatValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.valid ? '#28a745' : '#dc3545'};
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ResultItem = styled.div`
  padding: 20px;
  border: 1px solid ${props => props.isValid ? '#d4edda' : '#f8d7da'};
  border-radius: 8px;
  background: ${props => props.isValid ? '#f8fff9' : '#fff8f8'};
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
`;

const ResultStatus = styled.div`
  font-size: 20px;
  color: ${props => props.isValid ? '#28a745' : '#dc3545'};
`;

const ResultAddress = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
`;

const ResultCount = styled.div`
  font-size: 14px;
  color: #666;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
`;

const ResultDetails = styled.div`
  margin-top: 15px;
`;

const DetailItem = styled.div`
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  margin-bottom: 10px;
`;

const DetailAddress = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const DetailInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 6px;
`;

const DetailText = styled.div`
  font-size: 12px;
  color: #666;
`;

const MoreResults = styled.div`
  font-size: 14px;
  color: #666;
  text-align: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
`;

const ErrorMessage = styled.div`
  font-size: 14px;
  color: #dc3545;
  background: #f8d7da;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
`; 