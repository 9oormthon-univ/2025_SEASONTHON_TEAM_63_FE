import { useState, useRef } from 'react';
import './Position.css';
import SearchIcon from '@mui/icons-material/Search';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import NaverMap from '../../components/Map/NaverMap';
import PageHeader from '../../components/ui/PageHeader';

const Position = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(true);
  const [sheetY, setSheetY] = useState(0);
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

  return (
    <div className="position-container">
      <PageHeader title="현재위치" />

      <main className="position-main">
        <div className="map-area">
          <NaverMap />
          <button
            className="current-location-btn-on-map"
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
            <p>상세주소</p>
            <div className="search-input-container">
              <input type="search" placeholder="주소를 입력하세요" />
              <SearchIcon className="search-icon" />
            </div>
            <button className="set-location-btn">현재위치로 설정</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Position;
