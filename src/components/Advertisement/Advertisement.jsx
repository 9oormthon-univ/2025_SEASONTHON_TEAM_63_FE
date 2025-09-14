import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/auth/axiosInstance'; // 인증, baseURL 설정된 axios 인스턴스
import './Advertisement.css';

function Advertisement() {
    // ✨ 이번 주 할인액을 저장할 상태
    const [discountedAmount, setDiscountedAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDiscountData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // ✨ 새로운 API 엔드포인트로 요청
                const response = await axiosInstance.get('/api/statistics/discounted/this-week');

                if (response.data && response.data.success) {
                    // ✨ API 응답의 data.price 값을 상태에 저장
                    setDiscountedAmount(response.data.data.price || 0);
                } else {
                    throw new Error('할인 정보를 가져올 수 없습니다.');
                }
            } catch (err) {
                console.error('Failed to fetch discount data:', err);
                setError('정보를 불러오는 데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDiscountData();
    }, []); // 컴포넌트 첫 로드 시 한 번만 실행

    if (isLoading) {
        return (
            <div className="Advertisement-wapper">
                <div className="Advertisement-main-1 skeleton"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="Advertisement-wapper">
                <div className="Advertisement-main-1 error-card">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="Advertisement-wapper">
            <div className="Advertisement-main-1">
                <div>
                    <p className="ad-line-1">
                        {/* 닉네임은 user/my/info API에서 별도로 가져와야 합니다. */}
                        <span className="ad-name">고객</span>님, 지금까지 총
                    </p>
                    <div className="ad-line-2">
                        {/* ✨ 새로운 API에서 받은 할인액을 표시 */}
                        <span className="ad-money">{discountedAmount.toLocaleString()}</span>
                        <span className="ad-unit">원 할인 받았어요!</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Advertisement;
