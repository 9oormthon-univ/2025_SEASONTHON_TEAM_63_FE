import { useState, useRef } from 'react';
import DaumPostcode from 'react-daum-postcode';
import './Position.css';
import SearchIcon from '@mui/icons-material/Search';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import NaverMap from '../../components/Map/NaverMap';
import PageHeader from '../../components/ui/PageHeader';

const Position = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(true);
  const [sheetY, setSheetY] = useState(0);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 }); // 서울 기본값
  const sheetRef = useRef(null);
  const dragStartY = useRef(0);

  // 토글 핸들링 로직
  const handleDragStart = (e) => {
    if (!isSheetOpen) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartY.current = y;
    sheetRef.current.style.transition = 'none';
  };

  const handleDragMove = (e) => {
    if (dragStartY.current === 0 || !isSheetOpen) return;

    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = y - dragStartY.current;

    if (deltaY > 0) {
      setSheetY(deltaY);
    }
  };

  const handleDragEnd = () => {
    if (!isSheetOpen) return;
    sheetRef.current.style.transition = 'transform 0.3s ease-out';
    if (sheetY > 100) {
      setIsSheetOpen(false);
    } else {
      setSheetY(0);
    }
    dragStartY.current = 0;
  };

  const handleSheetClick = () => {
    if (!isSheetOpen) {
      setSheetY(0);
      setIsSheetOpen(true);
    }
  };

  // 주소 검색 핸들러
  const handleAddressSearch = () => {
    setIsPostcodeOpen(true);
  };

  // 다음 우편번호 API 완료 핸들러
  const handleAddressComplete = (data) => {
    const { address, roadAddress, addressType, jibunAddress } = data;
    const finalAddress = roadAddress || address;

    // 네이버 Geocoding API를 사용한 좌표 변환
    const geocodeAddress = async (address) => {
      try {
        // 네이버 Geocoding API 호출 (클라이언트에서 직접 호출하기 어려우므로 대안 방법 사용)
        // 다음 우편번호 API의 좌표 정보 활용
        if (data.bname && data.sido && data.sigungu) {
          // 기본 좌표 설정 (서울 중심)
          let coords = { lat: 37.5665, lng: 126.978 };

          // 주요 지역별 대략적인 좌표 설정
          const regionCoords = {
            서울: { lat: 37.5665, lng: 126.978 },
            부산: { lat: 35.1796, lng: 129.0756 },
            대구: { lat: 35.8714, lng: 128.6014 },
            인천: { lat: 37.4563, lng: 126.7052 },
            광주: { lat: 35.1595, lng: 126.8526 },
            대전: { lat: 36.3504, lng: 127.3845 },
            울산: { lat: 35.5384, lng: 129.3114 },
            세종: { lat: 36.48, lng: 127.289 },
            경기: { lat: 37.4138, lng: 127.5183 },
            강원: { lat: 37.8228, lng: 128.1555 },
            충북: { lat: 36.6357, lng: 127.4917 },
            충남: { lat: 36.5184, lng: 126.8 },
            전북: { lat: 35.7175, lng: 127.153 },
            전남: { lat: 34.8679, lng: 126.991 },
            경북: { lat: 36.4919, lng: 128.8889 },
            경남: { lat: 35.4606, lng: 128.2132 },
            제주: { lat: 33.4996, lng: 126.5312 },
          };

          // 시도에 따른 좌표 설정
          for (const [region, coordinate] of Object.entries(regionCoords)) {
            if (data.sido.includes(region)) {
              coords = coordinate;
              break;
            }
          }

          // 선택된 주소와 좌표 저장
          setSelectedAddress(finalAddress);
          setSelectedCoordinates(coords);

          console.log('주소 검색 완료:', finalAddress, coords);
        }
      } catch (error) {
        console.error('좌표 변환 오류:', error);
        alert('주소를 좌표로 변환하는 중 오류가 발생했습니다.');
      }
    };

    geocodeAddress(finalAddress);
    setIsPostcodeOpen(false);
  };

  // "현재위치로 설정" 버튼 핸들러
  const handleSetLocation = () => {
    if (selectedCoordinates) {
      // 지도를 선택된 주소 좌표로 이동
      setMapCenter(selectedCoordinates);
      alert(`선택한 주소로 지도가 이동되었습니다: ${selectedAddress}`);
      console.log('지도 이동:', selectedCoordinates);
    } else {
      alert('먼저 주소를 검색해주세요.');
    }
  };

  // GPS 현재 위치 가져오기 핸들러
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // 지도를 현재 GPS 위치로 이동
          setMapCenter(coords);
          setSelectedAddress('현재 위치');
          setSelectedCoordinates(coords);

          console.log('GPS 위치로 이동:', coords);
          alert('현재 GPS 위치로 지도가 이동되었습니다.');
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
          let errorMessage = '위치 정보를 가져올 수 없습니다.';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                '위치 접근 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = '위치 정보를 사용할 수 없습니다.';
              break;
            case error.TIMEOUT:
              errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
              break;
            default:
              errorMessage = '알 수 없는 오류가 발생했습니다.';
              break;
          }

          alert(errorMessage);
        },
        {
          enableHighAccuracy: true, // 높은 정확도 요청
          timeout: 10000, // 10초 타임아웃
          maximumAge: 60000, // 1분간 캐시된 위치 사용
        }
      );
    } else {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
    }
  };

  return (
    <div className="position-container">
      <PageHeader title="현재위치" />

      <main className="position-main">
        <div className="map-area">
          <NaverMap center={mapCenter} />
          <button
            className="current-location-btn-on-map"
            onClick={handleGetCurrentLocation}
            style={{
              bottom: isSheetOpen
                ? 300 - sheetY // sheet 드래그 시 따라 움직이도록
                : 60,
            }}
          >
            <GpsFixedIcon sx={{ color: '#FF7335' }} />
          </button>
        </div>

        <div
          ref={sheetRef}
          className={`bottom-sheet ${isSheetOpen ? 'open' : 'closed'}`}
          style={{
            transform: `translateY(${isSheetOpen ? sheetY : 240}px)`,
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onMouseMove={handleDragMove}
          onTouchMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onTouchEnd={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onClick={handleSheetClick}
        >
          <div className="drag-handle-bar"></div>
          <div className="sheet-content">
            <h2>현재위치 주소/가게명</h2>
            <p>{selectedAddress || '상세주소'}</p>
            <div
              className="search-input-container"
              onClick={handleAddressSearch}
            >
              <input
                type="search"
                placeholder="주소를 입력하세요"
                value={selectedAddress}
                readOnly
                style={{ cursor: 'pointer' }}
              />
              <SearchIcon className="search-icon" />
            </div>
            <button
              className="set-location-btn"
              onClick={handleSetLocation}
              disabled={!selectedCoordinates}
              style={{
                backgroundColor: selectedCoordinates ? '#7547FF' : '#ccc',
                cursor: selectedCoordinates ? 'pointer' : 'not-allowed',
              }}
            >
              현재위치로 설정
            </button>
          </div>
        </div>
      </main>

      {/* 다음 우편번호 검색 모달 */}
      {isPostcodeOpen && (
        <div className="postcode-modal">
          <div className="postcode-modal-content">
            <div className="postcode-header">
              <h2>주소 검색</h2>
              <button
                className="close-button"
                onClick={() => setIsPostcodeOpen(false)}
              >
                ✕
              </button>
            </div>
            <DaumPostcode
              onComplete={handleAddressComplete}
              onClose={() => setIsPostcodeOpen(false)}
              style={{ width: '100%', height: '400px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Position;
