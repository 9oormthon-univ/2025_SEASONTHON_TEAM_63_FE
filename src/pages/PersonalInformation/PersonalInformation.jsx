import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useChallengeStore from '../../store/challengeStore';
import axiosInstance from '../../api/auth/axiosInstance'; // 설정된 axios 인스턴스 import
import './PersonalInformation.css';
import ExpandableList from '../../components/ExpandableList/ExpandableList';

export default function PersonalInformation() {
  const nav = useNavigate();

  // --- 상태 변수 ---
  const [completedChallengesCount, setCompletedChallengesCount] = useState(0);
  const [couponCount, setCouponCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // Zustand 챌린지 스토어 사용
  const {
    participatingChallenges,
    refreshParticipatingChallenges,
    isLoading,
    isCacheValid,
  } = useChallengeStore();

  // --- useEffect 통합: 컴포넌트 마운트 시 모든 데이터 로드 ---
  useEffect(() => {
    // 참여중인 챌린지 데이터 로드
    const loadChallenges = async () => {
      if (!isCacheValid()) {
        await refreshParticipatingChallenges();
      }
    };

    // 완료 챌린지, 쿠폰, 리뷰 개수 조회 API 호출 (axiosInstance 사용)
    const fetchCounts = async () => {
      try {
        // 세 개의 API를 동시에 호출
        const [challengeRes, couponRes, reviewRes] = await Promise.all([
          axiosInstance.get('/api/challenges/completed/count'),
          axiosInstance.get('/api/coupons/my/count'),
          axiosInstance.get('/api/reviews/my/count'),
        ]);

        // 각 API 응답 처리
        if (challengeRes.data && challengeRes.data.success) {
          setCompletedChallengesCount(challengeRes.data.data);
        }

        if (couponRes.data && couponRes.data.success) {
          setCouponCount(couponRes.data.data.totalCouponCount);
        }

        if (reviewRes.data && reviewRes.data.success) {
          // API 응답 키가 totalReviewCount라고 가정
          setReviewCount(reviewRes.data.data.totalReviewCount || 0);
        }
      } catch (error) {
        // axios 인터셉터에서 401 에러를 처리하므로 여기서는 그 외의 오류만 로깅
        if (error.response?.status !== 401) {
          console.error(
            '카운트 정보를 불러오는 중 오류가 발생했습니다:',
            error
          );
        }
      }
    };

    loadChallenges();
    fetchCounts();
  }, [refreshParticipatingChallenges, isCacheValid]);

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/'; // 로그인 페이지로 리디렉션하며 상태 초기화
  };

  // 챌린지 상세보기 핸들러
  const handleChallengeDetail = (challenge) => {
    const { storeId, challengeId } = challenge;
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

        {/* 통계 버튼 */}
        <div className="pi-stats">
          <button
            className="pi-stat"
            onClick={() => nav('successful-challenges')}
          >
            성공한 챌린지 {completedChallengesCount}
          </button>
          <button className="pi-stat" onClick={() => nav('coupons')}>
            쿠폰함 {couponCount}
          </button>
          <button className="pi-stat" onClick={() => nav('reviews')}>
            내가 쓴 리뷰 {reviewCount}
          </button>
        </div>

        {/* 로그아웃 버튼 */}
        <div style={{ marginTop: '20px', width: '100%' }}>
          <button onClick={handleLogout} className="pi-logout-button">
            로그아웃
          </button>
        </div>
      </section>

      {/* 자식 라우트 렌더링 영역 */}
      <Outlet />

      {/* 참여중인 챌린지 섹션 */}
      <section className="pi-challenges-section">
        <ExpandableList maxHeight={200}>
          <h3>참여중인 챌린지</h3>
          {isLoading ? (
            <div className="pi-loading">로딩 중...</div>
          ) : participatingChallenges.length > 0 ? (
            participatingChallenges
              .filter((challenge) => challenge.status === 'PARTICIPATING')
              .map((challenge, index) => (
                <div
                  key={challenge.challengeId || index}
                  className="pi-challenge-card"
                >
                  <div className="pi-challenge-header">
                    <div className="pi-challenge-icon">📱</div>
                    <div className="pi-challenge-info">
                      <h4>
                        {challenge.challengeDescription ||
                          'SNS 리뷰인증 챌린지'}
                      </h4>
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
                      {challenge.currentOrderCount || 0}/
                      {challenge.targetOrderCount || 5}
                    </span>
                  </div>
                  <div className="pi-challenge-actions">
                    <button
                      className="pi-challenge-detail-btn"
                      onClick={() => handleChallengeDetail(challenge)}
                    >
                      상세보기
                    </button>
                    <button className="pi-challenge-complete-btn">
                      챌린지 완료
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="pi-no-challenges">
              <p>참여중인 챌린지가 없습니다.</p>
            </div>
          )}
        </ExpandableList>
      </section>

      {/* 계정관리 및 고객지원 섹션 */}
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
