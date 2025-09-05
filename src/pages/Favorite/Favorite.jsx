import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/auth/axiosInstance';
import useFavoriteStore from '../../store/favoriteStore';
import ShopCard from './ShopCard';
import Advertisement from '../../components/Advertisement/Advertisement';
import EmptyFavoriteImageUrl from '../../assets/icon/Favorite/찜없음사진.png';
import './Favorite.css';

function Favorite() {
    // initialFavorites는 API를 통해 처음 한 번만 가져오는 원본 데이터입니다.
    const [initialFavorites, setInitialFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // [핵심 수정 1] 전역 스토어에서 Map 객체 자체를 구독합니다.
    // 이 Map 객체의 참조가 바뀔 때마다 이 컴포넌트는 다시 렌더링됩니다.
    const subscribedStores = useFavoriteStore((state) => state.subscribedStores);

    // 이 useEffect는 컴포넌트가 처음 마운트될 때 단 한 번만 실행되어 초기 데이터를 가져옵니다.
    useEffect(() => {
        const fetchInitialFavoriteShops = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/api/stores/subscribed');
                if (response.data && response.data.success) {
                    setInitialFavorites(response.data.data || []);
                } else {
                    throw new Error(response.data.message || '찜한 가게 목록을 가져오는데 실패했습니다.');
                }
            } catch (err) {
                console.error('초기 찜 목록 조회 실패', err);
                setError('찜한 가게 목록을 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (localStorage.getItem('authToken')) {
            fetchInitialFavoriteShops();
        } else {
            setLoading(false);
        }
        // 의존성 배열이 비어있으므로, 이 로직은 첫 렌더링 시에만 실행됩니다.
    }, []);

    // [핵심 수정 2] 화면에 실제로 보여줄 목록을 '계산된 값'으로 만듭니다.
    // 원본 데이터를 현재의 전역 찜 상태(subscribedStores)를 기준으로 필터링합니다.
    // subscribedStores가 변경되면 이 컴포넌트가 리렌더링되면서 이 필터링이 다시 실행되어 UI가 즉시 업데이트됩니다.
    const displayedShops = initialFavorites.filter((shop) => subscribedStores.has(String(shop.id)));

    if (loading) {
        return (
            <div className="Favorite-wrapper">
                <p style={{ textAlign: 'center', marginTop: '20px' }}>찜한 가게를 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="Favorite-wrapper">
                <p style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="Favorite-wrapper">
            <Advertisement />

            {displayedShops.length > 0 ? (
                <div className="Favorite-shop-list">
                    {displayedShops.map((shop) => (
                        <ShopCard key={shop.id} shop={shop} />
                    ))}
                </div>
            ) : (
                <div className="Favorite-empty-container">
                    <img src={EmptyFavoriteImageUrl} alt="찜한 가게 없음" className="Favorite-empty-image" />
                    <p className="Favorite-empty-title">아직 찜한 가게가 없어요</p>
                    <p className="Favorite-empty-subtitle">
                        마음에 드는 가게를 찾아서
                        <br />
                        하트를 눌러 찜해보세요!
                    </p>
                </div>
            )}
        </div>
    );
}

export default Favorite;
