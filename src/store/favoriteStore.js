//favoriteStore.js
import { create } from 'zustand';
import { toggleStoreSubscription } from '../api/storedetail/subscription'; // 실제 경로 확인

const useFavoriteStore = create((set, get) => ({
  // [수정] 찜한 가게의 ID를 Map 객체로 직접 관리합니다.
  subscribedStores: new Map(),

  loadingStores: new Set(),

  // [삭제] 매번 새로운 Set을 생성하는 getter를 제거합니다.
  /*
  get favoriteShopIds() {
    return new Set(this.subscribedStores.keys());
  },
  */

  isStoreSubscribed: (storeId) => {
    return get().subscribedStores.has(String(storeId));
  },

  isStoreLoading: (storeId) => {
    return get().loadingStores.has(String(storeId));
  },

  setStoreSubscription: (storeId, isSubscribed) => {
    set((state) => {
      const newSubscribedStores = new Map(state.subscribedStores);
      if (isSubscribed) {
        newSubscribedStores.set(String(storeId), true);
      } else {
        newSubscribedStores.delete(String(storeId));
      }
      // [수정] 새로운 Map 객체를 반환하여 상태 변경을 감지하게 합니다.
      return { subscribedStores: newSubscribedStores };
    });
  },

  toggleSubscription: async (storeId, currentState) => {
    const storeIdStr = String(storeId);

    // [수정] get()을 통해 최신 상태를 가져옵니다.
    const isCurrentlySubscribed =
      currentState !== null
        ? currentState
        : get().subscribedStores.has(storeIdStr);

    set((state) => ({
      loadingStores: new Set([...state.loadingStores, storeIdStr]),
    }));

    try {
      // 낙관적 업데이트
      set((state) => {
        const newSubscribedStores = new Map(state.subscribedStores);
        if (isCurrentlySubscribed) {
          newSubscribedStores.delete(storeIdStr);
        } else {
          newSubscribedStores.set(storeIdStr, true);
        }
        return { subscribedStores: newSubscribedStores };
      });

      await toggleStoreSubscription(storeId, isCurrentlySubscribed);
    } catch (error) {
      // 롤백 로직... (기존 코드 유지)
      set((state) => {
        const newSubscribedStores = new Map(state.subscribedStores);
        if (isCurrentlySubscribed) {
          newSubscribedStores.set(storeIdStr, true);
        } else {
          newSubscribedStores.delete(storeIdStr);
        }
        return { subscribedStores: newSubscribedStores };
      });
      throw error;
    } finally {
      // 로딩 상태 해제... (기존 코드 유지)
      set((state) => {
        const newLoadingStores = new Set(state.loadingStores);
        newLoadingStores.delete(storeIdStr);
        return { loadingStores: newLoadingStores };
      });
    }
  },

  // 찜 목록을 일괄로 초기화하는 함수 (페이지 새로고침 시 사용)
  initializeSubscriptions: (subscribedStoreIds) => {
    const newSubscribedStores = new Map();
    subscribedStoreIds.forEach((storeId) => {
      newSubscribedStores.set(String(storeId), true);
    });
    set({ subscribedStores: newSubscribedStores });
  },

  // 전체 찜 목록 초기화
  clearSubscriptions: () => {
    set({ subscribedStores: new Map(), loadingStores: new Set() });
  },
}));

export default useFavoriteStore;
