import { useEffect, useRef } from 'react';

export default function NaverMap({
  center = { lat: 37.5656, lng: 126.9779 },
  zoom = 17,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !window.naver) return;

    const mapCenter = new naver.maps.LatLng(center.lat, center.lng);

    // 지도 인스턴스 생성
    mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: zoom,
    });

    // 마커 생성
    markerRef.current = new naver.maps.Marker({
      position: mapCenter,
      map: mapInstanceRef.current,
    });
  }, []);

  // center가 변경될 때 지도 이동
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      const newCenter = new naver.maps.LatLng(center.lat, center.lng);

      // 지도 중심 이동 (부드러운 애니메이션)
      mapInstanceRef.current.panTo(newCenter);

      // 마커 위치 업데이트
      if (markerRef.current) {
        markerRef.current.setPosition(newCenter);
      }
    }
  }, [center.lat, center.lng]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}
