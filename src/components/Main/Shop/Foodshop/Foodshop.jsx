import React from 'react';
import '../Shop.css';
import HeartIcon from '../../../../assets/icon/하트.svg?react';

// 전역 스토어와 중앙 데이터를 가져옵니다.
import useFavoriteStore from '../../../../store/favoriteStore';
import { shopsByFilter } from '../../../../data/shops'; // 수정된 경로

function Foodshop({ filter }) {
    const { favoriteShopIds, toggleFavorite } = useFavoriteStore();
    const currentShops = shopsByFilter[filter] || [];

    return (
        <section className="shop-section">
            <header className="shop-header">
                <h2 className="shop-title">{filter} 맛집!</h2>
            </header>
            <div className="shop-list-container">
                {currentShops.map((shop) => {
                    const isFavorited = favoriteShopIds.has(shop.id);
                    return (
                        <div key={shop.id} className="shop-item-card">
                            <div className="shop-image-placeholder">
                                <button
                                    className={`shop-like-btn ${isFavorited ? 'liked' : ''}`}
                                    onClick={() => toggleFavorite(shop.id)}
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

export default Foodshop;
