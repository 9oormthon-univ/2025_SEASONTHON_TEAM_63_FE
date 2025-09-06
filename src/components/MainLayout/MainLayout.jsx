import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './MainLayout.css';

// 1. 필요한 Context와 스캐너 컴포넌트를 가져옵니다.
import { ScannerProvider, useScanner } from '../../components/contexts/ScannerContext';
import { RealQrScanner } from '../../pages/PaymentManagement/PaymentManagement';

// 레이아웃의 실제 내용을 렌더링하는 컴포넌트
const LayoutContent = () => {
    const [headerHeight, setHeaderHeight] = useState(0);
    const [footerHeight, setFooterHeight] = useState(0);

    // 2. Context에서 스캐너 상태와 닫기 함수를 가져옵니다.
    const { isScannerVisible, closeScanner } = useScanner();

    return (
        <div className="main-layout-wrapper">
            <Header setHeaderHeight={setHeaderHeight} />
            <main
                className="main-content"
                style={{
                    paddingTop: `${headerHeight}px`,
                    paddingBottom: `${footerHeight}px`,
                }}
            >
                <Outlet />
            </main>
            <Footer setFooterHeight={setFooterHeight} />

            {/* 3. isScannerVisible 상태에 따라 스캐너 모달을 조건부 렌더링합니다. */}
            {isScannerVisible && <RealQrScanner onClose={closeScanner} />}
        </div>
    );
};

// 최상위 레이아웃 컴포넌트에서 Provider를 감싸줍니다.
const MainLayout = () => {
    return (
        <ScannerProvider>
            <LayoutContent />
        </ScannerProvider>
    );
};

export default MainLayout;
