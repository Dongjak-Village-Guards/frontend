import { AiFillHome, AiFillHeart, AiFillCalendar } from "react-icons/ai";
import { MdPerson } from "react-icons/md";
import {
  NavBarWrapper,
  NavItem,
  NavIcon,
  NavText
} from './BottomNavBar.styles';

export default function BottomNavBar({ current = "home", onSelect }) {
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
} 