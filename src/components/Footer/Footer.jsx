import React, { useEffect, useRef } from 'react';

import './Footer.css'; // CSS 파일 임포트

// --- 수정된 부분 시작 ---

// 아이콘 파일들을 Vite 방식에 맞게 기본(default)으로 임포트하고, 경로 끝에 `?react`를 추가합니다.
import HomeIcon from '../../assets/icon/footericon/Main.svg?react';
import FavoriteIcon from '../../assets/icon/footericon/Fov.svg?react';
import RecordIcon from '../../assets/icon/footericon/Record.svg?react';
import PayIcon from '../../assets/icon/footericon/Pay.svg?react';
import PerinfoIcon from '../../assets/icon/footericon/Perinfo.svg?react';

// --- 수정된 부분 끝 ---

// 부모로부터 setFooterHeight 함수를 props로 전달받음
const Footer = ({ setFooterHeight }) => {
    const footerRef = useRef(null);

    useEffect(() => {
        // Footer 컴포넌트가 렌더링된 후, 실제 높이를 측정하여 부모 컴포넌트의 state를 업데이트
        if (footerRef.current) {
            setFooterHeight(footerRef.current.clientHeight);
        }
        // setFooterHeight 함수는 한 번만 실행되면 되므로 의존성 배열을 비워둡니다.
    }, [setFooterHeight]);

    // NavLink의 활성화 상태에 따라 클래스 이름을 동적으로 부여하는 함수
    const getNavLinkClassName = ({ isActive }) => (isActive ? 'footer-link active' : 'footer-link');

    return (
        <footer ref={footerRef} className="footer-wrapper">
            <nav className="footer-nav">
                <NavLink to="/" className={getNavLinkClassName}>
                    <HomeIcon />
                    <span>홈</span>
                </NavLink>
                <NavLink to="/favorite" className={getNavLinkClassName}>
                    <FavoriteIcon />
                    <span>즐겨찾기</span>
                </NavLink>
                <NavLink to="/payment" className={getNavLinkClassName}>
                    <PayIcon />
                    <span>결제관리</span>
                </NavLink>
                <NavLink to="/orders" className={getNavLinkClassName}>
                    <RecordIcon />
                    <span>주문내역</span>
                </NavLink>

                <NavLink to="/personal-info" className={getNavLinkClassName}>
                    <PerinfoIcon />
                    <span>내 정보</span>
                </NavLink>
            </nav>
        </footer>
    );
};

export default Footer;
