import React from 'react';
import '../Shop.css';
import HeartIcon from '../../../../assets/icon/하트.svg?react';

// 전역 스토어와 중앙 데이터를 가져옵니다.
import useFavoriteStore from '../../../../store/favoriteStore';
import { discountShops } from '../../../../data/shops'; // 수정된 경로

function DiscountShop() {
    const { favoriteShopIds, toggleFavorite } = useFavoriteStore();

    return (
        <section className="shop-section">
            <header className="shop-header">
                <h2 className="shop-title">할인률 높은 가게</h2>
            </header>
            <div className="shop-list-container">
                {discountShops.map((shop) => {
                    // 올바른 데이터 소스 사용
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

export default DiscountShop;
