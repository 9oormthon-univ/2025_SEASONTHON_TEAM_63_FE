import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/auth/axiosInstance'; // 인증, baseURL 설정된 axios 인스턴스
import './SelectAccount.css';

// --- 날짜 계산 헬퍼 함수 ---
const getWeekRange = () => {
    const today = new Date();
    const day = today.getDay(); // 0(일) ~ 6(토)
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(today.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const pad = (num) => (num < 10 ? '0' : '') + num;
    const toISOStringWithoutZ = (date) =>
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
            date.getMinutes()
        )}:${pad(date.getSeconds())}`;

    return { start: toISOStringWithoutZ(startOfWeek), end: toISOStringWithoutZ(endOfWeek) };
};

// --- 주간 리포트 모달 컴포넌트 ---
const WeeklyReportModal = ({ isOpen, onClose, weeklyData, onDownload }) => {
    if (!isOpen) return null;
    const maxAmount = Math.max(...weeklyData.map((d) => d.amount), 1);
    const hasData = weeklyData.some((d) => d.amount > 0);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>
                    ×
                </button>
                {hasData ? (
                    <>
                        <div className="modal-graph-container">
                            {weeklyData.map((item) => (
                                <div key={item.day} className="modal-bar-wrapper">
                                    <div
                                        className="modal-bar"
                                        style={{
                                            height: `${item.amount === 0 ? 2 : (item.amount / maxAmount) * 100}%`,
                                            minHeight: '2px',
                                        }}
                                    ></div>
                                    <span className="modal-bar-label">{item.day}</span>
                                </div>
                            ))}
                        </div>
                        <div className="modal-y-axis">
                            <span>{Math.round(maxAmount / 10000)}만</span>
                            <span>0</span>
                        </div>
                    </>
                ) : (
                    <div className="no-data-message">이번 주 결제 내역이 없습니다.</div>
                )}
                <button className="modal-download-button" onClick={onDownload}>
                    주간 리포트 다운로드
                </button>
            </div>
        </div>
    );
};

// --- 메인 SelectAccount 컴포넌트 ---
function SelectAccount() {
    const [activeButtonKey, setActiveButtonKey] = useState('personal');
    const [corporations, setCorporations] = useState([]);
    const [progressData, setProgressData] = useState({ paid: 0, total: 0 });
    const [modalData, setModalData] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✨ 데이터 fetching 로직 수정
    const fetchAllData = async (key) => {
        if (!key) return;

        setIsLoading(true);
        setError(null);

        try {
            // ✨ 3개의 API를 동시에 호출
            const { start, end } = getWeekRange();
            let reportUrl = '';
            if (key === 'personal') {
                reportUrl = '/api/expense-reports/personal/period';
            } else {
                reportUrl = `/api/expense-reports/corp/${key}/period`;
            }

            const [paymentResponse, discountResponse, reportResponse] = await Promise.all([
                axiosInstance.get('/api/statistics/payment/this-week'),
                axiosInstance.get('/api/statistics/discounted/this-week'),
                axiosInstance.get(reportUrl, { params: { start, end, size: 1000 } }),
            ]);

            // --- 프로그레스바 데이터 설정 ---
            const totalPayment = paymentResponse.data.data.price || 0; // 실제 금액
            const totalDiscount = discountResponse.data.data.price || 0; // 할인받은 금액
            const paidAfterDiscount = totalPayment - totalDiscount; // 결제 금액 = 실제 - 할인

            setProgressData({
                paid: paidAfterDiscount > 0 ? paidAfterDiscount : 0,
                total: totalPayment,
            });

            // --- 모달 그래프 데이터 설정 ---
            const reports = reportResponse.data.data.content || [];
            const dailyTotals = { 월: 0, 화: 0, 수: 0, 목: 0, 금: 0, 토: 0, 일: 0 };
            const dayMap = ['일', '월', '화', '수', '목', '금', '토'];
            reports.forEach((r) => {
                const date = new Date(r.paymentSnapshotTime);
                if (!isNaN(date)) {
                    dailyTotals[dayMap[date.getDay()]] += r.totalAmount || 0;
                }
            });

            const weeklyChartData = dayMap
                .slice(1)
                .concat(dayMap.slice(0, 1))
                .map((day) => ({ day, amount: dailyTotals[day] }));
            setModalData(weeklyChartData);
        } catch (err) {
            if (err.response?.status !== 401) {
                setError('데이터를 불러오는 데 실패했습니다.');
                console.error('Failed to fetch data:', err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 컴포넌트 첫 로드 시 기본 데이터(personal)를 가져옴
    useEffect(() => {
        fetchAllData('personal');
    }, []);

    // 법인 목록 조회 (최초 1회, 실제 API로 교체 필요)
    useEffect(() => {
        const dummyCorps = [
            { corpId: 5, corpName: '리비짓법인' },
            { corpId: 12, corpName: '공동' },
        ];
        setCorporations(dummyCorps);
    }, []);

    // --- 이벤트 핸들러 ---
    const handleReportClick = async (key) => {
        setActiveButtonKey(key);
        await fetchAllData(key);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleDownload = async () => {
        const { start, end } = getWeekRange();
        let url = '';
        if (activeButtonKey === 'personal') {
            url = '/api/expense-reports/personal/period.csv';
        } else {
            url = `/api/expense-reports/corp/${activeButtonKey}/period.csv`;
        }

        try {
            const response = await axiosInstance.get(url, {
                params: { start, end },
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: 'text/csv' });
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${activeButtonKey}_report_${start.split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            alert('파일 다운로드에 실패했습니다.');
            console.error('Failed to download CSV:', err);
        }
    };

    // --- 렌더링 ---
    const progressPercentage = progressData.total > 0 ? (progressData.paid / progressData.total) * 100 : 0;

    if (error) return <div className="SelectAccount-container error-message">{error}</div>;

    return (
        <>
            <div className="SelectAccount-container">
                {isLoading && <div className="loading-spinner"></div>}
                <div className="section">
                    <h3 className="section-title">결제 리포트</h3>
                    <div className="account-types">
                        <button
                            className={`account-button ${activeButtonKey === 'personal' ? 'active' : ''}`}
                            onClick={() => handleReportClick('personal')}
                        >
                            개인 내역
                        </button>
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
