import useReviewStore from '../../store/reviewStore';
import './styles/StoreReview.css';
import StarRateIcon from '@mui/icons-material/StarRate';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const StoreReview = () => {
  const reviews = useReviewStore((state) => state.reviews);

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

  // 리뷰가 없을 시
  if (reviews.length === 0) {
    return (
      <div className="review-list-container empty">
        <p>아직 작성된 리뷰가 없습니다.</p>
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
              <span className="author-name">{review.author}</span>
            </div>
            <div className="star-rating">{renderStars(review.rating)}</div>
            <div className="review-text-content">
              <FormatQuoteIcon className="quote-start" />
              <p>{review.content}</p>
              <FormatQuoteIcon className="quote-end" />
            </div>
          </div>
          <div className="review-side-content">
            <span className="review-date">{review.date}</span>
            {review.imageUrl && (
              <div
                className="review-photo"
                style={{ backgroundImage: `url(${review.imageUrl})` }}
              ></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreReview;
