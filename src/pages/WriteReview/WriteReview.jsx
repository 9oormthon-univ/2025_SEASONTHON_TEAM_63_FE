// src/pages/WriteReview/WriteReview.jsx

import React, { useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import StarRateIcon from '@mui/icons-material/StarRate';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import './WriteReview.css';
import axiosInstance from '../../api/auth/axiosInstance'; // API 통신을 위한 설정된 axios 인스턴스

const WriteReview = () => {
    const navigate = useNavigate();
    const { orderId } = useParams(); // 1. OrderDetails에서 넘겨준 주문 ID를 URL에서 가져옵니다.
    const location = useLocation(); // 2. OrderDetails에서 state로 넘겨준 가게 이름을 가져옵니다.
    const storeName = location.state?.storeName || '가게'; // state가 없는 예외 상황 대비

    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null); // 이미지 미리보기용
    const fileInputRef = useRef(null);

    // '등록하기' 버튼 클릭 시 실행되는 함수
    const handleSubmit = async () => {
        // 유효성 검사
        if (rating === 0 || content.trim() === '') {
            alert('별점과 리뷰 내용을 모두 입력해주세요.');
            return;
        }

        try {
            // 3. 서버에 리뷰 데이터를 전송합니다 (API 호출)
            const response = await axiosInstance.post('/api/reviews', {
                orderId: Number(orderId), // URL에서 가져온 주문 ID
                rating: rating, // 사용자가 선택한 별점
                content: content, // 사용자가 입력한 내용
            });

            // 4. API 호출 성공 시
            if (response.data && response.data.success) {
                alert('리뷰가 성공적으로 등록되었습니다.');
                // 5. '내가 쓴 리뷰' 페이지로 사용자를 이동시킵니다.
                navigate('/personal-information-review');
            } else {
                // API는 성공했으나, 서버 내부 로직에서 실패한 경우
                alert(response.data.message || '리뷰 등록에 실패했습니다.');
            }
        } catch (error) {
            // 네트워크 오류 또는 401, 500 등 HTTP 에러 발생 시
            if (error.response?.status !== 401) {
                console.error('리뷰 등록 중 오류 발생:', error);
                alert('리뷰 등록 중 오류가 발생했습니다.');
            }
            // (참고: 401 에러는 axios 인터셉터가 자동으로 처리합니다)
        }
    };

    // 별점 클릭 핸들러
    const handleRating = (rate) => setRating(rate);
    // 사진 추가 버튼 클릭 핸들러
    const handleImageClick = () => fileInputRef.current.click();
    // 파일 선택 시 이미지 미리보기 핸들러
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => setImage(event.target.result);
            reader.readAsDataURL(e.target.files[0]);
        }
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
