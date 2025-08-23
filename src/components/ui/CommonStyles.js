/**
 * 공통 스타일 컴포넌트들
 * 여러 페이지에서 재사용되는 스타일 컴포넌트들을 모아놓은 파일
 */

import styled from 'styled-components';

// 로딩 컨테이너
export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

// 에러 컨테이너
export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  text-align: center;
`;

// 에러 텍스트
export const ErrorText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
`;

// 에러 서브 텍스트
export const ErrorSubText = styled.div`
  font-size: 14px;
  color: #999;
`;

// 구분선
export const Line = styled.div`
  width: 100% - 32px;
  height: 1px;
  background: #e2e4e9;
  margin: 0px 16px;
`;

// 메뉴 섹션
export const MenuSection = styled.div`
  padding: 12px 16px 0px 16px;
`;

// 섹션 제목
export const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  line-height: 14px;
  color: #000;
  margin-bottom: 8px;
`;

// 디자이너 섹션
export const DesignerSection = styled.div`
  padding: 16px;
`; 