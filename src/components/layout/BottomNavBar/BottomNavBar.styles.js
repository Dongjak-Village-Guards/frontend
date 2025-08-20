import styled from "styled-components";

export const NavBarWrapper = styled.nav`
  position: absolute;
  left: 0; right: 0; bottom: 0;
  display: flex;
  width: 100%;
  height: 52px;
  padding: 0 24px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  border-top: 2px solid #DA2538;
  background: #FFF;
  z-index: 20;
`;

export const NavItem = styled.button`
  background: none;
  border: none;
  outline: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0px;
  cursor: pointer;
  transition: color 0.2s ease;
`;

export const NavIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
`;

export const NavText = styled.span`
  font-size: 10px;
  color: ${props => props.active ? "#DA2538" : "#4F4F4F"};
  font-weight: 500;
`; 