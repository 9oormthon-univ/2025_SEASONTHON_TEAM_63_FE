import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useChallengeStore from '../../store/challengeStore';
import './PersonalInformation.css';

export default function PersonalInformation() {
    const nav = useNavigate();

    // --- 추가된 상태 변수 ---
    const [completedChallengesCount, setCompletedChallengesCount] = useState(0);
    const [couponCount, setCouponCount] = useState(0);

    // Zustand 챌린지 스토어 사용
    const { participatingChallenges, refreshParticipatingChallenges, isLoading, isCacheValid } = useChallengeStore();

    // --- useEffect 통합: 컴포넌트 마운트 시 모든 데이터 로드 ---
    useEffect(() => {
        // 참여중인 챌린지 데이터 로드
        const loadChallenges = async () => {
            if (!isCacheValid()) {
                await refreshParticipatingChallenges();
            }
        };

        // --- 추가된 API 호출 로직 ---
        const fetchCounts = async () => {
            // 인증 토큰 가져오기
            const token = localStorage.getItem('authToken');
            const headers = {
                'Content-Type': 'application/json',
                // 토큰이 있으면 Authorization 헤더 추가
                ...(token && { Authorization: `Bearer ${token}` }),
            };

            try {
                // 완료한 챌린지 수 조회 API 호출
                const challengeRes = await fetch('http://43.201.107.27:8080/api/challenges/completed/count', {
                    headers,
                });
                const challengeData = await challengeRes.json();
                if (challengeData.success) {
                    setCompletedChallengesCount(challengeData.data);
                }

                // 보유 쿠폰 수 조회 API 호출
                const couponRes = await fetch('http://43.201.107.27:8080/api/coupons/my/count', { headers });
                const couponData = await couponRes.json();
                if (couponData.success && couponData.data) {
                    setCouponCount(couponData.data.totalCouponCount);
                }
            } catch (error) {
                console.error('Failed to fetch counts:', error);
            }
        };

        loadChallenges();
        fetchCounts();
    }, [refreshParticipatingChallenges, isCacheValid]);

    // 로그아웃 핸들러 함수
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        window.location.href = '/';
    };

    // 챌린지 상세보기 핸들러
    const handleChallengeDetail = (challenge) => {
        const storeId = challenge.storeId;
        const challengeId = challenge.challengeId;
        nav(`/store/${storeId}/challenge/${challengeId}`);
    };

    return (
        <div className="pi-wrap">
            {/* 헤더/프로필 UI */}
            <section className="pi-profile-card">
                <div className="pi-user-placeholder">
                    <h2>마이페이지</h2>
                    <p>나의 활동 내역을 확인해보세요.</p>
                </div>

                {/* --- UI가 업데이트된 통계 버튼 --- */}
                <div className="pi-stats">
                    <button className="pi-stat" onClick={() => nav('successful-challenges')}>
                        성공한 챌린지 {completedChallengesCount}
                    </button>
                    <button className="pi-stat" onClick={() => nav('coupons')}>
                        쿠폰함 {couponCount}
                    </button>
                    <button className="pi-stat" onClick={() => nav('reviews')}>
                        내가 쓴 리뷰
                    </button>
                </div>

                {/* 로그아웃 버튼 */}
                <div style={{ marginTop: '20px', width: '100%' }}>
                    <button onClick={handleLogout} className="pi-logout-button">
                        로그아웃
                    </button>
                </div>
            </section>

            {/* 자식 라우트가 렌더링되는 영역 */}
            <Outlet />

            {/* 참여중인 챌린지 섹션 */}
            <section className="pi-challenges-section">
                <h3>참여중인 챌린지</h3>
                {isLoading ? (
                    <div className="pi-loading">로딩 중...</div>
                ) : participatingChallenges.length > 0 ? (
                    participatingChallenges
                        .filter((challenge) => challenge.status === 'PARTICIPATING')
                        .map((challenge, index) => (
                            <div key={challenge.challengeId || index} className="pi-challenge-card">
                                <div className="pi-challenge-header">
                                    <div className="pi-challenge-icon">📱</div>
                                    <div className="pi-challenge-info">
                                        <h4>{challenge.challengeDescription || 'SNS 리뷰인증 챌린지'}</h4>
                                        <p>{challenge.storeName || '가게이름'}</p>
                                        <span className="pi-challenge-date">2025.08.31</span>
                                    </div>
                                </div>
                                <div className="pi-challenge-progress">
                                    <div className="pi-progress-bar">
                                        <div
                                            className="pi-progress-fill"
                                            style={{
                                                width: `${
                                                    ((challenge.currentOrderCount || 0) /
                                                        (challenge.targetOrderCount || 5)) *
                                                    100
                                                }%`,
                                            }}
                                        ></div>
                                    </div>
                                    <span className="pi-progress-text">
                                        {challenge.currentOrderCount || 0}/{challenge.targetOrderCount || 5}
                                    </span>
                                </div>
                                <div className="pi-challenge-actions">
                                    <button
                                        className="pi-challenge-detail-btn"
                                        onClick={() => handleChallengeDetail(challenge)}
                                    >
                                        상세보기
                                    </button>
                                    <button className="pi-challenge-complete-btn">챌린지 완료</button>
                                </div>
                            </div>
                        ))
                ) : (
                    <div className="pi-no-challenges">
                        <p>참여중인 챌린지가 없습니다.</p>
                    </div>
                )}
            </section>

            {/* 계정관리 섹션 */}
            <section className="pi-account-section">
                <h3>계정관리</h3>
                <div className="pi-menu-list">
                    <button className="pi-menu-item" onClick={() => nav('profile-edit')}>
                        회원정보 수정
                    </button>
                    <button className="pi-menu-item" onClick={() => nav('settings')}>
                        환경설정
                    </button>
                </div>
            </section>

            {/* 고객지원 섹션 */}
            <section className="pi-support-section">
                <h3>고객지원</h3>
                <div className="pi-menu-list">
                    <button className="pi-menu-item" onClick={() => nav('faq')}>
                        FAQ
                    </button>
                </div>
            </section>
        </div>
    );
}
