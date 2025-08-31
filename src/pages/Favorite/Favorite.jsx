import React from 'react';
import ShopCard from './ShopCard';
import './Favorite.css';

// 전역 스토어와 중앙 관리되는 가게 데이터를 가져옵니다.
import useFavoriteStore from '../../store/favoriteStore';
import { allShopsMap } from '../../data/shops'; // 모든 가게 정보가 담긴 Map

function Favorite() {
    // 1. 전역 스토어에서 찜한 가게 ID 목록(Set)을 가져옵니다.
    const { favoriteShopIds } = useFavoriteStore();

    // 2. 찜한 ID 목록을 배열로 변환한 뒤, 각 ID에 해당하는 가게 정보를 `allShopsMap`에서 찾아 새로운 배열을 만듭니다.
    const favoriteShops = Array.from(favoriteShopIds)
        .map((id) => allShopsMap.get(id))
        .filter((shop) => shop); // 혹시 모를 undefined 값을 제거

    return (
        <div className="Favorite-wrapper">
            <div className="Favorite-shop-list">
                {favoriteShops.length > 0 ? (
                    favoriteShops.map((shop) => <ShopCard key={shop.id} shop={shop} />)
                ) : (
                    <p className="Favorite-empty-message">찜한 가게가 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default Favorite;
