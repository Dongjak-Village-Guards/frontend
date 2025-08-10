// 임시 매장 데이터
export const STORES_DATA = [
    {
      id: 1,
      name: "우리동네 치킨집",
      menu: "후라이드 치킨, 양념치킨",
      distance: 150,
      walkTime: 3,
      originalPrice: 18000,
      discountPrice: 15000,
      discountRate: 17,
      image: "/assets/friedchicken.jpg",
      isLiked: false
    },
    {
      id: 2,
      name: "맛있는 피자집",
      menu: "페퍼로니 피자, 치즈 피자",
      distance: 200,
      walkTime: 4,
      originalPrice: 25000,
      discountPrice: 20000,
      discountRate: 20,
      image: null,
      isLiked: true
    },
    {
      id: 3,
      name: "신선한 샐러드",
      menu: "닭가슴살 샐러드, 연어 샐러드",
      distance: 100,
      walkTime: 2,
      originalPrice: 12000,
      discountPrice: 9000,
      discountRate: 25,
      image: "/assets/salad.jpg",
      isLiked: false
    },
    {
      id: 4,
      name: "고급 스테이크하우스",
      menu: "립 스테이크, 등심 스테이크",
      distance: 300,
      walkTime: 6,
      originalPrice: 45000,
      discountPrice: 35000,
      discountRate: 22,
      image: "/assets/steak.jpg",
      isLiked: false
    },
    {
      id: 5,
      name: "전통 한식당",
      menu: "불고기, 갈비찜",
      distance: 180,
      walkTime: 4,
      originalPrice: 15000,
      discountPrice: 12000,
      discountRate: 20,
      image: "/assets/korean.jpg",
      isLiked: true
    }
  ];
  
  // 배너 데이터
  export const BANNER_DATA = {
    image: "/assets/nail-banner.jpg",
    subtitle: "꾸미기 딱 좋은 날 ♥",
    title: "우리동네 네일샵<br />최대 50% 할인!",
    onClick: () => console.log("배너 클릭")
  };
  
  // 주소 데이터
  export const ADDRESS_DATA = "마포구 사천로 24길";
  
  // 필터 옵션 데이터
  export const SORT_OPTIONS = [
    { value: "discount", label: "할인율순" },
    { value: "distance", label: "거리순" },
    { value: "price", label: "가격순" },
    { value: "rating", label: "평점순" }
  ];

  // 업종 목록 데이터
  export const CATEGORY_OPTIONS = [
    { value: "hair", label: "미용실" },
    { value: "nail", label: "네일샵" },
    { value: "pilates", label: "필라테스" }
  ]; 