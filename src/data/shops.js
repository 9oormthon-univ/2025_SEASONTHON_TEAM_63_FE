// Foodshop 데이터
export const shopsByFilter = {
    한식: [
        { id: 1, name: '경복궁 한정식', description: '전통의 맛', rating: 4.9, location: '서울시 종로구' },
        { id: 2, name: '토속촌 삼계탕', description: '진한 국물', rating: 4.8, location: '서울시 종로구' },
    ],
    중식: [
        { id: 101, name: '만리장성', description: '정통 중화요리', rating: 4.5, location: '서울시 강남구' },
        { id: 102, name: '홍콩반점', description: '백종원의 짬뽕', rating: 4.4, location: '전국' },
    ],
    일식: [
        { id: 201, name: '스시효', description: '프리미엄 스시', rating: 4.9, location: '서울시 강남구' },
        { id: 202, name: '갓덴스시', description: '회전초밥 맛집', rating: 4.6, location: '서울시 종로구' },
    ],
};

// TrendShop 데이터
export const trendShops = [
    { id: 301, name: '트렌디한 가게 1', description: '요즘 가장 핫한 곳', rating: 4.8, location: '서울시 성동구' },
    { id: 302, name: '인기 많은 가게 2', description: '웨이팅 필수 맛집', rating: 4.9, location: '서울시 마포구' },
];

// CustomizedShop 데이터
export const customizedShops = [
    { id: 401, name: '맞춤 가게 A', description: '당신을 위한 추천', rating: 4.7, location: '서울시 용산구' },
    { id: 402, name: '추천 가게 B', description: '취향저격 맛집', rating: 4.8, location: '서울시 서대문구' },
];

// DiscountShop 데이터
export const discountShops = [
    { id: 501, name: '할인 대박 가게', description: '가성비 최고', rating: 4.5, location: '서울시 관악구' },
    { id: 502, name: '오늘만 이 가격', description: '놓치면 후회!', rating: 4.6, location: '서울시 동작구' },
];

// 모든 가게 데이터를 하나의 Map으로 통합
const allShopsList = [...Object.values(shopsByFilter).flat(), ...trendShops, ...customizedShops, ...discountShops];

export const allShopsMap = new Map(allShopsList.map((shop) => [shop.id, shop]));
