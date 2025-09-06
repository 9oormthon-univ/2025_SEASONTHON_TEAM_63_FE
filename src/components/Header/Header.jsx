import React, { useState, useEffect, useRef } from 'react';
import './Header.css';

// SVG 아이콘을 React 컴포넌트로 임포트
import AlramIcon from '../../assets/icon/바코드.svg?react';
import LocaIcon from '../../assets/icon/loca.svg?react';
import { Link } from 'react-router-dom';

// --- 수정된 부분 1: useScanner 훅을 context 파일에서 가져옵니다. ---
import { useScanner } from '../../components/contexts/ScannerContext';

// 부모로부터 setHeaderHeight 함수를 props로 전달받음
function Header({ setHeaderHeight }) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // --- 수정된 부분 2: context에서 스캐너를 여는 함수를 가져옵니다. ---
    const { openScanner } = useScanner();

    // 헤더 DOM 요소를 참조하기 위한 ref
    const headerRef = useRef(null);

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // 스크롤을 아래로 내릴 때 && 최상단이 아닐 때 헤더를 숨김
        if (currentScrollY > lastScrollY && currentScrollY > 0) {
            setIsVisible(false);
        } else {
            // 스크롤을 위로 올릴 때 헤더를 표시
            setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
    };

    useEffect(() => {
        // 헤더의 높이를 측정하여 부모 컴포넌트의 state를 업데이트
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.clientHeight);
        }

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
        // --- 수정된 부분 3: setHeaderHeight를 의존성 배열에 추가하여 안정성을 높입니다. ---
    }, [lastScrollY, setHeaderHeight]);

    return (
        // ref를 연결하고, isVisible 상태에 따라 클래스를 동적으로 변경
        <div ref={headerRef} className={`Header-wrapper ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="location">
                <Link to="/locationmap">
                    <LocaIcon />
                </Link>
            </div>

            <div className="logo">RE:visit</div>

            <div className="alarm">
                {/* 4. 버튼 클릭 시 context의 openScanner 함수를 호출합니다. */}
                <button onClick={openScanner} className="header-icon-btn">
                    <AlramIcon />
                </button>
            </div>
        </div>
    );
}

export default Header;
