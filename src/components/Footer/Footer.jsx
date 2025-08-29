import React from 'react';
import { NavLink } from 'react-router-dom';

// Footer.css 파일이 있다면 가져옵니다.
// import './Footer.css';

const Footer = () => {
    // NavLink에 적용할 액티브 스타일
    // 현재 활성화된 링크에 동적으로 스타일을 적용할 수 있습니다.
    const getNavLinkStyle = ({ isActive }) => ({
        color: isActive ? '#007bff' : '#333', // 활성화 시 파란색, 비활성화 시 검은색
        fontWeight: isActive ? 'bold' : 'normal',
        textDecoration: 'none',
        padding: '10px',
    });

    return (
        <footer style={{ display: 'flex', justifyContent: 'center', padding: '20px', borderTop: '1px solid #eee' }}>
            <nav style={{ display: 'flex', gap: '20px' }}>
                <NavLink to="/" style={getNavLinkStyle}>
                    홈
                </NavLink>
                <NavLink to="/favorite" style={getNavLinkStyle}>
                    즐겨찾기
                </NavLink>
                <NavLink to="/orders" style={getNavLinkStyle}>
                    주문내역
                </NavLink>
                <NavLink to="/payment" style={getNavLinkStyle}>
                    결제관리
                </NavLink>
                <NavLink to="/personal-info" style={getNavLinkStyle}>
                    내 정보
                </NavLink>
            </nav>
        </footer>
    );
};

export default Footer;
