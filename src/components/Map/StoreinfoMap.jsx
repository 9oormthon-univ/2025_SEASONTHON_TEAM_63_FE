import { useEffect, useRef } from 'react';
import './StoreinfoMap.css';

const StoreinfoMap = ({
  latitude = 37.5665,
  longitude = 126.978,
  storeName = '가게 위치',
  className = '',
}) => {
  const mapElement = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Naver Maps API가 로드되었는지 확인
    if (!window.naver || !window.naver.maps) {
      console.error('Naver Maps API가 로드되지 않았습니다.');
      return;
    }

    // 유효한 좌표인지 확인
    if (!latitude || !longitude || latitude === null || longitude === null) {
      console.warn('유효하지 않은 좌표입니다. 기본 위치를 사용합니다.');
      return;
    }

    const { naver } = window;

    // 지도 생성
    if (mapElement.current && !mapRef.current) {
      const mapOptions = {
        center: new naver.maps.LatLng(latitude, longitude),
        zoom: 17,
        minZoom: 8,
        maxZoom: 21,
        mapTypeControl: false,
        logoControl: false,
        scaleControl: false,
        mapDataControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_RIGHT,
          style: naver.maps.ZoomControlStyle.SMALL,
        },
      };

      mapRef.current = new naver.maps.Map(mapElement.current, mapOptions);

      // 마커 생성
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(latitude, longitude),
        map: mapRef.current,
        title: storeName,
        icon: {
          content: `
            <div class="custom-marker">
              <div class="custom-marker-dot"></div>
            </div>
          `,
          anchor: new naver.maps.Point(12, 12),
        },
      });

      // 정보창 생성
      const infoWindow = new naver.maps.InfoWindow({
        content: `
          <div class="info-window">
            <strong class="info-window-title">${storeName}</strong>
          </div>
        `,
      });

      // 마커 클릭 이벤트
      naver.maps.Event.addListener(marker, 'click', () => {
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(mapRef.current, marker);
        }
      });

      // 지도 클릭 시 정보창 닫기
      naver.maps.Event.addListener(mapRef.current, 'click', () => {
        infoWindow.close();
      });
    }

    // 좌표가 변경되었을 때 지도 위치 업데이트
    if (mapRef.current && latitude && longitude) {
      const newCenter = new naver.maps.LatLng(latitude, longitude);
      mapRef.current.setCenter(newCenter);
    }
  }, [latitude, longitude, storeName]);

  return <div ref={mapElement} className={`storeinfo-map ${className}`} />;
};

export default StoreinfoMap;
