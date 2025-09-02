// src/pages/PersonalInformation/SuccessfulChallenge/SuccessfulChallenge.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SuccessfulChallenge.css';

const list = [1, 2].map((i) => ({
    id: i,
    title: 'SNS 리뷰인증 챌린지',
    issued: '쿠폰 발급일 : 2025.08.31',
}));

export default function SuccessfulChallenge() {
    const nav = useNavigate();
    return (
        <div className="sc-wrap">
            <header className="sub-header">
                <button className="icon-btn" onClick={() => nav(-1)}>
                    ←
                </button>
                <h1>성공한 챌린지</h1>
                <span className="icon-btn">⋯</span>
            </header>

            <main className="sc-list">
                {list.map((it) => (
                    <article key={it.id} className="sc-card">
                        <div className="sc-badge">가게이름</div>
                        <div className="sc-top">
                            <div className="sc-left">
                                <div className="sc-circle">📷</div>
                                <div>
                                    <div className="sc-title">{it.title}</div>
                                    <div className="sc-sub">{it.issued}</div>
                                </div>
                            </div>
                            <div className="sc-thumb" />
                        </div>
                        <div className="sc-done">완료됨</div>
                    </article>
                ))}
            </main>
        </div>
    );
}
