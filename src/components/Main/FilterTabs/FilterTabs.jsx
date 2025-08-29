import React from 'react';
import './FilterTabs.css';

function FilterTabs({ filters }) {
    // filters 배열이 없을 경우를 대비한 방어 코드
    if (!filters || filters.length === 0) {
        return null;
    }

    return (
        <div className="filter-tabs-container">
            {filters.map((filter, index) => (
                <button key={index} className="filter-tab-btn">
                    {filter}
                </button>
            ))}
        </div>
    );
}

export default FilterTabs;
