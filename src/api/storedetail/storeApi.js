import axiosInstance from '../auth/axiosInstance';

/**
 * 가게 정보를 조회하는 API
 * @param {string|number} storeId - 가게 ID
 * @returns {Promise} - 가게 정보 데이터
 */
export const getStoreInfo = async (storeId) => {
  try {
    const response = await axiosInstance.get(`/api/stores/${storeId}`);

    // API 응답 구조: { success: true, data: {...}, code: 0, message: "..." }
    if (response.data.success) {
      const storeData = response.data.data;

      // 필요한 데이터만 추출하여 반환
      return {
        id: storeData.id,
        name: storeData.name || '',
        bannerImageUrl: storeData.bannerImageUrl || '',
        averageRating: storeData.averageRating || 0,
        category: storeData.category || '',
        description: storeData.description || '',
        address: storeData.address || '',
        phoneNumber: storeData.phoneNumber || '',
        isOpen: storeData.isOpen || false,
        isSubscribed: storeData.isSubscribed || false,
        totalReviewCount: storeData.totalReviewCount || 0,
      };
    } else {
      throw new Error(
        response.data.message || '가게 정보를 가져오는데 실패했습니다.'
      );
    }
  } catch (error) {
    console.error('가게 정보 API 호출 에러:', error);

    // 네트워크 에러 또는 기타 에러 처리
    if (error.response) {
      // 서버에서 응답을 받았지만 에러 상태코드
      throw new Error(
        `서버 에러: ${error.response.status} - ${
          error.response.data?.message || '알 수 없는 에러'
        }`
      );
    } else if (error.request) {
      // 요청을 보냈지만 응답을 받지 못함
      throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
    } else {
      // 기타 에러
      throw new Error(error.message || '가게 정보를 가져오는데 실패했습니다.');
    }
  }
};
