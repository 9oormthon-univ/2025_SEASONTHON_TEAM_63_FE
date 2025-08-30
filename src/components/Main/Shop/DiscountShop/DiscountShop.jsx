// src/components/Shop/Trend/TrendShop.jsx

import React, { useState } from 'react'; // useState를 import 합니다.
import '../Shop.css';

import HeartIcon from '../../../../assets/icon/하트.svg?react';

const trendShops = [
    { id: 1, name: '트렌디한 가게 1' },
    { id: 2, name: '인기 많은 가게 2' },
    { id: 3, name: '요즘 뜨는 가게 3' },
    { id: 4, name: '핫플레이스 4' },
];

function TrendShop() {
    // 어떤 아이템이 '좋아요' 되었는지 상태를 관리합니다.
    const [likedItems, setLikedItems] = useState({});

    // 하트 버튼 클릭 시 상태를 토글하는 함수
    const handleLikeClick = (id) => {
        setLikedItems((prev) => ({
            ...prev,
            [id]: !prev[id], // 현재 상태의 반대 값으로 변경
        }));
    };

    return (
        <section className="shop-section">
            <header className="shop-header">
                <h2 className="shop-title">할인률 높은가게</h2>
            </header>
            <div className="shop-list-container">
                {trendShops.map((shop) => (
                    <div key={shop.id} className="shop-item-card">
                        <div className="shop-image-placeholder">
                            {/* 
                                버튼 클릭 시 handleLikeClick 함수를 호출하고,
                                likedItems 상태에 따라 'liked' 클래스를 동적으로 추가합니다.
                            */}
                            <button
                                className={`shop-like-btn ${likedItems[shop.id] ? 'liked' : ''}`}
                                onClick={() => handleLikeClick(shop.id)}
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

export default TrendShop;
