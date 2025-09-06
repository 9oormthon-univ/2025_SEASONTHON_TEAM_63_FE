// Components/Select account/SelectAccount.jsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/auth/axiosInstance'; // 사용자 설정 axios 인스턴스
import './SelectAccount.css';

// --- 날짜 계산 헬퍼 함수 (변경 없음) ---
const getWeekRange = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(today.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const toISOStringWithoutZ = (date) => {
        const pad = (num) => (num < 10 ? '0' : '') + num;
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
            date.getMinutes()
        )}:${pad(date.getSeconds())}`;
    };
    return { start: toISOStringWithoutZ(startOfWeek), end: toISOStringWithoutZ(endOfWeek) };
};

// --- 주간 리포트 모달 컴포넌트 (변경 없음) ---
const WeeklyReportModal = ({ isOpen, onClose, weeklyData, onDownload }) => {
    if (!isOpen) return null;
    const maxAmount = Math.max(...weeklyData.map((d) => d.amount), 1);
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content2" onClick={(e) => e.stopPropagation()}>
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
                <button className="modal-download-button" onClick={onDownload}>
                    주간 리포트 다운로드
                </button>
            </div>
        </div>
    );
};

// --- 메인 SelectAccount 컴포넌트 ---
function SelectAccount() {
    // --- 상태 관리 ---
    const [activeButtonKey, setActiveButtonKey] = useState('personal'); // 활성화된 버튼 키 ('personal' 또는 corpId)
    const [corporations, setCorporations] = useState([]); // 사용자 소속 법인 목록
    const [progressData, setProgressData] = useState({ paid: 0, total: 350000 });
    const [modalData, setModalData] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 데이터 처리 로직 ---

    // 1. 컴포넌트 마운트 시, 사용자 소속 법인 목록 조회
    useEffect(() => {
        const fetchUserCorporations = async () => {
            try {
                // ⚠️ 중요: 이 부분은 실제 '사용자 소속 법인 목록 조회' API로 교체해야 합니다.
                // const response = await axiosInstance.get('/api/corporations/my-list');
                // setCorporations(response.data.data);

                // API가 없으므로, 임시 더미 데이터로 대체합니다.
                const dummyCorps = [
                    { corpId: 5, corpName: 'OO법인' },
                    { corpId: 12, corpName: '공동' },
                ];
                setCorporations(dummyCorps);
            } catch (err) {
                console.error('Failed to fetch corporations:', err);
                setError('법인 목록을 불러오는 데 실패했습니다.');
            }
        };
        fetchUserCorporations();
    }, []); // 최초 한 번만 실행

    // 2. 활성화된 버튼(activeButtonKey)이 변경될 때마다 해당 리포트 데이터 조회
    useEffect(() => {
        const fetchAccountData = async () => {
            if (!activeButtonKey) return; // 선택된 버튼이 없으면 실행 안함

            setIsLoading(true);
            setError(null);
            const { start, end } = getWeekRange();

            let url = '';
            let params = { start, end, size: 1000 };

            if (activeButtonKey === 'personal') {
                url = `/api/expense-reports/personal/period`;
            } else {
                // activeButtonKey가 corpId인 경우
                url = `/api/expense-reports/corp/${activeButtonKey}/period`;
            }

            try {
                const response = await axiosInstance.get(url, { params });
                const reports = response.data.data.content;

                // 주간 결제 금액 (프로그레스 바) 계산
                const totalPaid = reports.reduce((sum, report) => sum + report.totalAmount, 0);
                setProgressData((prev) => ({ ...prev, paid: totalPaid }));

                // 모달 그래프용 요일별 데이터 계산
                const dailyTotals = { 월: 0, 화: 0, 수: 0, 목: 0, 금: 0, 토: 0, 일: 0 };
                const dayMap = ['일', '월', '화', '수', '목', '금', '토'];
                reports.forEach((report) => {
                    const dayOfWeek = dayMap[new Date(report.paymentSnapshotTime).getDay()];
                    if (dailyTotals.hasOwnProperty(dayOfWeek)) {
                        dailyTotals[dayOfWeek] += report.totalAmount;
                    }
                });

                const weeklyChartData = dayMap
                    .slice(1)
                    .concat(dayMap.slice(0, 1))
                    .map((day) => ({ day, amount: dailyTotals[day] }));
                setModalData(weeklyChartData); // 모달 데이터는 항상 설정 (버튼 클릭 시 보이도록)
            } catch (err) {
                if (err.response?.status !== 401) {
                    console.error('Failed to fetch data:', err);
                    setError('데이터를 불러오는 데 실패했습니다.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccountData();
    }, [activeButtonKey]);

    // --- 이벤트 핸들러 ---

    const handleReportClick = (key) => {
        setActiveButtonKey(key);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleDownload = async () => {
        const { start, end } = getWeekRange();
        let url = '';
        if (activeButtonKey === 'personal') {
            url = `/api/expense-reports/personal/period.csv`;
        } else {
            url = `/api/expense-reports/corp/${activeButtonKey}/period.csv`;
        }

        try {
            const response = await axiosInstance.get(url, {
                params: { start, end },
                responseType: 'blob',
            });

            const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', `${activeButtonKey}_report_${start.split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            if (err.response?.status !== 401) {
                console.error('Failed to download CSV:', err);
                alert('파일 다운로드에 실패했습니다.');
            }
        }
    };

    const progressPercentage = progressData.total > 0 ? (progressData.paid / progressData.total) * 100 : 0;

    if (error) return <div className="SelectAccount-container error-message">{error}</div>;

    // --- 렌더링 ---
    return (
        <>
            <div className="SelectAccount-container">
                {isLoading && <div className="loading-spinner"></div>}
                <div className="section">
                    <h3 className="section-title">결제 리포트</h3>
                    <div className="account-types">
                        {/* 개인 내역 버튼 */}
                        <button
                            className={`account-button ${activeButtonKey === 'personal' ? 'active' : ''}`}
                            onClick={() => handleReportClick('personal')}
                        >
                            개인 내역
                        </button>

                        {/* 법인/공동 내역 버튼 (동적 생성) */}
                        {corporations.map((corp) => (
                            <button
                                key={corp.corpId}
                                className={`account-button ${activeButtonKey === corp.corpId ? 'active' : ''}`}
                                onClick={() => handleReportClick(corp.corpId)}
                            >
                                {corp.corpName} 내역
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

            <WeeklyReportModal
                isOpen={isModalOpen}
                onClose={closeModal}
                weeklyData={modalData}
                onDownload={handleDownload}
            />
        </>
    );
}

export default SelectAccount;
