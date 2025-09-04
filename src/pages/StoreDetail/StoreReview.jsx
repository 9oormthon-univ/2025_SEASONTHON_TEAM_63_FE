import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStoreReviews } from '../../api/storedetail/reviewApi';
import './styles/StoreReview.css';
import StarRateIcon from '@mui/icons-material/StarRate';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const StoreReview = () => {
  const { storeId } = useParams(); // URL에서 storeId 동적 추출

  // 상태 관리
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 리뷰 데이터 API 호출
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        // storeId가 없으면 기본값 사용 (개발 중)
        const currentStoreId = storeId || '123';
        const data = await getStoreReviews(currentStoreId, 0, 10);

        setReviews(data.reviews);
        setPagination(data.pagination);
      } catch (err) {
        console.error('리뷰 데이터 로딩 에러:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [storeId]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarRateIcon
          key={i}
          sx={{ color: i < rating ? '#FF6835' : '#E0E0E0' }}
        />
      );
    }
    return stars;
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="review-list-container">
        {[1, 2, 3].map((index) => (
          <div key={index} className="review-card review-skeleton">
            <div className="review-main-content">
              <div className="review-author">
                <div className="author-avatar skeleton-avatar"></div>
                <span className="author-name skeleton-text skeleton-name"></span>
              </div>
              <div className="star-rating skeleton-stars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="skeleton-star"></div>
                ))}
              </div>
              <div className="review-text-content">
                <div className="skeleton-text skeleton-content-line1"></div>
                <div className="skeleton-text skeleton-content-line2"></div>
              </div>
            </div>
            <div className="review-side-content">
              <span className="skeleton-text skeleton-date"></span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="review-list-container error">
        <div className="error-message">
          <p>😅 리뷰를 불러올 수 없습니다</p>
          <p className="error-detail">{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 리뷰가 없을 시
  if (reviews.length === 0) {
    return (
      <div className="review-list-container empty">
        <p>아직 작성된 리뷰가 없습니다.</p>
        <p>여러분이 리뷰를 작성해주세요!</p>
      </div>
    );
  }

  return (
    <div className="review-list-container">
      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <div className="review-main-content">
            <div className="review-author">
              <div className="author-avatar"></div>
              <span className="author-name">{review.userName}</span>
            </div>
            <div className="star-rating">{renderStars(review.rating)}</div>
            <div className="review-text-content">
              <FormatQuoteIcon className="quote-start" />
              <p>{review.content}</p>
              <FormatQuoteIcon className="quote-end" />
            </div>
          </div>
          <div className="review-side-content">
            <span className="review-date">{review.formattedDate}</span>
            {/* 이미지는 현재 API 응답에 없으므로 제거 */}
          </div>
        </div>
      ))}

      {/* 페이징 정보 (선택사항) */}
      {pagination && pagination.totalElements > 0 && (
        <div className="review-pagination-info">
          <p>총 {pagination.totalElements}개의 리뷰</p>
        </div>
      )}
    </div>
  );
};

export default StoreReview;
