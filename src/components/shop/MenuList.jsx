/**
 * 다른 메뉴 목록을 표시하는 컴포넌트
 */
import React from 'react'
import MenuCard from './MenuCard'
import styled from 'styled-components'

/**
 * MenuList 컴포넌트
 * @param {Object[]} menus - 메뉴 목록
 * @param {Function} onReserve - 예약 버튼 클릭 시 호출
 */

const MenuList = ({ menus, onReserve }) => {
    const menuList = Array.isArray(menus) ? menus : [];
  return (
    <ListContainer>
        {menuList.length > 0 ? (
            menuList.map(menu => (
                <MenuCard key={menu.id} menu={menu} onReserve={() => onReserve(menu)} />
            ))
        ) : (
            <NoMenus>다른 메뉴가 없습니다.</NoMenus>
        )}
    </ListContainer>
  )
}

export default MenuList

// ===== Styled Components ===== //

/* 메뉴 목록 컨테이너 */
const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

/* 메뉴 없음 메시지 */
const NoMenus = styled.div`
    font-size: clamp(12px, 3.5vw, 14px);
    color: #000;
    text-align: center;
    padding: 16px;
`;