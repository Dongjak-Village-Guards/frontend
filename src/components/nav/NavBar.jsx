import styled from "styled-components";
import { AiFillHome, AiFillHeart, AiFillCalendar } from "react-icons/ai";
import { MdPerson } from "react-icons/md";

export default function NavBar({ current = "home", onSelect }) {
  // 나중에 onSelect에 따라 페이지 전환 (state로 연동)
  return (
    <NavBarWrapper>
      <NavItem active={current === "home"} onClick={() => onSelect?.("home")}>
        <NavIcon active={current === "home"}>
          <AiFillHome size={32} color={current === "home" ? "#DA2538" : "#4F4F4F"} />
        </NavIcon>

        <NavText active={current === "home"}>홈</NavText>
      </NavItem>

      <NavItem active={current === "favorites"} onClick={() => onSelect?.("favorites")}>
        <NavIcon active={current === "favorites"}>
          <AiFillHeart size={32} color={current === "favorites" ? "#DA2538" : "#4F4F4F"} />
        </NavIcon>

        <NavText active={current === "favorites"}>찜</NavText>
      </NavItem>

      <NavItem active={current === "history"} onClick={() => onSelect?.("history")}>
        <NavIcon active={current === "history"}>
          <AiFillCalendar size={32} color={current === "history" ? "#DA2538" : "#4F4F4F"} />
        </NavIcon>

        <NavText active={current === "history"}>일정</NavText>
      </NavItem>

      <NavItem active={current === "mypage"} onClick={() => onSelect?.("mypage")}>
        <NavIcon active={current === "mypage"}>
          <MdPerson size={32} color={current === "mypage" ? "#DA2538" : "#4F4F4F"} />
        </NavIcon>

        <NavText active={current === "mypage"}>MY</NavText>
      </NavItem>
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