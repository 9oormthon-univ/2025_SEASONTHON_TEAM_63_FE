import React, { useState, useEffect } from 'react';
// 이미 설정된 axiosInstance를 가져옵니다. 경로는 실제 파일 위치에 맞게 조정해주세요.
import './PersonalInformation-review.css';
import axiosInstance from '../../../api/auth/axiosInstance';
import ExpandableList from '../../../components/ExpandableList/ExpandableList'; // 경로에 맞게
// 날짜 포맷팅 함수
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

export default function ReviewPage() {
    const [reviews, setReviews] = useState([]);
    const [editingReview, setEditingReview] = useState(null);
    const [editedContent, setEditedContent] = useState('');
    const [editedRating, setEditedRating] = useState(0);

    // 컴포넌트 마운트 시 내가 쓴 리뷰 목록을 불러옵니다.
    useEffect(() => {
        fetchMyReviews();
    }, []);

    // 내가 쓴 리뷰 목록 조회 API 호출
    const fetchMyReviews = async () => {
        try {
            const response = await axiosInstance.get('/api/reviews/my', {
                params: { page: 0, size: 10 },
            });
            if (response.data && response.data.success) {
                setReviews(response.data.data.content);
            }
        } catch (error) {
            // 인터셉터에서 401 에러를 처리하므로, 여기서는 그 외의 오류만 처리합니다.
            if (error.response?.status !== 401) {
                console.error('리뷰를 불러오는 중 오류가 발생했습니다:', error);
                alert('리뷰를 불러오는 데 실패했습니다.');
            }
        }
    };

    // 리뷰 삭제 처리
    const handleDelete = async (reviewId) => {
        if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
            try {
                await axiosInstance.delete(`/api/reviews/${reviewId}`);
                setReviews(reviews.filter((review) => review.id !== reviewId));
                alert('리뷰가 삭제되었습니다.');
            } catch (error) {
                if (error.response?.status !== 401) {
                    console.error('리뷰 삭제 중 오류가 발생했습니다:', error);
                    alert('리뷰 삭제에 실패했습니다.');
                }
            }
        }
    };

    // 리뷰 수정 처리
    const handleUpdate = async (reviewId) => {
        try {
            const response = await axiosInstance.put(`/api/reviews/${reviewId}`, {
                rating: editedRating,
                content: editedContent,
            });
            if (response.data && response.data.success) {
                setReviews(reviews.map((review) => (review.id === reviewId ? response.data.data : review)));
                setEditingReview(null);
                alert('리뷰가 수정되었습니다.');
            }
        } catch (error) {
            if (error.response?.status !== 401) {
                console.error('리뷰 수정 중 오류가 발생했습니다:', error);
                alert('리뷰 수정에 실패했습니다.');
            }
        }
    };

    // --- 수정 모드 시작 및 취소, 별점 렌더링 함수 (이전과 동일) ---
    const handleEditStart = (review) => {
        setEditingReview(review);
        setEditedContent(review.content);
        setEditedRating(review.rating);
    };

    const handleEditCancel = () => {
        setEditingReview(null);
    };

    const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

    // --- JSX 렌더링 부분 (이전과 동일) ---
    return (
        <div className="rv-wrap">
            <main className="rv-list">
                <div className="title-C">내가 쓴 리뷰</div>
                <ExpandableList maxHeight={200}>
                    {reviews.map((item) => (
                        <article key={item.id} className="rv-card">
                            {editingReview && editingReview.id === item.id ? (
                                // 수정 모드
                                <div className="rv-edit-mode">
                                    <div className="rv-head">
                                        <div className="rv-title">
                                            <div className="rv-store">{item.storeName}</div>
                                        </div>
                                        <div className="rv-date">작성일 {formatDate(item.createdAt)}</div>
                                    </div>
                                    <div className="rv-edit-form">
                                        <div className="rv-stars-edit">
                                            <span>평점: </span>
                                            <select
                                                value={editedRating}
                                                onChange={(e) => setEditedRating(Number(e.target.value))}
                                            >
                                                {[5, 4, 3, 2, 1].map((score) => (
                                                    <option key={score} value={score}>
                                                        {renderStars(score)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <textarea
                                            className="rv-textarea"
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                        />
                                        <div className="rv-edit-actions">
                                            <button onClick={() => handleUpdate(item.id)} className="rv-save-btn">
                                                저장
                                            </button>
                                            <button onClick={handleEditCancel} className="rv-cancel-btn">
                                                취소
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // 일반 모드
                                <>
                                    <div className="rv-head">
                                        <div className="rv-title">
                                            <div className="rv-store">{item.storeName}</div>
                                            <div className="rv-stars">{renderStars(item.rating)}</div>
                                        </div>
                                        <div className="rv-date">작성일 {formatDate(item.createdAt)}</div>
                                    </div>
                                    <div className="rv-body">
                                        <p className="rv-text">“ {item.content} ”</p>
                                    </div>
                                    <div className="rv-actions">
                                        <button onClick={() => handleEditStart(item)} className="rv-edit-btn">
                                            수정
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="rv-delete-btn">
                                            삭제
                                        </button>
                                    </div>
                                </>
                            )}
                        </article>
                    ))}
                </ExpandableList>
            </main>
        </div>
    );
}
