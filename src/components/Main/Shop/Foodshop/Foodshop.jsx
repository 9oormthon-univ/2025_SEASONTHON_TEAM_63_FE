import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 새로 만든 axiosInstance를 임포트합니다.
import axiosInstance from '../../../../api/auth/axiosInstance';
import useFavoriteStore from '../../../../store/favoriteStore';
import '../Shop.css';
import HeartIcon from '../../../../assets/icon/하트.svg?react';

function Foodshop({ filter }) {
    const navigate = useNavigate();

    // Zustand Store 사용
    const { isStoreSubscribed, isStoreLoading, setStoreSubscription, toggleSubscription } = useFavoriteStore();

    // 이 컴포넌트에서 보여줄 가게 목록만 관리하면 되므로 state를 하나로 줄입니다.
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. filter prop이 변경될 때마다 API를 다시 호출합니다.
    useEffect(() => {
        // filter 값이 없으면 API를 호출하지 않고 목록을 비웁니다.
        if (!filter) {
            setShops([]);
            setLoading(false);
            return;
        }

        const fetchShopsByCategory = async () => {
            setLoading(true);
            setError(null);
            try {
                // 2. 쿼리 파라미터로 카테고리를 넘겨 서버에서 필터링된 데이터를 받아옵니다.
                const response = await axiosInstance.get(`/api/stores?category=${filter}`);

                if (response.data && response.data.success) {
                    // API 응답 데이터는 response.data.data.content에 있습니다.
                    const fetchedShops = response.data.data.content || [];
                    setShops(fetchedShops);

                    // 받아온 가게들의 구독 상태를 전역 스토어에 동기화합니다.
                    fetchedShops.forEach((shop) => {
                        setStoreSubscription(shop.id, shop.isSubscribed || false);
                    });
                } else {
                    throw new Error(response.data.message || '가게 목록을 가져오는 데 실패했습니다.');
                }
            } catch (err) {
                console.error(`${filter} 카테고리 맛집 데이터를 불러오는 데 실패했습니다.`, err);
                setError(err.message || '맛집 정보를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchShopsByCategory();
    }, [filter, setStoreSubscription]); // filter 값이 바뀔 때마다 API를 새로 호출합니다.

    // 구독(즐겨찾기) 상태를 토글하는 함수
    const handleToggleSubscribe = async (shopId) => {
        const isSubscribed = isStoreSubscribed(shopId);
        try {
            await toggleSubscription(shopId, isSubscribed);
        } catch (error) {
            alert('구독 상태 변경에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleMoreClick = () => {
        // '더보기' 클릭 시, 해당 카테고리의 모든 가게를 보여주는 페이지로 이동합니다.
        // 이 경로는 실제 구현된 'FilteredShops' 페이지의 경로와 일치해야 합니다.
        navigate(`/filtered-shops?category=${filter}`);
    };

    // 로딩 및 에러 UI
    if (loading) {
        return (
            <section className="shop-section">
                <p>맛집 목록을 불러오는 중...</p>
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
                <h2 className="shop-title">{filter} 맛집</h2>
                <button onClick={handleMoreClick} className="shop-see-more-btn">
                    더보기 &gt;
                </button>
            </header>
            <div className="shop-list-container">
                {shops.length === 0 ? (
                    <p>해당 카테고리의 맛집이 없습니다.</p>
                ) : (
                    shops.map((shop) => (
                        <div key={shop.id} className="shop-item-card" onClick={() => navigate(`/store/${shop.id}`)}>
                            <div className="shop-image-placeholder">
                                <img src={shop.bannerImageUrl} alt={shop.name} className="shop-image" />
                                <button
                                    className={`shop-like-btn ${isStoreSubscribed(shop.id) ? 'liked' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleSubscribe(shop.id);
                                    }}
                                    disabled={isStoreLoading(shop.id)}
                                >
                                    <HeartIcon />
                                </button>
                            </div>
                            <span className="shop-name">{shop.name}</span>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

export default Foodshop;
