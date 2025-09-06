import axiosInstance from '../auth/axiosInstance';

// 특정 매장의 챌린지 목록 조회
export const getStoreChallenges = async (storeId) => {
  try {
    const response = await axiosInstance.get(
      `/api/owner/challenges/store/${storeId}`
    );
    return response.data;
  } catch (error) {
    console.error('챌린지 목록 조회 실패:', error);
    throw error;
  }
};
