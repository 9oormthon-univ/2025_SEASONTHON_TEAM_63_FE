import React from 'react';
import './Favorite.css';
import HeartIcon from '../../assets/icon/하트.svg?react';
import useFavoriteStore from '../../store/favoriteStore';

function ShopCard({ shop }) {
    const { toggleFavorite } = useFavoriteStore();

    return (
        // 1. 부모 컨테이너
        <div className="ShopCard-container">
            {/* 2. 버튼을 컨테이너의 최상단으로 이동 */}
            <button className="shop-like-btn liked" onClick={() => toggleFavorite(shop.id)}>
                <HeartIcon />
            </button>

            {/* --- 기존 레이아웃 --- */}
            <div className="ShopCard-image-placeholder">{/* 실제 이미지는 여기에 렌더링 됩니다. */}</div>

            <div className="ShopCard-details">
                <h3 className="ShopCard-name">{shop.name}</h3>
                <div className="ShopCard-rating">
                    <span>★ {shop.rating?.toFixed(1) || 'N/A'}</span>
                </div>
                <p className="ShopCard-description">가게 소개글: {shop.description}</p>
                <p className="ShopCard-location">위치: {shop.location}</p>
                <p className="ShopCard-challenge">진행중인 챌린지: {shop.challenge}</p>
            </div>
        </div>
    );
}

export default ShopCard;
