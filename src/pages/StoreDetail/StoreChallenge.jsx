import './styles/StoreChallenge.css';

const StoreChallenge = () => {
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
            <button className="details-button outline">상세보기</button>
            <button className="participate-button">참여하기</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreChallenge;
