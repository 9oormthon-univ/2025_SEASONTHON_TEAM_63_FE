import { useNavigate, useParams } from 'react-router-dom';
import './styles/StoreChallenge.css';

const StoreChallenge = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();

  const challenges = [
    {
      id: 1,
      icon: '📱',
      title: 'SNS 리뷰인증 챌린지',
      endDate: '2025.08.31',
      status: 'active',
    },
    {
      id: 2,
      icon: '📝',
      title: '가게 5회 방문하기',
      endDate: '2025.08.31',
      status: 'active',
    },
    {
      id: 3,
      icon: '💰',
      title: '누적 결제금액 10만원 이상 달성',
      endDate: '2025.08.31',
      status: 'active',
    },
  ];

  const handleDetailsClick = (challengeId) => {
    navigate(`/store/${storeId}/challenge/${challengeId}`);
  };

  return (
    <div className="challenge-container">
      {challenges.map((challenge) => (
        <div key={challenge.id} className="challenge-card">
          <div className="challenge-header">
            <div className="challenge-icon">{challenge.icon}</div>
            <div className="challenge-info">
              <h3 className="challenge-title">{challenge.title}</h3>
              <p className="challenge-date">{challenge.endDate} ~</p>
            </div>
          </div>

          <div className="challenge-actions">
            <button
              onClick={() => handleDetailsClick(challenge.id)}
              className="details-button"
            >
              상세보기
            </button>
            <button className="participate-button">참여하기</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreChallenge;
