import { useEffect } from 'react';

const KakaoMap = ({ lat, lng }) => {
  useEffect(() => {
    const container = document.getElementById('map');
    if (window.kakao && window.kakao.maps && container) {
      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);

      // 마커 추가
      const markerPosition = new window.kakao.maps.LatLng(lat, lng);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(map);
    } else {
      console.error(
        '카카오맵 스크립트가 로드되지 않았거나 컨테이너를 찾을 수 없습니다.'
      );
    }
  }, [lat, lng]);

  return <div id="map" style={{ width: '100%', height: '200px' }}></div>;
};

export default KakaoMap;
