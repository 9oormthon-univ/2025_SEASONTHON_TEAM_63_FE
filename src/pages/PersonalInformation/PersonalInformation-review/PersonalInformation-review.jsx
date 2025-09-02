// src/pages/PersonalInformation/PersonalInformation-review/PersonalInformation-review.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PersonalInformation-review.css';

const mock = Array.from({ length: 4 }).map((_, i) => ({
    id: i,
    store: '주문했던 가게 이름',
    meta: '결제 내역 / 메뉴 / 리뷰평',
    date: '2025.08.27',
    text: '너무 맛있었어요! 다음에도 주문하고 싶어요. 리워드는 받은 것 같아요…',
}));

export default function ReviewPage() {
    const nav = useNavigate();
    return (
        <div className="rv-wrap">
            <header className="sub-header">
                <button className="icon-btn" onClick={() => nav(-1)}>
                    ←
                </button>
                <h1>내가 쓴 리뷰</h1>
                <span className="icon-btn">⋯</span>
            </header>

            <main className="rv-list">
                {mock.map((item) => (
                    <article key={item.id} className="rv-card">
                        <div className="rv-head">
                            <div className="rv-title">
                                <div className="rv-store">{item.store}</div>
                                <div className="rv-meta">{item.meta}</div>
                                <div className="rv-stars">★★★★★</div>
                            </div>
                            <div className="rv-date">작성일 {item.date}</div>
                        </div>
                        <div className="rv-body">
                            <p className="rv-text">“ {item.text} ”</p>
                            <div className="rv-thumb" />
                        </div>
                    </article>
                ))}
            </main>
        </div>
    );
}
