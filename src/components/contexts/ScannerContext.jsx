import React, { createContext, useState, useContext } from 'react';

// 1. Context 생성
const ScannerContext = createContext();

// 2. Context를 사용하기 위한 커스텀 훅
export const useScanner = () => useContext(ScannerContext);

// 3. 상태와 함수를 제공하는 Provider 컴포넌트
export const ScannerProvider = ({ children }) => {
    const [isScannerVisible, setScannerVisible] = useState(false);

    const openScanner = () => setScannerVisible(true);
    const closeScanner = () => setScannerVisible(false);

    const value = {
        isScannerVisible,
        openScanner,
        closeScanner,
    };

    return <ScannerContext.Provider value={value}>{children}</ScannerContext.Provider>;
};
