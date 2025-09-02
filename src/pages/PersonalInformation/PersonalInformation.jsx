import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './PersonalInformation.css';

export default function PersonalInformation() {
    const nav = useNavigate();

    // 로그아웃 핸들러 함수
    const handleLogout = () => {
        // localStorage에서 인증 토큰 삭제
        localStorage.removeItem('authToken');
        // 로그인 페이지로 이동하면서 페이지를 완전히 새로고침하여 상태를 초기화
        window.location.href = '/';
    };

    return (
        <div className="pi-wrap">
            {/* 헤더/프로필 UI */}
            <section className="pi-profile-card">
                {/* 
                  이전 버전에서는 여기에 사용자 정보를 표시하는 로직이 없었습니다.
                  필요하다면 로그인 후 상태 관리를 통해 받아온 정보를 표시할 수 있습니다.
                */}
                <div className="pi-user-placeholder">
                    <h2>마이페이지</h2>
                    <p>나의 활동 내역을 확인해보세요.</p>
                </div>

                <div className="pi-stats">
                    <button className="pi-stat" onClick={() => nav('successful-challenges')}>
                        성공한 챌린지
                    </button>
                    <button className="pi-stat" onClick={() => nav('coupons')}>
                        쿠폰함
                    </button>
                    <button className="pi-stat" onClick={() => nav('reviews')}>
                        내가 쓴 리뷰
                    </button>
                </div>

                {/* 로그아웃 버튼 */}
                <div style={{ marginTop: '20px', width: '100%' }}>
                    <button onClick={handleLogout} className="pi-logout-button">
                        로그아웃
                    </button>
                </div>
            </section>

            {/* 자식 라우트가 렌더링되는 영역 */}
            <Outlet />
        </div>
    );
}
