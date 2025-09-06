import './Favorite.css';
import HeartIcon from '../../assets/icon/하트.svg?react';
import useFavoriteStore from '../../store/favoriteStore'; //실제 경로 확인

function ShopCard({ shop }) {
  // [수정] 스토어에서 올바른 함수 이름인 toggleSubscription을 가져옵니다.
  const { toggleSubscription, isStoreLoading } = useFavoriteStore();

  // 이 컴포넌트는 Favorite 페이지에 있으므로, 항상 '찜 된 상태(true)'입니다.
  const isSubscribed = true;
  const isLoading = isStoreLoading(shop.id);

  // 주소 객체를 문자열로 변환하는 헬퍼 함수
  const formatAddress = (address) => {
    if (typeof address === 'string') {
      return address;
    }
    if (typeof address === 'object' && address !== null) {
      return (
        address.fullAddress ||
        address.roadAddress ||
        address.detailAddress ||
        '주소 정보 없음'
      );
    }
    return '주소 정보 없음';
  };

  // 안전하게 값을 문자열로 변환하는 헬퍼 함수
  const safeToString = (value, fallback = '') => {
    if (value === null || value === undefined) {
      return fallback;
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <div className="ShopCard-container">
      <button
        className="shop-like-btn liked"
        // [수정] toggleSubscription 함수를 호출하고, 찜 해제를 위해 현재 상태(true)를 전달합니다.
        onClick={() => toggleSubscription(shop.id, isSubscribed)}
        disabled={isLoading} // API 처리 중에는 버튼 비활성화
      >
        <HeartIcon />
      </button>

      <div className="ShopCard-image-placeholder">
        {shop.bannerImageUrl ? (
          <img
            src={shop.bannerImageUrl}
            alt={shop.name}
            className="ShopCard-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="placeholder-text">이미지 없음</div>
        )}
      </div>

      <div className="ShopCard-details">
        <h3 className="ShopCard-name">
          {safeToString(shop.name, '가게명 없음')}
        </h3>
        <div className="ShopCard-rating">
          <span>★ {shop.averageRating?.toFixed(1) || '별점 없음'}</span>
        </div>
        <p className="ShopCard-description">
          {safeToString(shop.description, '가게 소개글이 없습니다.')}
        </p>
        <p className="ShopCard-location">위치: {formatAddress(shop.address)}</p>

        <p className="ShopCard-stats">
          주문 {safeToString(shop.orderCount, '0')}회 | 리뷰{' '}
          {safeToString(shop.reviewCount, '0')}개
        </p>
      </div>
    </div>
  );
}

export default ShopCard;
