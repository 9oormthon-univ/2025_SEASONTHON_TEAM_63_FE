import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Footer from '../../components/Footer/Footer';
import { getStoreInfo } from '../../api/storedetail/storeApi'; // API 함수 임포트
import './styles/ChallengeDetailPage.css';
import CheckIcon from '@mui/icons-material/Check';

const ChallengeDetailPage = () => {
  const { storeId, challengeId } = useParams();
  const [footerHeight, setFooterHeight] = useState(0);
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    const fetchStoreName = async () => {
      try {
        const data = await getStoreInfo(storeId);
        setStoreName(data.name);
      } catch (error) {
        console.error('Failed to fetch store name:', error);
        setStoreName('RE:visit'); // 에러 시 기본값
      }
    };

    if (storeId) {
      fetchStoreName();
    }
  }, [storeId]);

  // 실제 앱에서는 API 호출을 통해 challengeId에 맞는 데이터를 가져옵니다.
  const challenge = {
    id: challengeId,
    storeName: '토핑맛집 [피자헛]', // 이 부분은 챌린지 데이터에 따라 다를 수 있습니다.
    title: '피자 5판 먹으면 1판 무료 챌린지',
    dateRange: '8월 20일 ~ 8월 27일',
    progress: 3,
    total: 5,
    goal: 'OO가게 5회이상 방문',
    reward: '30% 할인쿠폰 발급',
    period: '2025.08.31 ~',
    rules: [
      '사장님이 작성한 참여 규칙',
      '사장님이 작성한 참여 규칙',
      '사장님이 작성한 참여 규칙',
    ],
  };

  const progressPercentage = (challenge.progress / challenge.total) * 100;

  return (
    <>
      <PageHeader title="챌린지 상세보기" />
      <div
        className="challenge-detail-main-content"
        style={{ paddingBottom: footerHeight }}
      >
        <h2 className="challenge-page-subtitle">
          {storeName ? `${storeName}에서 진행중인 챌린지` : '챌린지 상세 정보'}
        </h2>

        <div className="challenge-summary-card">
          <div className="challenge-banner">
            <div className="challenge-banner-text">
              <p>{challenge.dateRange}</p>
              <p>
                <strong>{challenge.storeName}</strong>
              </p>
              <h3>{challenge.title}</h3>
            </div>
          </div>
        </div>

        <div className="challenge-progress-section">
          <div className="progress-header">
            <p>진행률</p>
            <span>
              {challenge.progress}/{challenge.total}
            </span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {challenge.total - challenge.progress}회 더 방문하면 챌린지 완료!
          </p>
        </div>

        <div className="challenge-info-section">
          <div className="info-item">
            <span className="info-icon">?</span>
            <div>
              <strong className="info-title">목표</strong>
              <p>{challenge.goal}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🎁</span>
            <div>
              <strong className="info-title">달성시 리워드</strong>
              <p>{challenge.reward}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📅</span>
            <div>
              <strong className="info-title">기간</strong>
              <p>{challenge.period}</p>
            </div>
          </div>
        </div>

        <div className="challenge-rules-section">
          <h4>참여 규칙</h4>
          <ul>
            {challenge.rules.map((rule, index) => (
              <li key={index}>
                <CheckIcon sx={{ color: '#FF6835', marginRight: '12px' }} />
                {rule}
              </li>
            ))}
          </ul>
        </div>

        <button className="challengeDetail-btn">참여하기</button>
      </div>
      <Footer setFooterHeight={setFooterHeight} />
    </>
  );
};

export default ChallengeDetailPage;
