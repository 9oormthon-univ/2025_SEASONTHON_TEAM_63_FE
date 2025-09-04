import axiosInstance from '../auth/axiosInstance';

/**
 * 가게의 리뷰 목록을 조회하는 API
 * @param {string|number} storeId - 가게 ID
 * @param {number} page - 페이지 번호 (기본값: 0)
 * @param {number} size - 페이지 크기 (기본값: 10)
 * @returns {Promise} - 리뷰 데이터 배열 및 페이징 정보
 */
export const getStoreReviews = async (storeId, page = 0, size = 10) => {
  try {
    const response = await axiosInstance.get(`/api/reviews/stores/${storeId}`, {
      params: { page, size },
    });

    // API 응답 구조: { success: true, data: {...}, code: 0, message: "..." }
    if (response.data.success) {
      const reviewData = response.data.data;

      return {
        reviews: reviewData.content.map((review) => ({
          id: review.id,
          orderId: review.orderId,
          storeId: review.storeId,
          storeName: review.storeName,
          userId: review.userId,
          userName: review.userName || '익명',
          rating: review.rating,
          content: review.content,
          createdAt: review.createdAt,
          // 날짜 포맷팅 (YYYY.MM.DD 형식으로 변환)
          formattedDate: new Date(review.createdAt)
            .toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
            .replace(/\. /g, '.')
            .replace(/\.$/, ''),
        })),
        pagination: {
          page: reviewData.page,
          size: reviewData.size,
          totalPages: reviewData.totalPages,
          totalElements: reviewData.totalElements,
          first: reviewData.first,
          last: reviewData.last,
          hasNext: reviewData.hasNext,
          hasPrevious: reviewData.hasPrevious,
        },
      };
    } else {
      throw new Error(
        response.data.message || '리뷰 데이터를 가져오는데 실패했습니다.'
      );
    }
  } catch (error) {
    console.error('리뷰 API 호출 에러:', error);

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
      throw new Error(
        error.message || '리뷰 데이터를 가져오는데 실패했습니다.'
      );
    }
  }
};
