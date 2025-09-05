import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../api/auth/axiosInstance';
import useFavoriteStore from '../../../../store/favoriteStore'; // 실제 경로 확인 필요
import '../Shop.css';
import HeartIcon from '../../../../assets/icon/하트.svg?react';

function TrendShop() {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Zustand 스토어에서 필요한 상태와 함수를 모두 가져옵니다.
    const {
        isStoreSubscribed,
        toggleSubscription,
        isStoreLoading,
        setStoreSubscription, // 초기 상태 동기화를 위해 추가
    } = useFavoriteStore();

    useEffect(() => {
        const fetchTrendShops = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. '실시간 트렌드 가게' API를 호출합니다.
                const response = await axiosInstance.get('/api/stores/trending');

                if (response.data && response.data.success) {
                    // 2. API 응답 경로(response.data.data.stores)에서 데이터를 가져옵니다.
                    const trendShops = response.data.data.stores || [];
                    setShops(trendShops);

                    // 3. API 응답의 구독 정보를 전역 스토어에 동기화합니다.
                    trendShops.forEach((shop) => {
                        setStoreSubscription(shop.id, shop.isSubscribed);
                    });
                } else {
                    throw new Error('트렌드 가게 정보를 가져오는 데 실패했습니다.');
                }
            } catch (err) {
                console.error('트렌드 가게 데이터를 불러오는 데 실패했습니다.', err);
                setError('트렌드 가게 정보를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchTrendShops();
    }, [setStoreSubscription]); // 의존성 배열에 setStoreSubscription 추가

    // 로딩 및 에러 UI
    if (loading)
        return (
            <section className="shop-section">
                <p>로딩 중...</p>
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
                <h2 className="shop-title">실시간 트렌드 가게</h2>
            </header>
            <div className="shop-list-container">
                {shops.map((shop) => {
                    // 4. UI에 표시할 찜 상태는 항상 전역 스토어에서 가져옵니다.
                    const isSubscribed = isStoreSubscribed(shop.id);
                    const isLoading = isStoreLoading(shop.id);

                    return (
                        <div key={shop.id} className="shop-item-card" onClick={() => navigate(`/store/${shop.id}`)}>
                            <div className="shop-image-placeholder">
                                <img src={shop.bannerImageUrl} alt={shop.name} className="shop-image" />
                                <button
                                    className={`shop-like-btn ${isSubscribed ? 'liked' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // 5. 찜 상태 변경 시, 현재 상태를 함께 넘겨줍니다.
                                        toggleSubscription(shop.id, isSubscribed);
                                    }}
                                    disabled={isLoading}
                                >
                                    <HeartIcon />
                                </button>
                            </div>
                            <span className="shop-name">{shop.name}</span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default TrendShop;
