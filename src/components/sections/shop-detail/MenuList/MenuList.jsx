/**
 * 다른 메뉴 목록을 표시하는 컴포넌트
 */

import MenuCard from '../MenuCard/MenuCard';
import { ListContainer, NoMenus } from './MenuList.styles';

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
            menuList.map((menu, index) => (
                <MenuCard 
                    key={menu.menu_id || menu.id || `menu-${index}`} 
                    menu={menu} 
                    onReserve={() => onReserve(menu)} 
                />
            ))
        ) : (
            <NoMenus>다른 메뉴가 없습니다.</NoMenus>
        )}
    </ListContainer>
  );
};

export default MenuList; 