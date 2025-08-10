/**
 * 홈 화면에 표시할 가게 목록 데이터를 mock으로 임시 제공
 * A 미용실과 B 미용실을 추가함
 * menu는 menus에서 discountRate가 가장 높은 메뉴의 name으로 설정
 */
export const STORES_DATA = [
    {
      id: 1,
      name: "우리동네 치킨집",
      menu: "후라이드 치킨",
      distance: 150,
      walkTime: 3,
      image: "/assets/images/friedchicken.png",
      isLiked: false,
      hasDesigners: false,
      menus: [
        {
          id: "menu1",
          name: "후라이드 치킨",
          discountRate: 17,
          originalPrice: 18000,
          discountPrice: 15000,
          isReserved: false,
        },
        {
          id: "menu2",
          name: "양념 치킨",
          discountRate: 10,
          originalPrice: 20000,
          discountPrice: 18000,
          isReserved: false,
        },
      ],
      designers: [],
    },
    {
      id: 2,
      name: "맛있는 피자집",
      menu: "페퍼로니 피자",
      distance: 200,
      walkTime: 4,
      image: "/assets/images/pizza.png",
      isLiked: true,
      hasDesigners: false,
      menus: [
        {
          id: "menu1",
          name: "페퍼로니 피자",
          discountRate: 20,
          originalPrice: 25000,
          discountPrice: 20000,
          isReserved: false,
        },
        {
          id: "menu2",
          name: "치즈 피자",
          discountRate: 15,
          originalPrice: 22000,
          discountPrice: 18700,
          isReserved: false,
        },
      ],
      designers: [],
    },
    {
      id: 3,
      name: "신선한 샐러드",
      menu: "닭가슴살 샐러드",
      distance: 100,
      walkTime: 2,
      image: "/assets/images/salad.png",
      isLiked: false,
      hasDesigners: false,
      menus: [
        {
          id: "menu1",
          name: "닭가슴살 샐러드",
          discountRate: 25,
          originalPrice: 12000,
          discountPrice: 9000,
          isReserved: false,
        },
        {
          id: "menu2",
          name: "연어 샐러드",
          discountRate: 20,
          originalPrice: 15000,
          discountPrice: 12000,
          isReserved: false,
        },
      ],
      designers: [],
    },
    {
      id: 4,
      name: "고급 스테이크하우스",
      menu: "립 스테이크",
      distance: 300,
      walkTime: 6,
      image: "/assets/images/steak.png",
      isLiked: false,
      menus: [
        {
          id: "menu1",
          name: "립 스테이크",
          discountRate: 22,
          originalPrice: 45000,
          discountPrice: 35000,
          isReserved: false,
        },
        {
          id: "menu2",
          name: "등심 스테이크",
          discountRate: 18,
          originalPrice: 40000,
          discountPrice: 32800,
          isReserved: false,
        },
      ],
      designers: [],
    },
    {
      id: 5,
      name: "전통 한식당",
      menu: "불고기",
      distance: 180,
      walkTime: 4,
      image: "/assets/images/korean.png",
      isLiked: true,
      hasDesigners: false,
      menus: [
        {
          id: "menu1",
          name: "불고기",
          discountRate: 20,
          originalPrice: 15000,
          discountPrice: 12000,
          isReserved: false,
        },
        {
          id: "menu2",
          name: "갈비찜",
          discountRate: 15,
          originalPrice: 18000,
          discountPrice: 15300,
          isReserved: false,
        },
      ],
      designers: [],
    },
    {
      id: 6,
      name: "A 미용실",
      menu: "제품명",
      distance: 255,
      walkTime: 3,
      image: "/assets/images/hair.png",
      isLiked: false,
      hasDesigners: false,
      menus: [
        {
            id: "menu1",
            name: "제품명",
            discountRate: 10,
            originalPrice: 100000,
            discountPrice: 99000,
            isReserved: false,
        },
        {
            id: "menu2",
            name: "제품명",
            discountRate: 99,
            originalPrice: 100000,
            discountPrice: 1000,
            isReserved: true,
        },
        {
            id: "menu3",
            name: "제품명",
            discountRate: 55,
            originalPrice: 100000,
            discountPrice: 45000,
            isReserved: false,
        },
        {
            id: "menu4",
            name: "제품명",
            discountRate: 50,
            originalPrice: 100000,
            discountPrice: 50000,
            isReserved: false,
        },
      ],
      designers: [],
    },
    {
      id: 7,
      name: "B 미용실",
      menu: "아이돌 펌",
      distance: 260,
      walkTime: 4,
      image: "/assets/images/hair.png",
      isLiked: false,
      hasDesigners: true,
      menus: [],
      designers: [
        {
          id: "designer1",
          name: "A 디자이너",
          menus: [
              {
                  id: "menu1",
                  name: "남성 컷",
                  discountRate: 30,
                  originalPrice: 30000,
                  discountPrice: 21000,
                  isReserved: false,
              },
              {
                  id: "menu2",
                  name: "아이돌 펌",
                  discountRate: 50,
                  originalPrice: 100000,
                  discountPrice: 50000,
                  isReserved: true,
              },
          ],
        },
        {
          id: "designer2",
          name: "B 디자이너",
          menus: [
            {
              id: "menu3",
              name: "다운 펌",
              discountRate: 45,
              originalPrice: 100000,
              discountPrice: 55000,
              isReserved: true,
            },
          ],
        },
      ],
    },
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