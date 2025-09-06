import { create } from 'zustand';
import {
  participateChallenge,
  getParticipatingChallenges,
} from '../api/storedetail/challengeRegistration';

const useChallengeStore = create((set, get) => ({
  // 상태
  participatingChallenges: [], // 참여중인 챌린지 목록
  challengeData: new Map(), // challengeId를 키로 하는 챌린지 데이터 맵
  isLoading: false,
  lastFetched: null,

  // 특정 챌린지 참여 여부 확인
  isParticipating: (challengeId) => {
    const challenges = get().participatingChallenges;
    return challenges.some(
      (challenge) => challenge.challengeId === parseInt(challengeId)
    );
  },

  // 특정 챌린지 데이터 가져오기
  getChallengeData: (challengeId) => {
    return get().challengeData.get(parseInt(challengeId)) || null;
  },

  // 참여중인 챌린지 목록 새로고침
  refreshParticipatingChallenges: async () => {
    set({ isLoading: true });

    try {
      const response = await getParticipatingChallenges();

      if (response.success) {
        const challenges = response.data;
        const challengeMap = new Map();

        // Map으로 변환하여 빠른 조회 가능
        challenges.forEach((challenge) => {
          challengeMap.set(challenge.challengeId, challenge);
        });

        set({
          participatingChallenges: challenges,
          challengeData: challengeMap,
          lastFetched: new Date(),
          isLoading: false,
        });

        return challenges;
      }
    } catch (error) {
      console.error('참여중인 챌린지 조회 실패:', error);

      // API 실패 시 localStorage 폴백
      try {
        const localData = JSON.parse(
          localStorage.getItem('participatingChallenges') || '[]'
        );
        const challengeMap = new Map();

        localData.forEach((challenge) => {
          challengeMap.set(challenge.challengeId, challenge);
        });

        set({
          participatingChallenges: localData,
          challengeData: challengeMap,
          isLoading: false,
        });

        return localData;
      } catch (localError) {
        console.error('localStorage 데이터 파싱 실패:', localError);
        set({ isLoading: false });
        return [];
      }
    }
  },

  // 챌린지 참여하기
  participateInChallenge: async (challengeId, storeId, formData) => {
    set({ isLoading: true });

    try {
      const response = await participateChallenge(challengeId, formData);

      if (response.success) {
        // 성공 시 참여중인 챌린지 목록 새로고침
        await get().refreshParticipatingChallenges();

        // localStorage에도 백업 저장
        const challenges = get().participatingChallenges;
        localStorage.setItem(
          'participatingChallenges',
          JSON.stringify(challenges)
        );

        set({ isLoading: false });
        return { success: true, message: '챌린지 등록이 완료되었습니다!' };
      }
    } catch (error) {
      console.error('챌린지 참여 실패:', error);

      // 409 에러 (이미 참여중) 처리
      if (error.response?.status === 409) {
        // 이미 참여중이므로 데이터 새로고침
        await get().refreshParticipatingChallenges();
        set({ isLoading: false });
        return {
          success: true,
          message: '이미 참여중인 챌린지입니다. 참여 상태를 업데이트했습니다!',
        };
      }

      set({ isLoading: false });
      const errorMessage =
        error.response?.data?.message || '챌린지 등록 중 오류가 발생했습니다.';
      return { success: false, message: errorMessage };
    }
  },

  // 특정 챌린지 데이터만 업데이트 (결제 후 진행률 업데이트 등에 사용)
  updateChallengeProgress: (challengeId, newProgress) => {
    set((state) => {
      const newChallengeData = new Map(state.challengeData);
      const existingChallenge = newChallengeData.get(parseInt(challengeId));

      if (existingChallenge) {
        newChallengeData.set(parseInt(challengeId), {
          ...existingChallenge,
          currentOrderCount: newProgress,
        });
      }

      return { challengeData: newChallengeData };
    });
  },

  // 캐시 유효성 검사 (5분 이내 데이터는 재사용)
  isCacheValid: () => {
    const lastFetched = get().lastFetched;
    if (!lastFetched) return false;

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastFetched > fiveMinutesAgo;
  },
}));

export default useChallengeStore;
