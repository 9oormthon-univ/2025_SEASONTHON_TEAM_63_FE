// src/components/Main/CategoryNav.jsx

import React from 'react';
import './CategoryNav.css';

// SVG 파일을 React 컴포넌트로 불러옵니다. (Vite 방식)
import FoodIcon from '../../../assets/icon/Categoryicon/음식.svg?react';
import BedIcon from '../../../assets/icon/Categoryicon/숙박.svg?react';
import BagIcon from '../../../assets/icon/Categoryicon/물품.svg?react';
import PlaneIcon from '../../../assets/icon/Categoryicon/항공.svg?react';

const categories = [
    { id: 'food', text: '음식', Icon: FoodIcon },
    { id: 'lodging', text: '숙박', Icon: BedIcon },
    { id: 'goods', text: '물품', Icon: BagIcon },
    { id: 'flights', text: '항공', Icon: PlaneIcon },
];

function CategoryNav({ activeCategory, onSelectCategory }) {
    return (
        <nav className="category-nav">
            {categories.map(({ id, text, Icon }) => (
                <button
                    key={id}
                    className={`category-btn ${activeCategory === id ? 'active' : ''}`}
                    onClick={() => onSelectCategory(id)}
                >
                    {/* SVG 컴포넌트에 className을 전달하여 CSS로 제어 */}
                    <Icon className="category-svg-icon" />
                    <span>{text}</span>
                </button>
            ))}
        </nav>
    );
}

export default CategoryNav;
