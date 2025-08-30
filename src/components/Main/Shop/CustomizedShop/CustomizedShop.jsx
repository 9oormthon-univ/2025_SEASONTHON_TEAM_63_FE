// 1. [수정] useState를 사용하기 위해 React에서 import 해야 합니다.
import React, { useState } from 'react';
import '../Shop.css';
import HeartIcon from '../../../../assets/icon/하트.svg?react';

const customizedShops = [
    { id: 1, name: '맞춤 가게 A' },
    { id: 2, name: '추천 가게 B' },
    { id: 3, name: '단골 느낌 가게 C' },
];

function CustomizedShop({ userName = 'OO' }) {
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
                <h2 className="shop-title">{userName}님 맞춤 추천 가게</h2>
            </header>
            <div className="shop-list-container">
                {/* 2. [수정] 존재하지 않는 'trendShops' 대신 'customizedShops' 배열을 map으로 돌려야 합니다. */}
                {customizedShops.map((shop) => (
                    <div key={shop.id} className="shop-item-card">
                        <div className="shop-image-placeholder">
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

export default CustomizedShop;
