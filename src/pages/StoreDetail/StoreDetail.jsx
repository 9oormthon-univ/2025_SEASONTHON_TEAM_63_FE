import './styles/Storedetail.css';
import { Outlet, NavLink, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StarRateIcon from '@mui/icons-material/StarRate';
import HeartIcon from '../../assets/icon/하트.svg?react';

import PageHeader from '../../components/ui/PageHeader';
import Footer from '../../components/Footer/Footer';
import { getStoreInfo } from '../../api/storedetail/storeApi';
import useFavoriteStore from '../../store/favoriteStore';

// 평점, 가게 이름 (동적으로 업데이트됨)
export let grade = 4.5;
export let storeName = 'RE:visit';

// 가게 상세페이지 전역에 쓰이는 요소
const StoreDetail = () => {
  const { storeId } = useParams(); // URL에서 storeId 동적 추출
  const [footerHeight, setFooterHeight] = useState(0);

  // Zustand Store 사용
  const {
    isStoreSubscribed,
    isStoreLoading,
    setStoreSubscription,
    toggleSubscription,
  } = useFavoriteStore();

  // 가게 정보 상태 관리
  const [storeInfo, setStoreInfo] = useState({
    name: 'RE:visit',
    bannerImageUrl:
      'https://revisit63.s3.ap-northeast-2.amazonaws.com/public/store-banners/test-fixed.png',
    averageRating: 4.5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Store에서 구독 상태 가져오기
  const currentStoreId = storeId || '123';
  const isSubscribed = isStoreSubscribed(currentStoreId);
  const subscribeLoading = isStoreLoading(currentStoreId);

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
          name: data.name || 'RE:visit',
          bannerImageUrl: data.bannerImageUrl || '',
          averageRating: data.averageRating || 0,
        });

        // Store에 구독 상태 동기화
        setStoreSubscription(currentStoreId, data.isSubscribed || false);

        // export된 변수들 업데이트 (다른 컴포넌트에서 사용할 수 있음)
        grade = data.averageRating || 0;
        storeName = data.name || 'RE:visit';
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

  // 이미지 로딩 에러 처리
  const handleImageError = () => {
    setImageError(true);
  };

  // 찜 상태 토글 함수
  const handleToggleSubscribe = async () => {
    if (subscribeLoading) return; // 이미 처리 중이면 리턴

    try {
      await toggleSubscription(currentStoreId, isSubscribed);
    } catch (error) {
      alert('찜 상태 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 에러 발생 시 로깅
  useEffect(() => {
    if (error) {
      console.warn('StoreDetail 에러:', error);
      // 에러 발생 시에도 사용자에게는 기본값이 보이도록 함
    }
  }, [error]);

  return (
    <div className="store-detail-container">
      <main className="store-detail-main">
        <PageHeader title="가게 정보" />

        {/* 가게 이름, 별점 등 상단 정보 */}
        <section>
          <div className="store-img">
            {loading ? (
              // 로딩 중 스켈레톤
              <div className="store-img-skeleton"></div>
            ) : storeInfo.bannerImageUrl && !imageError ? (
              // 이미지가 있고 로딩 에러가 없는 경우
              <img
                src={storeInfo.bannerImageUrl}
                alt={storeInfo.name}
                className="store-banner-image"
                onError={handleImageError}
              />
            ) : (
              // 이미지가 없거나 로딩 실패한 경우 기본 배경
              <div className="store-img-placeholder"></div>
            )}
            <button
              className={`heart-btn ${isSubscribed ? 'liked' : ''}`}
              onClick={handleToggleSubscribe}
              disabled={subscribeLoading}
            >
              <HeartIcon sc={{ color: isSubscribed ? '#FF6835' : '#999' }} />
            </button>
          </div>

          {loading ? (
            <div className="store-name-skeleton skeleton-text"></div>
          ) : (
            <p className="store-name">{storeInfo.name}</p>
          )}

          <div className="storeMark-container">
            <StarRateIcon sx={{ color: '#FF6835', marginLeft: '12px' }} />
            {loading ? (
              <div className="store-rating-skeleton skeleton-text"></div>
            ) : (
              <p>{storeInfo.averageRating.toFixed(1)}</p>
            )}
          </div>
        </section>

        <nav className="store-nav">
          <NavLink to="menu">메뉴</NavLink>
          <NavLink to="challenge">챌린지</NavLink>
          <NavLink to="review">리뷰</NavLink>
          <NavLink to="info">가게정보</NavLink>
        </nav>

        {/* 탭에 따라 다른 컴포넌트가 이 자리에 렌더링됩니다. */}
        <Outlet />
      </main>

      {/* Footer 컴포넌트를 페이지 하단에 고정 */}
      <Footer setFooterHeight={setFooterHeight} />
    </div>
  );
};

export default StoreDetail;
