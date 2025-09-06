import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getStoreChallenges } from '../../api/storedetail/challenge';
import './styles/StoreChallenge.css';

const StoreChallenge = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API 응답 데이터를 UI 형태로 변환하는 함수
  const transformChallengeData = (apiData) => {
    return apiData.map((challenge) => {
      // type에 따른 아이콘 매핑
      const getIconByType = (type) => {
        switch (type) {
          case 'ORDER':
            return '📝';
          case 'REVIEW':
            return '📱';
          default:
            return '💰';
        }
      };

      // createdAt을 endDate 형태로 변환 (YYYY.MM.DD)
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
      };

      return {
        id: challenge.id,
        icon: getIconByType(challenge.type),
        title: challenge.description,
        endDate: formatDate(challenge.createdAt),
        status: 'active',
      };
    });
  };

  // 챌린지 데이터 가져오기
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const response = await getStoreChallenges(storeId);

        if (response.success) {
          const transformedData = transformChallengeData(response.data);
          setChallenges(transformedData);
        } else {
          setError('챌린지 데이터를 가져오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('챌린지 데이터 조회 오류:', err);
        setError('챌린지 데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchChallenges();
    }
  }, [storeId]);

  const handleDetailsClick = (challengeId) => {
    navigate(`/store/${storeId}/challenge/${challengeId}`);
  };

  const handleParticipateClick = (challengeId) => {
    // 참여하기 버튼 클릭 시 팝업이 열린 상태로 페이지 이동
    navigate(`/store/${storeId}/challenge/${challengeId}`, {
      state: { openModal: true },
    });
  };

  return (
    <div className="challenge-container">
      {loading ? (
        // 스켈레톤 로딩 UI
        <>
          {[1, 2, 3].map((index) => (
            <div key={index} className="skeleton-challenge-card">
              <div className="skeleton-challenge-header">
                <div className="skeleton-challenge-icon skeleton-text"></div>
                <div className="skeleton-challenge-info">
                  <div className="skeleton-challenge-title skeleton-text"></div>
                  <div className="skeleton-challenge-date skeleton-text"></div>
                </div>
              </div>
              <div className="skeleton-challenge-actions">
                <div className="skeleton-button skeleton-text"></div>
                <div className="skeleton-button skeleton-text"></div>
              </div>
            </div>
          ))}
        </>
      ) : error ? (
        <div className="challenge-error-message">{error}</div>
      ) : challenges.length === 0 ? (
        <div className="no-challenges-message">
          진행 중인 챌린지가 없습니다.
        </div>
      ) : (
        challenges.map((challenge) => (
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
              <button
                onClick={() => handleParticipateClick(challenge.id)}
                className="participate-button"
              >
                참여하기
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StoreChallenge;
