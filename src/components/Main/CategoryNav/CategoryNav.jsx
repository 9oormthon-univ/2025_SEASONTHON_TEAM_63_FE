import React from 'react';
import './CategoryNav.css';

// 카테고리 데이터 배열
const categories = [
    { id: 'food', text: '음식' },
    { id: 'lodging', text: '숙박' },
    { id: 'goods', text: '물품' },
    { id: 'flights', text: '항공' },
];

function CategoryNav({ activeCategory, onSelectCategory }) {
    return (
        <nav className="category-nav">
            {categories.map((category) => (
                <button
                    key={category.id}
                    // 현재 활성화된 카테고리면 'active' 클래스 추가
                    className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => onSelectCategory(category.id)}
                >
                    <div className="category-icon">{category.icon}</div>
                    <span>{category.text}</span>
                </button>
            ))}
        </nav>
    );
}

export default CategoryNav;
