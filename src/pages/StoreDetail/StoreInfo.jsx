import infoData from '../../data/storedetail/infoData.json';
import './styles/StoreInfo.css';

const StoreInfo = () => {
  return (
    <div className="info-container">
      <ul className="info-list">
        <li className="info-item">
          <span className="info-item-label">가게명</span>
          <span className="info-item-value">{infoData.name}</span>
        </li>
        <li className="info-item">
          <span className="info-item-label">운영시간</span>
          <span className="info-item-value">{infoData.hours}</span>
        </li>
        <li className="info-item">
          <span className="info-item-label">쉬는시간</span>
          <span className="info-item-value">{infoData.breakTime}</span>
        </li>
        <li className="info-item">
          <span className="info-item-label">휴무일</span>
          <span className="info-item-value">{infoData.holiday}</span>
        </li>
        <li className="info-item">
          <span className="info-item-label">상세주소</span>
          <span className="info-item-value">{infoData.address}</span>
        </li>
      </ul>

      {/* 네이버 지도 컴포넌트 */}
      <div className="map-container">이 자리에 네이버 지도 컴포넌트 삽입</div>
    </div>
  );
};

export default StoreInfo;
