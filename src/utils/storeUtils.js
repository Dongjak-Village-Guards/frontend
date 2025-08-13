/**
 * 가게 또는 디자이너 메뉴 중 최대 할인율 메뉴 반환
 * @param {Object} store
 * @returns {Object} featuredMenu
 */
export const getFeaturedMenu = (store) => {
  if (store.hasDesigners && store.designers?.length > 0) {
    const allMenus = store.designers.flatMap(d => d.menus || []);
    return allMenus.reduce((prev, curr) => (prev.discountRate > curr.discountRate ? prev : curr), allMenus[0]);
  }
  if (store.menus?.length > 0) {
    return store.menus.reduce((prev, curr) => (prev.discountRate > curr.discountRate ? prev : curr), store.menus[0]);
  }
  return { name: '메뉴 없음', discountRate: 0, originalPrice: 0, discountPrice: 0 };
};

/**
 * 가게 ID에 따른 이미지 반환
 * @param {number} storeId
 * @returns {string} imageSrc
 */
export const getStoreImage = (storeId) => {
  const imageMap = {
    1: 'chicken.png',
    2: 'pizza.png',
    3: 'salad.png',
    4: 'steak.png',
    5: 'korean.png',
    6: 'hair.png',
    7: 'hair.png',
  };
  return require(`../assets/images/${imageMap[storeId] || 'placeholder.png'}`);
};