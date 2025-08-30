// Components/Select account/SelectAccount.jsx

import React, { useState } from 'react';
import './SelectAccount.css';

function SelectAccount() {
    // 계좌 등록 여부 상태
    const [isAccountRegistered, setAccountRegistered] = useState(false);
    // 선택된 계좌 타입 상태 ('personal', 'corporate', 'joint')
    const [activeAccountType, setActiveAccountType] = useState('personal');

    // 계좌 등록을 시뮬레이션하는 함수
    const handleRegister = () => {
        setAccountRegistered(true);
    };

    // 결제 금액 데이터 (프로그레스 바 계산용)
    const paymentData = {
        paid: 30000,
        total: 35000,
    };
    const progressPercentage = (paymentData.paid / paymentData.total) * 100;

    return (
        <div className="SelectAccount-container">
            {isAccountRegistered ? (
                // ✅ 계좌 등록 후 화면
                <div className="account-details-view">
                    <div className="section">
                        <h3 className="section-title">내 계좌</h3>
                        <div className="account-types">
                            <button
                                className={`account-button ${activeAccountType === 'personal' ? 'active' : ''}`}
                                onClick={() => setActiveAccountType('personal')}
                            >
                                개인 계좌
                            </button>
                            <button
                                className={`account-button ${activeAccountType === 'corporate' ? 'active' : ''}`}
                                onClick={() => setActiveAccountType('corporate')}
                            >
                                OO법인 계좌
                            </button>
                            <button
                                className={`account-button ${activeAccountType === 'joint' ? 'active' : ''}`}
                                onClick={() => setActiveAccountType('joint')}
                            >
                                계좌 추가하기 +
                            </button>
                        </div>
                    </div>

                    <div className="section">
                        <h3 className="section-title">이번주 결제 금액</h3>
                        <div className="progress-bar-container">
                            <div className="progress-bar-filled" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <div className="progress-labels">
                            <span className="label paid-label">결제 금액 : {paymentData.paid.toLocaleString()}원</span>
                            <span className="label total-label">
                                실제 금액 : {paymentData.total.toLocaleString()}원
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                // 🅾️ 계좌 등록 전 화면
                <div className="add-account-view" onClick={handleRegister}>
                    <button className="add-button">+</button>
                    <span>계좌를 추가해주세요</span>
                </div>
            )}
        </div>
    );
}

export default SelectAccount;
