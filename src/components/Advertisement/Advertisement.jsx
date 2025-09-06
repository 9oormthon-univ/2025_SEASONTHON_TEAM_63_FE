// Advertisement.jsx

import React, { useState, useEffect } from 'react';
// 이전에 설정한 axios 인스턴스를 가져옵니다.
// 실제 프로젝트의 파일 경로에 맞게 수정해주세요.
import axiosInstance from '../../api/auth/axiosInstance';
import './Advertisement.css';

function Advertisement() {
    // 1. 사용자 정보를 저장할 상태와 로딩/에러 상태를 정의합니다.
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. 컴포넌트가 처음 렌더링될 때 API를 호출합니다.
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axiosInstance.get('/api/user/my/info'); // API 엔드포인트

                if (response.data && response.data.success) {
                    setUserInfo(response.data.data); // 성공 시 'data' 객체를 상태에 저장
                } else {
                    // API는 성공(200)했지만, 응답 내용에 문제가 있는 경우
                    throw new Error(response.data.message || '사용자 정보를 가져올 수 없습니다.');
                }
            } catch (err) {
                // 네트워크 에러 또는 기타 에러 처리
                console.error('Failed to fetch user info:', err);
                setError('정보를 불러오는 데 실패했습니다.');
            } finally {
                setIsLoading(false); // 로딩 상태 종료
            }
        };

        fetchUserInfo();
    }, []); // 빈 배열을 전달하여 최초 1회만 실행되도록 설정

    // 3. 로딩 중일 때 보여줄 UI
    if (isLoading) {
        return (
            <div className="Advertisement-wapper">
                <div className="Advertisement-main-1 skeleton">{/* 스켈레톤 UI로 로딩 중임을 표시 */}</div>
            </div>
        );
    }

    // 4. 에러 발생 시 보여줄 UI
    if (error) {
        return (
            <div className="Advertisement-wapper">
                <div className="Advertisement-main-1 error-card">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    // 5. 데이터 로딩 성공 시 실제 데이터를 사용한 UI
    return (
        <div className="Advertisement-wapper">
            <div className="Advertisement-main-1">
                <div>
                    <p className="ad-line-1">
                        {/* API에서 받은 닉네임 사용 */}
                        <span className="ad-name">{userInfo?.nickname || '고객'}</span>님, 지금까지 총
                    </p>
                    <div className="ad-line-2">
                        {/* API에서 받은 총 할인 금액 사용 */}
                        <span className="ad-money">{userInfo?.totalDiscountedAmount.toLocaleString() || 0}</span>
                        <span className="ad-unit">원 할인 받았어요!</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Advertisement;
