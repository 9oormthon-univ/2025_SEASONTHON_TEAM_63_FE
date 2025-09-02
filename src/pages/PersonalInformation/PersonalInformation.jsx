// src/pages/PersonalInformation/PersonalInformation.jsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './PersonalInformation.css';

export default function PersonalInformation() {
    const nav = useNavigate();

    return (
        <div className="pi-wrap">
            {/* 헤더/프로필 UI ... */}
            <section className="pi-profile-card">
                {/* ... */}
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
            </section>

            {/* 여기서 자식 라우트가 렌더링됨 */}
            <Outlet />
        </div>
    );
}
