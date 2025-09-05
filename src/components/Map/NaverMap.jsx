import { useEffect, useRef } from 'react';

export default function NaverMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !window.naver) return;

    const center = new naver.maps.LatLng(37.5656, 126.9779);

    new naver.maps.Map(mapRef.current, {
      center,
      zoom: 17,
    });

    new naver.maps.Marker({
      position: center,
      map: mapRef.current.__naverMap__,
    });
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}
