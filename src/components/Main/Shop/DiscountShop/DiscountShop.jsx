import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../api/auth/axiosInstance'; // axios 인스턴스 사용
import '../Shop.css';
import HeartIcon from '../../../../assets/icon/하트.svg?react';

function DiscountShop() {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 함수의 이름을 더 명확하게 변경합니다.
        const fetchDiscountStores = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. '할인율 높은 가게' API를 호출합니다.
                const response = await axiosInstance.get('/api/stores/discounts');

                if (response.data && response.data.success) {
                    // 2. API 응답 경로(response.data.data.stores)에서 데이터를 가져옵니다.
                    //    서버에서 이미 정렬된 데이터를 주므로 추가적인 정렬이 필요 없습니다.
                    setShops(response.data.data.stores || []);
                } else {
                    throw new Error('할인 가게 정보를 가져오는 데 실패했습니다.');
                }
            } catch (err) {
                console.error('할인 가게 데이터를 불러오는 데 실패했습니다.', err);
                setError('가게 정보를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchDiscountStores();
    }, []); // 컴포넌트 마운트 시 한 번만 실행합니다.

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
            alert('구독 상태 변경에 실패했습니다. 다시 시도해주세요.');
            setShops((currentShops) =>
                currentShops.map((s) => (s.id === shopId ? { ...s, isSubscribed: isSubscribed } : s))
            );
        }
    };

    // 로딩 및 에러 UI
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
                <h2 className="shop-title">할인율 높은 가게</h2>
            </header>
            <div className="shop-list-container">
                {shops.map((shop) => (
                    // 3. navigate 경로를 올바르게 수정합니다. ('/shop/' -> '/store/')
                    <div key={shop.id} className="shop-item-card" onClick={() => navigate(`/store/${shop.id}`)}>
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
