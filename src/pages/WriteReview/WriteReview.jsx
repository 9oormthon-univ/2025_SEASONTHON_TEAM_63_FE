import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useReviewStore from '../../store/reviewStore';
import PageHeader from '../../components/ui/PageHeader';
import StarRateIcon from '@mui/icons-material/StarRate';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import './WriteReview.css';
import { storeName } from '../StoreDetail/StoreDetail';

const WriteReview = () => {
  const navigate = useNavigate();
  const addReview = useReviewStore((state) => state.addReview);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (rating === 0 || content.trim() === '') {
      alert('별점과 리뷰 내용을 모두 입력해주세요.');
      return;
    }
    addReview({
      rating,
      content,
      imageUrl: image,
    });
    navigate(-1); // Go back to the previous page (StoreReview)
  };

  return (
    <div className="write-review-container">
      <PageHeader title="리뷰 작성하기" />
      <p className="store-name-prompt">{storeName}에 대한 리뷰를 남겨주세요!</p>
      <main className="write-review-main">
        <div className="rating-section">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarRateIcon
              key={star}
              className={`star-icon ${rating >= star ? 'filled' : ''}`}
              onClick={() => handleRating(star)}
            />
          ))}
        </div>

        <button className="add-photo-btn" onClick={handleImageClick}>
          <AddAPhotoIcon />
          <span>사진 추가하기</span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: 'none' }}
          accept="image/*"
        />
        {image && <img src={image} alt="Preview" className="image-preview" />}

        <textarea
          className="review-textarea"
          placeholder="리뷰 내용을 작성해주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className="submit-btn" onClick={handleSubmit}>
          등록하기
        </button>
      </main>
    </div>
  );
};

export default WriteReview;
