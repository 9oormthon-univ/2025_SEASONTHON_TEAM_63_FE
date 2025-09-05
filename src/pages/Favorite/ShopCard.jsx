import React from 'react';
import './Favorite.css';
import HeartIcon from '../../assets/icon/하트.svg?react';
import useFavoriteStore from '../../store/favoriteStore'; //실제 경로 확인

function ShopCard({ shop }) {
    // [수정] 스토어에서 올바른 함수 이름인 toggleSubscription을 가져옵니다.
    const { toggleSubscription, isStoreLoading } = useFavoriteStore();

    // 이 컴포넌트는 Favorite 페이지에 있으므로, 항상 '찜 된 상태(true)'입니다.
    const isSubscribed = true;
    const isLoading = isStoreLoading(shop.id);

    return (
        <div className="ShopCard-container">
            <button
                className="shop-like-btn liked"
                // [수정] toggleSubscription 함수를 호출하고, 찜 해제를 위해 현재 상태(true)를 전달합니다.
                onClick={() => toggleSubscription(shop.id, isSubscribed)}
                disabled={isLoading} // API 처리 중에는 버튼 비활성화
            >
                <HeartIcon />
            </button>

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
