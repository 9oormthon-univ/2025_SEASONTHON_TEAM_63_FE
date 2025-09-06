// src/pages/PersonalInformation/CouponBox/CouponBox.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CouponBox.css';
import ExpandableList from '../../../components/ExpandableList/ExpandableList'; // 경로에 맞게
// 날짜를 'YYYY.MM.DD' 형식으로 변환하는 헬퍼 함수
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date
        .toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
        .replace(/\. /g, '.')
        .slice(0, -1);
};

export default function CouponBox() {
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
    const nav = useNavigate();

    useEffect(() => {
        const fetchCoupons = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('authToken');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            };

            try {
                const response = await fetch('/api/coupons/my', { headers });
                const result = await response.json();

                if (result.success && Array.isArray(result.data)) {
                    setCoupons(result.data);
                } else {
                    setCoupons([]); // 데이터가 없거나 실패 시 빈 배열로 초기화
                }
            } catch (error) {
                console.error('쿠폰 정보를 불러오는 데 실패했습니다:', error);
                setCoupons([]); // 에러 발생 시 빈 배열로 초기화
            } finally {
                setIsLoading(false); // 로딩 종료
            }
        };

        fetchCoupons();
    }, []); // 컴포넌트 마운트 시 한 번만 실행

    return (
        <div className="cp-wrap">
            <main className="cp-list">
                <div className="title-C">쿠폰함</div>
                <ExpandableList maxHeight={200}>
                    {isLoading ? (
                        <div className="cp-loading">쿠폰을 불러오는 중...</div>
                    ) : coupons.length > 0 ? (
                        coupons.map((c) => (
                            <article key={c.id} className="cp-card">
                                <div className="cp-top">
                                    <span className="cp-badge">{c.storeName || '가게이름'}</span>
                                    <span className="cp-exp">~{formatDate(c.expiresAt)}</span>
                                </div>
                                <div className="cp-mid">
                                    <div className="cp-left">
                                        <div className="cp-gift">🎁</div>
                                        <div className="cp-title">
                                            {c.discount?.percentage ? `${c.discount.percentage}% 할인쿠폰` : '할인쿠폰'}
                                        </div>
                                    </div>
                                    <div className="cp-mascot">🐱</div>
                                </div>
                                <div className="cp-bottom">
                                    <span>{c.canUse ? '사용 가능' : '사용 불가'}</span>
                                    <span className="cp-issued">발급일 : {formatDate(c.createdAt)}</span>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="cp-no-coupons">보유한 쿠폰이 없습니다.</div>
                    )}
                </ExpandableList>
            </main>
        </div>
    );
}
