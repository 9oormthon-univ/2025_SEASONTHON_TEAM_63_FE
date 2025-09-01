import React from 'react';
import ShopCard from './ShopCard';
import './Favorite.css';

import useFavoriteStore from '../../store/favoriteStore';
import { allShopsMap } from '../../data/shops';
import Advertisement from '../../components/Advertisement/Advertisement';

// 1. [수정] PNG 파일을 import하여 URL 경로를 변수에 저장합니다.
// 변수 이름을 EmptyFavoriteIconUrl 처럼 명확하게 변경하는 것이 좋습니다.
import EmptyFavoriteImageUrl from '../../assets/icon/Favorite/찜없음사진.png';

function Favorite() {
    const { favoriteShopIds } = useFavoriteStore();
    const favoriteShops = Array.from(favoriteShopIds)
        .map((id) => allShopsMap.get(id))
        .filter((shop) => shop);

    return (
        <div className="Favorite-wrapper">
            <Advertisement />

            {favoriteShops.length > 0 ? (
                <div className="Favorite-shop-list">
                    {favoriteShops.map((shop) => (
                        <ShopCard key={shop.id} shop={shop} />
                    ))}
                </div>
            ) : (
                <div className="Favorite-empty-container">
                    {/* 2. [수정] 컴포넌트 대신 <img> 태그를 사용하고, src 속성에 import한 이미지 URL을 전달합니다. */}
                    <img
                        src={EmptyFavoriteImageUrl}
                        alt="찜한 가게 없음"
                        className="Favorite-empty-image" // CSS에서 스타일을 적용하기 위해 클래스 이름 추가
                    />
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
