// Components/Select account/SelectAccount.jsx

import React, { useState, useEffect } from 'react';
import './SelectAccount.css';

// --- WeeklyReportModal 컴포넌트 (변경 없음) ---
const WeeklyReportModal = ({ isOpen, onClose, weeklyData }) => {
    // ... 이전과 동일 ...
    if (!isOpen) return null;
    const maxAmount = Math.max(...weeklyData.map((d) => d.amount));
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>
                    ×
                </button>
                <div className="modal-graph-container">
                    {weeklyData.map((item) => (
                        <div key={item.day} className="modal-bar-wrapper">
                            <div className="modal-bar" style={{ height: `${(item.amount / maxAmount) * 100}%` }}></div>
                            <span className="modal-bar-label">{item.day}</span>
                        </div>
                    ))}
                </div>
                <div className="modal-y-axis">
                    <span>{Math.round(maxAmount / 10000)}만</span>
                    <span>0</span>
                </div>
                <button className="modal-download-button">주간 리포트 다운로드</button>
            </div>
        </div>
    );
};

// --- 메인 SelectAccount 컴포넌트 ---
function SelectAccount() {
    // --- 1. 데이터 구조화 ---
    const accountData = {
        personal: {
            progress: { paid: 30000, total: 35000 },
            weekly: [
                { day: '월', amount: 320000 },
                { day: '화', amount: 150000 },
                { day: '수', amount: 250000 },
                { day: '목', amount: 380000 },
                { day: '금', amount: 70000 },
                { day: '토', amount: 240000 },
                { day: '일', amount: 180000 },
            ],
        },
        corporate: {
            progress: { paid: 185000, total: 250000 },
            weekly: [
                { day: '월', amount: 120000 },
                { day: '화', amount: 250000 },
                { day: '수', amount: 90000 },
                { day: '목', amount: 150000 },
                { day: '금', amount: 300000 },
                { day: '토', amount: 110000 },
                { day: '일', amount: 50000 },
            ],
        },
        joint: {
            progress: { paid: 85000, total: 100000 },
            weekly: [
                { day: '월', amount: 50000 },
                { day: '화', amount: 80000 },
                { day: '수', amount: 120000 },
                { day: '목', amount: 90000 },
                { day: '금', amount: 150000 },
                { day: '토', amount: 200000 },
                { day: '일', amount: 130000 },
            ],
        },
    };

    // --- 2. 상태 관리 ---
    const [activeAccountType, setActiveAccountType] = useState('personal'); // 기본 선택을 'personal'로 설정
    const [progressData, setProgressData] = useState(accountData.personal.progress); // 프로그레스 바 데이터
    const [modalData, setModalData] = useState([]); // 모달창 그래프 데이터
    const [isModalOpen, setModalOpen] = useState(false);

    // --- 3. 로직 처리 ---
    // activeAccountType이 변경될 때마다 프로그레스 바 데이터를 업데이트
    useEffect(() => {
        setProgressData(accountData[activeAccountType].progress);
    }, [activeAccountType]);

    // 내역 버튼 클릭 시
    const handleReportClick = (type) => {
        setActiveAccountType(type); // 활성화된 버튼 변경 (useEffect 트리거됨)
        setModalData(accountData[type].weekly); // 모달에 표시할 데이터 설정
        setModalOpen(true); // 모달 열기
    };

    // 모달 닫기 시 (선택 상태 유지)
    const closeModal = () => {
        setModalOpen(false);
    };

    const progressPercentage = (progressData.paid / progressData.total) * 100;

    // --- 4. 렌더링 ---
    return (
        <>
            <div className="SelectAccount-container">
                <div className="section">
                    <h3 className="section-title">결제 리포트</h3>
                    <div className="account-types">
                        {['personal', 'corporate', 'joint'].map((type) => (
                            <button
                                key={type}
                                className={`account-button ${activeAccountType === type ? 'active' : ''}`}
                                onClick={() => handleReportClick(type)}
                            >
                                {type === 'personal' && '개인 내역'}
                                {type === 'corporate' && 'OO법인 내역'}
                                {type === 'joint' && '공동 내역'}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="section">
                    <h3 className="section-title">이번주 결제 금액</h3>
                    <div className="progress-bar-container">
                        <div className="progress-bar-filled" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <div className="progress-labels">
                        <span className="label paid-label">결제 금액 : {progressData.paid.toLocaleString()}원</span>
                        <span className="label total-label">실제 금액 : {progressData.total.toLocaleString()}원</span>
                    </div>
                </div>
            </div>

            <WeeklyReportModal isOpen={isModalOpen} onClose={closeModal} weeklyData={modalData} />
        </>
    );
}

export default SelectAccount;
