import { create } from 'zustand';
import { toggleStoreSubscription } from '../api/storedetail/subscription';

const useFavoriteStore = create((set, get) => ({
  // 구독한 가게들의 정보를 Map으로 저장 (ID -> 구독 상태)
  subscribedStores: new Map(),

  // 로딩 상태 관리
  loadingStores: new Set(),

  // 레거시 호환성을 위한 favoriteShopIds (기존 코드와 호환)
  get favoriteShopIds() {
    return new Set(this.subscribedStores.keys());
  },

  // 구독 상태 확인
  isStoreSubscribed: (storeId) => {
    const state = get();
    return state.subscribedStores.has(String(storeId));
  },

  // 특정 가게의 로딩 상태 확인
  isStoreLoading: (storeId) => {
    const state = get();
    return state.loadingStores.has(String(storeId));
  },

  // 구독 상태 설정 (API에서 받아온 초기 데이터용)
  setStoreSubscription: (storeId, isSubscribed) => {
    set((state) => {
      const newSubscribedStores = new Map(state.subscribedStores);
      if (isSubscribed) {
        newSubscribedStores.set(String(storeId), true);
      } else {
        newSubscribedStores.delete(String(storeId));
      }
      return { subscribedStores: newSubscribedStores };
    });
  },

  // 구독 상태 토글 (API 호출 포함)
  toggleSubscription: async (storeId, currentState = null) => {
    const state = get();
    const storeIdStr = String(storeId);

    // 현재 상태 확인 (파라미터로 받거나 Store에서 조회)
    const isCurrentlySubscribed =
      currentState !== null
        ? currentState
        : state.subscribedStores.has(storeIdStr);

    // 로딩 상태 설정
    set((state) => ({
      loadingStores: new Set([...state.loadingStores, storeIdStr]),
    }));

    try {
      // 낙관적 업데이트 - UI 먼저 변경
      set((state) => {
        const newSubscribedStores = new Map(state.subscribedStores);
        if (isCurrentlySubscribed) {
          newSubscribedStores.delete(storeIdStr);
        } else {
          newSubscribedStores.set(storeIdStr, true);
        }
        return { subscribedStores: newSubscribedStores };
      });

      // API 호출
      await toggleStoreSubscription(storeId, isCurrentlySubscribed);
    } catch (error) {
      console.error('구독 상태 변경 실패:', error);

      // 에러 시 원래 상태로 롤백
      set((state) => {
        const newSubscribedStores = new Map(state.subscribedStores);
        if (isCurrentlySubscribed) {
          newSubscribedStores.set(storeIdStr, true);
        } else {
          newSubscribedStores.delete(storeIdStr);
        }
        return { subscribedStores: newSubscribedStores };
      });

      // 사용자에게 에러 알림
      throw error;
    } finally {
      // 로딩 상태 해제
      set((state) => {
        const newLoadingStores = new Set(state.loadingStores);
        newLoadingStores.delete(storeIdStr);
        return { loadingStores: newLoadingStores };
      });
    }
  },

  // 레거시 호환성을 위한 기존 함수 (기존 코드가 동작하도록)
  toggleFavorite: (shopId) => {
    const state = get();
    const isSubscribed = state.subscribedStores.has(String(shopId));
    return state.toggleSubscription(shopId, isSubscribed);
  },
}));

export default useFavoriteStore;
