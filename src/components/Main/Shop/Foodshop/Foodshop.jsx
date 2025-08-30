// src/components/Main/Shop/TrendShop/TrendShop.jsx

import React, { useState } from 'react';
import '../Shop.css';
import HeartIcon from '../../../../assets/icon/하트.svg?react';

// 각 필터에 해당하는 가게 데이터 (실제로는 API로 받아옵니다)
const shopsByFilter = {
    한식: [
        { id: 1, name: '경복궁 한정식' },
        { id: 2, name: '토속촌 삼계탕' },
        { id: 3, name: '토속촌 삼계탕' },
        { id: 4, name: '토속촌 삼계탕' },
    ],
    중식: [
        { id: 101, name: '만리장성 중국집' },
        { id: 102, name: '홍콩반점' },
        { id: 103, name: '홍콩반점' },
        { id: 104, name: '홍콩반점' },
    ],
    일식: [
        { id: 201, name: '스시효' },
        { id: 202, name: '갓덴스시' },
        { id: 203, name: '갓덴스시' },
        { id: 204, name: '갓덴스시' },
    ],
    //... 다른 필터에 대한 데이터
};

// 부모로부터 현재 활성화된 필터 값을 'filter'라는 이름의 props로 받음
function Foodshop({ filter }) {
    const [likedItems, setLikedItems] = useState({});

    const handleLikeClick = (id) => {
        setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // 현재 필터에 맞는 가게 목록을 가져옴. 만약 데이터가 없으면 빈 배열을 사용.
    const currentShops = shopsByFilter[filter] || [];

    return (
        <section className="shop-section">
            <header className="shop-header">
                {/* 제목을 props로 받은 filter 값으로 동적 변경 */}
                <h2 className="shop-title">{filter}</h2>
            </header>
            <div className="shop-list-container">
                {/* 현재 필터에 맞는 가게 목록을 렌더링 */}
                {currentShops.map((shop) => (
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

export default Foodshop;
