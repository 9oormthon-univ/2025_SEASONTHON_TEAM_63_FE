import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../api/auth/axiosInstance'; // 생성한 axios 인스턴스를 사용합니다.
import '../Shop.css';
import HeartIcon from '../../../../assets/icon/하트.svg?react';

function TrendShop() {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrendShops = async () => {
            setLoading(true);
            try {
                // /api/stores를 호출하여 모든 가게 정보를 가져옵니다.
                const response = await axiosInstance.get('/api/stores');
                if (response.data && response.data.success) {
                    const allShops = response.data.data.content || [];

                    // "트렌드"를 "리뷰 수가 많은 순"으로 정의합니다.
                    // 리뷰 수(reviewCount)가 높은 순으로 정렬하고 상위 5개만 선택합니다.
                    const sortedShops = [...allShops].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

                    setShops(sortedShops);
                } else {
                    throw new Error('트렌드 가게 정보를 가져오는데 실패했습니다.');
                }
            } catch (err) {
                console.error('트렌드 가게 데이터를 불러오는 데 실패했습니다.', err);
                setError('트렌드 가게 정보를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchTrendShops();
    }, []); // 컴포넌트 마운트 시 한 번만 실행합니다.

    // 구독(즐겨찾기) 상태를 변경하는 함수
    const handleToggleSubscribe = async (shopId, isSubscribed) => {
        // UI를 먼저 업데이트하는 낙관적 업데이트
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
            // API 호출 실패 시, UI를 원래 상태로 되돌립니다.
            alert('구독 상태 변경에 실패했습니다. 다시 시도해주세요.');
            setShops((currentShops) =>
                currentShops.map((s) => (s.id === shopId ? { ...s, isSubscribed: isSubscribed } : s))
            );
        }
    };

    if (loading) {
        return (
            <section className="shop-section">
                <p>트렌드 가게를 불러오는 중...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="shop-section">
                <p>{error}</p>
            </section>
        );
    }

    return (
        <section className="shop-section">
            <header className="shop-header">
                <h2 className="shop-title">실시간 트렌드 가게</h2>
            </header>
            <div className="shop-list-container">
                {shops.map((shop) => (
                    <div key={shop.id} className="shop-item-card" onClick={() => navigate(`/shop/${shop.id}`)}>
                        <div className="shop-image-placeholder">
                            {/* API 응답에 맞는 이미지 URL 필드 사용 */}
                            <img src={shop.bannerImageUrl} alt={shop.name} className="shop-image" />
                            <button
                                // API 응답의 isSubscribed 값을 사용
                                className={`shop-like-btn ${shop.isSubscribed ? 'liked' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
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

export default TrendShop;
