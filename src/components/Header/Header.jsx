import React, { useState, useEffect, useRef } from 'react';
import './Header.css';

// 부모로부터 setHeaderHeight 함수를 props로 받음
function Header({ setHeaderHeight }) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

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
        // setHeaderHeight가 변경될 때마다 effect를 다시 실행할 필요는 없으므로 의존성 배열에서 제외
    }, [lastScrollY]);

    return (
        // ref를 연결하고, isVisible 상태에 따라 클래스를 동적으로 변경
        <div ref={headerRef} className={`Header-wrapper ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="location">Location</div>
            <div className="logo">Logo</div>
            <div className="alarm">Alarm</div>
        </div>
    );
}

export default Header;
