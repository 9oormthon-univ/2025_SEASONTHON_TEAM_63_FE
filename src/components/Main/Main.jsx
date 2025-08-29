import React, { useState } from 'react';

import CategoryNav from '../../components/Main/CategoryNav/CategoryNav';
import SearchBar from '../../components/ui/SearchBar/SearchBar';
import FilterTabs from '../../components/Main/FilterTabs/FilterTabs';

import './Main.css';

function Main() {
    // 헤더의 높이를 저장할 state
    const [headerHeight, setHeaderHeight] = useState(0);
    const [activeCategory, setActiveCategory] = useState('food');

    const subCategoryData = {
        food: ['한식', '중식', '일식', '양식'],
        lodging: ['호텔', '모텔', '펜션', '리조트'],
        goods: ['패션', '가전', '생활용품', '뷰티'],
        flights: ['국내선', '국제선', '특가', '예약조회'],
    };

    return (
        <div className="home-container">
            <CategoryNav activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
            <SearchBar placeholder="가게를 입력하세요" />
            <FilterTabs filters={subCategoryData[activeCategory]} />

            {/* 이후 다른 컨텐츠 (e.g., 실시간 트렌드 가게) */}
        </div>
    );
}

export default Main;
