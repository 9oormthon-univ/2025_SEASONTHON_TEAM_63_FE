// src/components/MainLayout/MainLayout.jsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Advertisement from '../Advertisement/Advertisement';
import './MainLayout.css'; // MainLayout을 위한 CSS 파일 임포트

const MainLayout = () => {
    const [headerHeight, setHeaderHeight] = useState(0);
    const [footerHeight, setFooterHeight] = useState(0);

    return (
        // Flexbox 레이아웃을 적용할 최상위 래퍼
        <div className="main-layout-wrapper">
            <Header setHeaderHeight={setHeaderHeight} />

            {/* 
              메인 콘텐츠 영역입니다.
              Outlet을 통해 렌더링될 페이지들이 이 안에 표시됩니다.
              header와 footer의 높이만큼 padding을 주어 콘텐츠가 가려지지 않게 합니다.
            */}
            <main className="main-content">
                {/* 광고와 같은 스크롤되어야 할 콘텐츠는 main 내부에 위치해야 합니다. */}
                <Advertisement />
                <Outlet />
            </main>

            <Footer setFooterHeight={setFooterHeight} />
        </div>
    );
};

export default MainLayout;
