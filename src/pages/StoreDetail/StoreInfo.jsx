import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStoreInfo } from '../../api/storedetail/storeApi';
import NaverMap from '../../components/NaverMap';
import './styles/StoreInfo.css';

const StoreInfo = () => {
  const { storeId } = useParams(); // URL에서 storeId 동적 추출

  // 상태 관리
  const [storeInfo, setStoreInfo] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    description: '',
    openingHours: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 시간 포맷팅 함수
  const formatTime = (timeObj) => {
    if (!timeObj) return '-';
    const { hour, minute } = timeObj;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(
      2,
      '0'
    )}`;
  };

  // 가게 정보 API 호출
  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        // storeId가 없으면 기본값 사용 (개발 중)
        const currentStoreId = storeId || '123';
        const data = await getStoreInfo(currentStoreId);

        setStoreInfo({
          name: data.name || '가게명',
          address: data.address || '주소 정보 없음',
          phoneNumber: data.phoneNumber || '전화번호 없음',
          description: data.description || '',
          openingHours: data.openingHours || null,
        });
      } catch (err) {
        console.error('가게 정보 로딩 에러:', err);
        setError(err.message);
        // 에러 발생시에도 기본값 유지
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInfo();
  }, [storeId]);
  return (
    <div className="info-container">
      {loading ? (
        // 로딩 상태 - 기존 스타일 유지한 스켈레톤
        <ul className="info-list">
          {[1, 2, 3, 4, 5].map((index) => (
            <li key={index} className="info-item">
              <span className="info-item-label skeleton-text skeleton-label"></span>
              <span className="info-item-value skeleton-text skeleton-value"></span>
            </li>
          ))}
        </ul>
      ) : error ? (
        // 에러 상태 - 기존 스타일과 일치하는 디자인
        <div className="error-container">
          <div className="error-message">
            <p>😅 가게 정보를 불러올 수 없습니다</p>
            <p className="error-detail">{error}</p>
            <button
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              다시 시도
            </button>
          </div>
        </div>
      ) : (
        // 정상 데이터 렌더링 - 기존 로직 + API 데이터 사용
        <>
          <ul className="info-list">
            <li className="info-item">
              <span className="info-item-label">가게명</span>
              <span className="info-item-value">{storeInfo.name}</span>
            </li>
            <li className="info-item">
              <span className="info-item-label">운영시간</span>
              <span className="info-item-value">
                {storeInfo.openingHours
                  ? `${formatTime(
                      storeInfo.openingHours.openTime
                    )} ~ ${formatTime(storeInfo.openingHours.closeTime)}`
                  : '운영시간 정보 없음'}
              </span>
            </li>
            <li className="info-item">
              <span className="info-item-label">쉬는시간</span>
              <span className="info-item-value">
                {storeInfo.openingHours &&
                storeInfo.openingHours.breakStartTime &&
                storeInfo.openingHours.breakEndTime
                  ? `${formatTime(
                      storeInfo.openingHours.breakStartTime
                    )} ~ ${formatTime(storeInfo.openingHours.breakEndTime)}`
                  : '쉬는시간 없음'}
              </span>
            </li>
            <li className="info-item">
              <span className="info-item-label">휴무일</span>
              <span className="info-item-value">
                {storeInfo.openingHours?.holyDay || '휴무일 정보 없음'}
              </span>
            </li>
            <li className="info-item">
              <span className="info-item-label">상세주소</span>
              <span className="info-item-value">{storeInfo.address}</span>
            </li>
            {storeInfo.phoneNumber && (
              <li className="info-item">
                <span className="info-item-label">전화번호</span>
                <span className="info-item-value">{storeInfo.phoneNumber}</span>
              </li>
            )}
          </ul>

          {/* 네이버 지도 컴포넌트 - 주소 기반 표시 */}
          <div className="map-container">
            <NaverMap address={storeInfo.address} />
          </div>
        </>
      )}
    </div>
  );
};

export default StoreInfo;
