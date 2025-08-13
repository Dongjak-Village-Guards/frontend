import { STORES_DATA, SORT_OPTIONS, CATEGORY_OPTIONS } from "./mock/mockShopList";

export const getStores = async () => {
  return Promise.resolve(STORES_DATA);
};

export const getSortOptions = async () => {
  return Promise.resolve(SORT_OPTIONS);
};

export const getCategoryOptions = async () => {
  return Promise.resolve(CATEGORY_OPTIONS);
};