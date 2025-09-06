import axiosInstance from '../../api/auth/axiosInstance'; // axiosInstance 경로 확인

/**
 * 1. 내 소속 법인 정보 조회 API
 * @returns {Promise<Object>} 법인 ID(`corpId`)를 포함한 법인 정보
 */
export const getMyCorporation = async () => {
    try {
        const response = await axiosInstance.get('/api/corps/me');
        return response.data;
    } catch (error) {
        console.error('내 소속 법인 정보 조회 에러:', error);
        throw error;
    }
};

/**
 * 2. 특정 법인 소속 유저 목록 조회 API
 * @param {number} corpId - 조회할 법인의 ID
 * @returns {Promise<Object>} 직원 목록(`content`)을 포함한 페이지네이션 객체
 */
export const getUsersByCorporation = async (corpId) => {
    if (!corpId) throw new Error('corpId가 필요합니다.');
    try {
        // 페이지네이션 파라미터를 추가하여 모든 사용자를 가져오도록 요청할 수 있습니다. (예: &size=100)
        // 여기서는 기본 페이지만 요청합니다.
        const response = await axiosInstance.get(`/api/user/by-corp/${corpId}`);
        return response.data;
    } catch (error) {
        console.error(`법인(id: ${corpId}) 소속 유저 목록 조회 에러:`, error);
        throw error;
    }
};
