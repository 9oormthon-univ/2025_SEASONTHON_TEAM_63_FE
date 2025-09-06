import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getParticipatingChallenges } from '../../api/storedetail/challengeRegistration';
import './PersonalInformation.css';

export default function PersonalInformation() {
  const nav = useNavigate();
  const [participatingChallenges, setParticipatingChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // 참여중인 챌린지 데이터 가져오기
  useEffect(() => {
    const fetchParticipatingChallenges = async () => {
      try {
        // API에서 가져오기 시도
        const response = await getParticipatingChallenges();
        if (response.success) {
          setParticipatingChallenges(response.data);
        }
      } catch (error) {
        console.error('API 호출 실패, localStorage에서 가져오기:', error);
        // API 실패 시 localStorage에서 가져오기
        const localData = JSON.parse(
          localStorage.getItem('participatingChallenges') || '[]'
        );
        setParticipatingChallenges(localData);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipatingChallenges();
  }, []);

  // 로그아웃 핸들러 함수
  const handleLogout = () => {
    // localStorage에서 인증 토큰 삭제
    localStorage.removeItem('authToken');
    // 로그인 페이지로 이동하면서 페이지를 완전히 새로고침하여 상태를 초기화
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
        {/* 
          이전 버전에서는 여기에 사용자 정보를 표시하는 로직이 없었습니다.
          필요하다면 로그인 후 상태 관리를 통해 받아온 정보를 표시할 수 있습니다.
        */}
        <div className="pi-user-placeholder">
          <h2>마이페이지</h2>
          <p>나의 활동 내역을 확인해보세요.</p>
        </div>

        <div className="pi-stats">
          <button
            className="pi-stat"
            onClick={() => nav('successful-challenges')}
          >
            성공한 챌린지
          </button>
          <button className="pi-stat" onClick={() => nav('coupons')}>
            쿠폰함
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

      {/* 참여중인 챌린지 섹션 */}
      <section className="pi-challenges-section">
        <h3>참여중인 챌린지</h3>
        {loading ? (
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
                      {challenge.challengeDescription || 'SNS 리뷰인증 챌린지'}
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

      {/* 자식 라우트가 렌더링되는 영역 */}
      <Outlet />
    </div>
  );
}
