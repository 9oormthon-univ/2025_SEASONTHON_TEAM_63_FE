import axiosInstance from '../auth/axiosInstance';

/**
 * 가게 구독(찜) 상태를 토글(추가 또는 삭제)합니다.
 * @param {string | number} storeId - 가게 ID
 * @param {boolean} isCurrentlySubscribed - 현재 찜(구독) 상태
 * @returns {Promise<object>} 성공 시 API 응답 데이터
 * @throws {Error} API 호출 실패 시 axios 에러 객체
 */
export const toggleStoreSubscription = async (storeId, isCurrentlySubscribed) => {
    try {
        let response;
        if (isCurrentlySubscribed) {
            // 현재 찜 상태 -> 찜 해제 API 호출
            response = await axiosInstance.delete(`/api/stores/${storeId}/subscribe`);
        } else {
            // 찜하지 않은 상태 -> 찜하기 API 호출
            response = await axiosInstance.post(`/api/stores/${storeId}/subscribe`);
        }
        return response.data; // 성공 응답 데이터 반환
    } catch (error) {
        // 에러 발생 시, 상세 정보를 콘솔에 기록하고 에러 객체를 그대로 상위로 전달합니다.
        // 이렇게 해야 Zustand 스토어 같은 곳에서 에러 상황을 인지하고 UI 롤백 등을 처리할 수 있습니다.
        console.error('구독 상태 변경 실패:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * 특정 가게를 구독(찜)합니다. (POST 요청만 수행)
 * @param {string | number} storeId - 가게 ID
 * @returns {Promise<object>} 성공 시 API 응답 데이터
 * @throws {Error} API 호출 실패 시 axios 에러 객체
 */
export const subscribeToStore = async (storeId) => {
    try {
        const response = await axiosInstance.post(`/api/stores/${storeId}/subscribe`);
        return response.data;
    } catch (error) {
        console.error('가게 구독 실패:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * 특정 가게의 구독(찜)을 취소합니다. (DELETE 요청만 수행)
 * @param {string | number} storeId - 가게 ID
 * @returns {Promise<object>} 성공 시 API 응답 데이터
 * @throws {Error} API 호출 실패 시 axios 에러 객체
 */
export const unsubscribeFromStore = async (storeId) => {
    try {
        const response = await axiosInstance.delete(`/api/stores/${storeId}/subscribe`);
        return response.data;
    } catch (error) {
        console.error('가게 구독 취소 실패:', error.response?.data || error.message);
        throw error;
    }
};
