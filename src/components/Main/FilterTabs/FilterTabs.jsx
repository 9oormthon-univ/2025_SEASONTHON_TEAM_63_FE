// src/components/Main/FilterTabs.jsx

import React, { useState, useEffect } from 'react';
import './FilterTabs.css';

function FilterTabs({ filters }) {
    // 현재 선택된 필터를 저장하는 상태
    const [activeFilter, setActiveFilter] = useState('');

    // filters prop이 바뀔 때마다 activeFilter를 첫 번째 항목으로 초기화
    useEffect(() => {
        if (filters && filters.length > 0) {
            setActiveFilter(filters[0]);
        }
    }, [filters]);

    if (!filters || filters.length === 0) {
        return null;
    }

    return (
        <div className="filter-tabs-container">
            {filters.map((filter, index) => (
                <button
                    key={index}
                    className={`filter-tab-btn ${activeFilter === filter ? 'active' : ''}`}
                    onClick={() => setActiveFilter(filter)}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
}

export default FilterTabs;
