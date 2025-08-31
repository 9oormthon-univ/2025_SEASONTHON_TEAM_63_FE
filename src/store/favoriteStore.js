import { create } from 'zustand';

const useFavoriteStore = create((set) => ({
    favoriteShopIds: new Set(), // 찜한 가게의 ID를 저장

    // 찜 상태를 추가하거나 제거하는 함수
    toggleFavorite: (shopId) =>
        set((state) => {
            const newFavoriteShopIds = new Set(state.favoriteShopIds);
            if (newFavoriteShopIds.has(shopId)) {
                newFavoriteShopIds.delete(shopId); // 이미 있으면 제거
            } else {
                newFavoriteShopIds.add(shopId); // 없으면 추가
            }
            return { favoriteShopIds: newFavoriteShopIds };
        }),
}));

export default useFavoriteStore;
