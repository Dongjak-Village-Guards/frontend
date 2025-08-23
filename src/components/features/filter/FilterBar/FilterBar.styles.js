import styled from "styled-components";

// 임시 반응형 테스트 코드
export const FilterRow = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 15;
  margin: 0px 0px 16px 0px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  transition: all 0.3s ease;
  width: 100%;
  
  /* 데스크톱에서는 주소바 높이만큼 top 값 조정 */
  @media (min-width: 769px) {
    top: 60px; /* 주소바 높이에 맞춰 조정 */
  }
  
  /* 모바일에서는 바로 붙도록 */
  @media (max-width: 500px) {
    top: 0;
  }
  
  transform: translateZ(0);
  will-change: transform;
`;

export const FilterTab = styled.button`
  padding: 5px 18px;
  border-radius: 20px;
  border: 1px solid #DA2538;
  background: ${props => props.active ? "#DA2538" : "#fff"};
  color: ${props => props.active ? "#fff" : "#DA2538"};
  font-size: 15px;
  font-size: 30px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? "#DA2538" : "#f8f8f8"};
  }
`;

export const FilterSelect = styled.select`
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 5px 10px;
  cursor: pointer;
`;