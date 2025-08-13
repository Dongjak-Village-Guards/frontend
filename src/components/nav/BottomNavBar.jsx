import styled from "styled-components";
import { AiFillHome, AiFillHeart, AiFillCalendar } from "react-icons/ai";
import { MdPerson } from "react-icons/md";

export default function NavBar({ current = "home", onSelect }) {
  const tabs = [
    { key: "home", label: "홈", icon: AiFillHome },
    { key: "favorites", label: "찜", icon: AiFillHeart },
    { key: "history", label: "일정", icon: AiFillCalendar },
    { key: "mypage", label: "MY", icon: MdPerson },
  ];

  // 나중에 onSelect에 따라 페이지 전환 (state로 연동)
  return (
  <NavBarWrapper>
    {tabs.map(({ key, label, icon: Icon }) => (
      <NavItem
        key={key}
        role="tab"
        aria-selected={current === key}
        active={current === key}
        onClick={() => onSelect?.(key)}
      >
        <NavIcon active={current === key}>
          <Icon size={32} color={current === key ? "#DA2538" : "#4F4F4F"} />
        </NavIcon>
        <NavText active={current === key}>{label}</NavText>
      </NavItem>
    ))}
  </NavBarWrapper>
  );
};

// ===== Styled Components ===== //
const NavBarWrapper = styled.nav`
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

const NavItem = styled.button`
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

const NavIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
`;

const NavText = styled.span`
  font-size: 10px;
  color: ${props => props.active ? "#DA2538" : "#4F4F4F"};
  font-weight: 500;
`;