import axiosInstance from '../auth/axiosInstance';

/**
 * 가게의 메뉴 목록을 조회하는 API
 * @param {string|number} storeId - 가게 ID
 * @returns {Promise} - 메뉴 데이터 배열
 */
export const getStoreMenus = async (storeId) => {
    try {
        const response = await axiosInstance.get(`/api/stores/${storeId}/menus`);

        // API 응답 구조: { success: true, data: [], code: 0, message: "..." }
        if (response.data.success) {
            return response.data.data; // 실제 메뉴 데이터 배열 반환
        } else {
            throw new Error(response.data.message || '메뉴 데이터를 가져오는데 실패했습니다.');
        }
    } catch (error) {
        console.error('메뉴 API 호출 에러:', error);

        // 네트워크 에러 또는 기타 에러 처리
        if (error.response) {
            // 서버에서 응답을 받았지만 에러 상태코드
            throw new Error(
                `서버 에러: ${error.response.status} - ${error.response.data?.message || '알 수 없는 에러'}`
            );
        } else if (error.request) {
            // 요청을 보냈지만 응답을 받지 못함
            throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
        } else {
            // 기타 에러
            throw new Error(error.message || '메뉴 데이터를 가져오는데 실패했습니다.');
        }
    }
};
