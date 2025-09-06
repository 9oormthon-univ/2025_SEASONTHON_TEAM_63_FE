// src/pages/PersonalInformation/CouponBox/CouponBox.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CouponBox.css';

const coupons = [1, 2, 3].map((i) => ({
    id: i,
    title: '5,000원 할인쿠폰',
    until: '2025.08.31',
    issued: '2025.08.31',
    desc: '7일 연속 결제 챌린지 완료',
}));

export default function CouponBox() {
    const nav = useNavigate();
    return (
        <div className="cp-wrap">
            <main className="cp-list">
                <div className="title-C">쿠폰함</div>
                {coupons.map((c) => (
                    <article key={c.id} className="cp-card">
                        <div className="cp-top">
                            <span className="cp-badge">가게이름</span>
                            <span className="cp-exp">~{c.until}</span>
                        </div>
                        <div className="cp-mid">
                            <div className="cp-left">
                                <div className="cp-gift">🎁</div>
                                <div className="cp-title">{c.title}</div>
                            </div>
                            <div className="cp-mascot">🐱</div>
                        </div>
                        <div className="cp-bottom">
                            <span>{c.desc}</span>
                            <span className="cp-issued">발급일 : {c.issued}</span>
                        </div>
                    </article>
                ))}
            </main>
        </div>
    );
}
