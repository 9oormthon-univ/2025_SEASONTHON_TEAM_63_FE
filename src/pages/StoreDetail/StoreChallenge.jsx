import './styles/StoreChallenge.css';

const StoreChallenge = () => {
  return (
    <div className="challenge-container">
      <div className="challenge-card">
        <textarea placeholder="챌린지 내용이 여기에 표시됩니다."></textarea>
        <button className="details-button">상세보기</button>
      </div>
      <a className="verify-link">챌린지 인증하기</a>
    </div>
  );
};

export default StoreChallenge;
