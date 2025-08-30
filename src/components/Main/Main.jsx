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
import SearchPage from '../../components/SearchPage/SearchPage'; // ✨ 1. 검색 페이지 컴포넌트 임포트

function Main() {
    const [activeCategory, setActiveCategory] = useState('food');
    const [activeFilter, setActiveFilter] = useState('한식');
    const [isSearchOpen, setIsSearchOpen] = useState(false); // ✨ 2. 검색 페이지 표시 상태 추가

    const subCategoryData = {
        food: ['한식', '중식', '일식', '양식'],
        lodging: ['호텔', '모텔', '펜션', '리조트'],
        goods: ['패션', '가전', '생활용품', '뷰티'],
        flights: ['국내선', '국제선', '특가', '예약조회'],
    };

    useEffect(() => {
        if (subCategoryData[activeCategory]) {
            setActiveFilter(subCategoryData[activeCategory][0]);
        }
    }, [activeCategory]);

    // ✨ 3. 검색 페이지를 여는 핸들러
    const openSearchPage = () => {
        setIsSearchOpen(true);
    };

    // ✨ 4. 검색 페이지를 닫는 핸들러
    const closeSearchPage = () => {
        setIsSearchOpen(false);
    };

    return (
        <div className="home-container">
            <SelectAccount />
            <CategoryNav activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

            {/* ✨ 5. onFocus 이벤트 핸들러를 SearchBar에 전달 */}
            <SearchBar placeholder="가게를 입력하세요" onFocus={openSearchPage} />

            <FilterTabs
                filters={subCategoryData[activeCategory]}
                activeFilter={activeFilter}
                onSelectFilter={setActiveFilter}
            />
            <Foodshop filter={activeFilter} />
            <TrendShop />
            <CustomizedShop />
            <DiscountShop />

            {/* ✨ 6. isSearchOpen 상태에 따라 SearchPage를 조건부 렌더링 */}
            {isSearchOpen && <SearchPage onClose={closeSearchPage} />}
        </div>
    );
}

export default Main;
