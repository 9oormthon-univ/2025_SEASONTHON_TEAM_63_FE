// src/components/MainLayout.jsx

import React, { useState } from 'react'; // useState 임포트
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Advertisement from '../Advertisement/Advertisement';

const MainLayout = () => {
    // 1. 헤더 높이를 저장할 state 생성
    const [headerHeight, setHeaderHeight] = useState(0);

    return (
        <>
            {/* 2. Header에 setHeaderHeight 함수를 prop으로 전달 */}
            <Header setHeaderHeight={setHeaderHeight} />
            <Advertisement />
            {/* 3. 계산된 헤더 높이를 main 콘텐츠의 padding-top으로 설정 */}
            <main style={{ paddingTop: `${headerHeight}px` }}>
                <Outlet />
            </main>

            <Footer />
        </>
    );
};

export default MainLayout;
