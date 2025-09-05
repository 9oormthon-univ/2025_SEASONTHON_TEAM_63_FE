import axiosInstance from '../auth/axiosInstance';

/**
 * 가게 구독(찜) 상태 토글
 * @param {string} storeId - 가게 ID
 * @param {boolean} isCurrentlySubscribed - 현재 구독 상태
 * @returns {Promise} API 응답
 */
export const toggleStoreSubscription = async (
  storeId,
  isCurrentlySubscribed
) => {
  try {
    if (isCurrentlySubscribed) {
      // 구독 취소 (찜 해제)
      const response = await axiosInstance.delete(
        `/api/stores/${storeId}/subscribe`
      );
      return response.data;
    } else {
      // 구독 추가 (찜 하기)
      const response = await axiosInstance.post(
        `/api/stores/${storeId}/subscribe`
      );
      return response.data;
    }
  } catch (error) {
    console.error('구독 상태 변경 실패:', error);
    throw new Error(
      error.response?.data?.message || '구독 상태 변경에 실패했습니다.'
    );
  }
};

/**
 * 가게 구독(찜) 추가
 * @param {string} storeId - 가게 ID
 * @returns {Promise} API 응답
 */
export const subscribeToStore = async (storeId) => {
  try {
    const response = await axiosInstance.post(
      `/api/stores/${storeId}/subscribe`
    );
    return response.data;
  } catch (error) {
    console.error('가게 구독 실패:', error);
    throw new Error(
      error.response?.data?.message || '가게 구독에 실패했습니다.'
    );
  }
};

/**
 * 가게 구독(찜) 취소
 * @param {string} storeId - 가게 ID
 * @returns {Promise} API 응답
 */
export const unsubscribeFromStore = async (storeId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/stores/${storeId}/subscribe`
    );
    return response.data;
  } catch (error) {
    console.error('가게 구독 취소 실패:', error);
    throw new Error(
      error.response?.data?.message || '가게 구독 취소에 실패했습니다.'
    );
  }
};
