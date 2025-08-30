// src/pages/Main/Main.jsx
import './Main.css';

import React, { useState, useEffect } from 'react';

import SelectAccount from '../SelectAccount/SelectAccount';

import CategoryNav from '../../components/Main/CategoryNav/CategoryNav';
import SearchBar from '../../components/ui/SearchBar/SearchBar';
import FilterTabs from '../../components/Main/FilterTabs/FilterTabs';

import Foodshop from './Shop/Foodshop/Foodshop';
import TrendShop from '../../components/Main/Shop/TrendShop/TrendShop';
import CustomizedShop from '../../components/Main/Shop/CustomizedShop/CustomizedShop';
import DiscountShop from '../../components/Main/Shop/DiscountShop/DiscountShop';

function Main() {
    const [activeCategory, setActiveCategory] = useState('food');
    // ✨ 1. 현재 선택된 필터를 관리하는 상태 추가 (초기값은 '한식')
    const [activeFilter, setActiveFilter] = useState('한식');

    const subCategoryData = {
        food: ['한식', '중식', '일식', '양식'],
        lodging: ['호텔', '모텔', '펜션', '리조트'],
        goods: ['패션', '가전', '생활용품', '뷰티'],
        flights: ['국내선', '국제선', '특가', '예약조회'],
    };

    // ✨ 2. 메인 카테고리(음식, 숙박 등)가 변경되면, 활성 필터를 해당 카테고리의 첫 번째 항목으로 자동 변경
    useEffect(() => {
        if (subCategoryData[activeCategory]) {
            setActiveFilter(subCategoryData[activeCategory][0]);
        }
    }, [activeCategory]);

    return (
        <div className="home-container">
            <SelectAccount />
            <CategoryNav activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
            <SearchBar placeholder="가게를 입력하세요" />
            {/* ✨ 3. FilterTabs에 현재 활성 필터와, 필터를 변경하는 함수를 props로 전달 */}
            <FilterTabs
                filters={subCategoryData[activeCategory]}
                activeFilter={activeFilter}
                onSelectFilter={setActiveFilter}
            />

            {/* ✨ 4. 현재 활성 필터(activeFilter)를 가게 목록 컴포넌트에 props로 전달 */}
            <Foodshop filter={activeFilter} />
            <TrendShop />
            <CustomizedShop />
            <DiscountShop />
        </div>
    );
}

export default Main;
