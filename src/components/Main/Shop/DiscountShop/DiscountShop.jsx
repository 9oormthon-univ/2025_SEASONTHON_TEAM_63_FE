import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../api/axiosInstance'; // axios 인스턴스 사용
import '../Shop.css';
import HeartIcon from '../../../../assets/icon/하트.svg?react';

function DiscountShop() {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopRatedShops = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/api/stores');
                if (response.data && response.data.success) {
                    const allShops = response.data.data.content || [];
                    // 평균 평점(averageRating)이 높은 순으로 정렬하고 상위 5개만 선택
                    const sortedShops = [...allShops].sort((a, b) => b.averageRating - a.averageRating).slice(0, 5);
                    setShops(sortedShops);
                } else {
                    throw new Error('가게 정보를 가져오는데 실패했습니다.');
                }
            } catch (err) {
                console.error('평점 높은 가게 데이터를 불러오는 데 실패했습니다.', err);
                setError('가게 정보를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchTopRatedShops();
    }, []);

    const handleToggleSubscribe = async (shopId, isSubscribed) => {
        // 낙관적 업데이트
        setShops((currentShops) =>
            currentShops.map((s) => (s.id === shopId ? { ...s, isSubscribed: !isSubscribed } : s))
        );
        try {
            if (isSubscribed) {
                await axiosInstance.delete(`/api/stores/${shopId}/subscribe`);
            } else {
                await axiosInstance.post(`/api/stores/${shopId}/subscribe`);
            }
        } catch (err) {
            console.error('구독 상태 변경 실패', err);
            // 에러 시 원래 상태로 복구
            setShops((currentShops) =>
                currentShops.map((s) => (s.id === shopId ? { ...s, isSubscribed: isSubscribed } : s))
            );
        }
    };

    if (loading)
        return (
            <section className="shop-section">
                <p>가게 목록을 불러오는 중...</p>
            </section>
        );
    if (error)
        return (
            <section className="shop-section">
                <p>{error}</p>
            </section>
        );

    return (
        <section className="shop-section">
            <header className="shop-header">
                {/* 기능 변경에 따라 제목도 수정 */}
                <h2 className="shop-title">평점 높은 가게</h2>
            </header>
            <div className="shop-list-container">
                {shops.map((shop) => (
                    <div key={shop.id} className="shop-item-card" onClick={() => navigate(`/shop/${shop.id}`)}>
                        <div className="shop-image-placeholder">
                            <img src={shop.bannerImageUrl} alt={shop.name} className="shop-image" />
                            <button
                                className={`shop-like-btn ${shop.isSubscribed ? 'liked' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleSubscribe(shop.id, shop.isSubscribed);
                                }}
                            >
                                <HeartIcon />
                            </button>
                        </div>
                        <span className="shop-name">{shop.name}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default DiscountShop;
