/**
 * 텍스트 길이 제한
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

/**
 * 디자이너 이미지 반환
 * @param {string} imageUrl
 * @returns {string}
 */
export const getDesignerImage = (imageUrl) => {
  return imageUrl || require('../assets/images/designer.png');
};

/**
 * 메뉴 이미지 반환
 * @param {string} imageUrl
 * @returns {string}
 */
export const getMenuImage = (imageUrl) => {
  return imageUrl || require('../assets/images/menu.png');
};