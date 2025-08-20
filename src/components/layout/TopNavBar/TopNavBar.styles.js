import styled from 'styled-components';

export const FixedHeader = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
`;

export const TopSpacer = styled.div`
//  height: 44px;
  background: #fff;
`;

export const NavBar = styled.div`
  padding: 16px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
//  width: 100px;
  gap: 4px;
//  margin-bottom: 16px; // 임시...
`;

export const NavButtonArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  height: 40px;
  transition: color 0.2s;

  .back-button {
    color: #000;
    transition: color 0.2s;
    vertical-align: middle;
  }
  &:hover .back-button {
    color: #DA2538;
  }
  &:hover h1 {
    color: #DA2538;
  }
`;

export const NavTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: #000;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  line-height: 1;
`; 