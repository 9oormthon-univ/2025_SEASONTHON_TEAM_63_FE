// src/pages/Main/Main.jsx

import './Main.css';
import { useState, useEffect } from 'react';
import SelectAccount from '../SelectAccount/SelectAccount';
import CategoryNav from '../../components/Main/CategoryNav/CategoryNav';
import SearchBar from '../../components/ui/SearchBar/SearchBar';
import FilterTabs from '../../components/Main/FilterTabs/FilterTabs';
import Foodshop from './Shop/Foodshop/Foodshop';
import TrendShop from '../../components/Main/Shop/TrendShop/TrendShop';
import CustomizedShop from '../../components/Main/Shop/CustomizedShop/CustomizedShop';
import DiscountShop from '../../components/Main/Shop/DiscountShop/DiscountShop';
import SearchPage from '../../components/SearchPage/SearchPage'; // ✨ 1. 검색 페이지 컴포넌트 임포트

// 유비님이 선언하신 subCategoryData는 src/data/categoryData.js 으로 그대로 옮기고 중복 제거. / 김성수
import { subCategoryData } from '../../data/categoryData';

function Main() {
  const [activeCategory, setActiveCategory] = useState('food');
  const [activeFilter, setActiveFilter] = useState('한식');
  const [isSearchOpen, setIsSearchOpen] = useState(false); // ✨ 2. 검색 페이지 표시 상태 추가

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
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

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
