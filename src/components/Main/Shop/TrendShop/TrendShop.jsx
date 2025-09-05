// src/components/Main/Shop/TrendShop/TrendShop.jsx

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

    // [수정] setStoreSubscription을 제거하고 필요한 함수만 가져옵니다.
    const { isStoreSubscribed, toggleSubscription, isStoreLoading } = useFavoriteStore();

    useEffect(() => {
        const fetchTrendShops = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/api/stores');
                if (response.data && response.data.success) {
                    const allShops = response.data.data.content || [];
                    const sortedShops = [...allShops].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);
                    setShops(sortedShops);

                    // [삭제!] 이 컴포넌트는 더 이상 전역 상태를 초기화하지 않습니다.
                    // 이 코드를 반드시 제거해야 합니다.
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
    }, []); // 의존성 배열이 비어있으므로 컴포넌트 마운트 시 한 번만 실행됩니다.

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
                    // [수정] 찜 여부를 API 응답(shop.isSubscribed)이 아닌, 항상 전역 스토어에서 가져옵니다.
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
                                        // [수정] 찜 상태 변경 시, 현재 상태를 함께 넘겨줍니다.
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
