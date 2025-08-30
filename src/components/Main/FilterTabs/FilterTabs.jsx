// src/components/Main/FilterTabs/FilterTabs.jsx

import React from 'react';
import './FilterTabs.css';

// 부모로부터 activeFilter와 onSelectFilter 함수를 props로 받음
function FilterTabs({ filters, activeFilter, onSelectFilter }) {
    if (!filters || filters.length === 0) {
        return null;
    }

    return (
        <div className="filter-tabs-container">
            {filters.map((filter, index) => (
                <button
                    key={index}
                    // 현재 필터가 활성 필터와 같으면 'active' 클래스 적용
                    className={`filter-tab-btn ${activeFilter === filter ? 'active' : ''}`}
                    // 버튼 클릭 시 부모로부터 받은 onSelectFilter 함수를 호출하여 상태 변경
                    onClick={() => onSelectFilter(filter)}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
}

export default FilterTabs;
