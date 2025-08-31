import reviewData from '../../data/storedetail/reviewData.json';
import './styles/StoreReview.css';
import StarRateIcon from '@mui/icons-material/StarRate';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const StoreReview = () => {
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

  return (
    <div className="review-list-container">
      {reviewData.map((review) => (
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
            {review.imageUrl && <div className="review-photo"></div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreReview;