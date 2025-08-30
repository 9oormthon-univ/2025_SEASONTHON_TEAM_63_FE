import React from 'react';
import '../Shop.css';
import HeartIcon from '../../../../assets/icon/하트.svg?react';

// 1. 전역 스토어와 중앙 데이터 import 경로 수정
import useFavoriteStore from '../../../../store/favoriteStore';
import { trendShops } from '../../../../data/shops';

function TrendShop() {
    // 2. 전역 스토어의 상태와 함수 사용
    const { favoriteShopIds, toggleFavorite } = useFavoriteStore();

    return (
        <section className="shop-section">
            <header className="shop-header">
                <h2 className="shop-title">실시간 트렌드 가게</h2>
            </header>
            <div className="shop-list-container">
                {trendShops.map((shop) => {
                    // 3. 찜 여부를 전역 상태에서 확인
                    const isFavorited = favoriteShopIds.has(shop.id);

                    return (
                        <div key={shop.id} className="shop-item-card">
                            <div className="shop-image-placeholder">
                                <button
                                    className={`shop-like-btn ${isFavorited ? 'liked' : ''}`}
                                    // 4. 클릭 시 전역 상태 변경 함수 호출
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

export default TrendShop;
