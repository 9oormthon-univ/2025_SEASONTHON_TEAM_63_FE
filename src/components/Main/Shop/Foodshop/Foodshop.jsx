import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// axios를 직접 임포트하는 대신, 새로 만든 axiosInstance를 임포트합니다.
import axiosInstance from '../../../../api/auth/axiosInstance';
import useFavoriteStore from '../../../../store/favoriteStore';
import '../Shop.css';
import HeartIcon from '../../../../assets/icon/하트.svg?react';

// API_BASE_URL 상수는 axiosInstance에서 이미 관리하므로 여기서는 필요 없습니다.

function Foodshop({ filter }) {
  const navigate = useNavigate();

  // Zustand Store 사용
  const {
    isStoreSubscribed,
    isStoreLoading,
    setStoreSubscription,
    toggleSubscription,
  } = useFavoriteStore();

  // 서버에서 받아온 '전체' 가게 목록을 저장하는 state
  const [allShops, setAllShops] = useState([]);
  // 'filter' 값에 따라 필터링된, 화면에 보여줄 가게 목록 state
  const [filteredShops, setFilteredShops] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. 컴포넌트가 처음 렌더링될 때, 서버로부터 전체 가게 목록을 한 번만 불러옵니다.
  useEffect(() => {
    const fetchAllShops = async () => {
      setLoading(true);
      setError(null);
      try {
        // axios.get을 axiosInstance.get으로 변경합니다.
        const response = await axiosInstance.get('/api/stores');

        // API 응답 구조에 맞춰 데이터를 처리합니다.
        if (response.data && response.data.success) {
          // 실제 데이터는 response.data.data.content에 있습니다.
          const shops = response.data.data.content || [];
          setAllShops(shops);

          // Store에 구독 상태 동기화
          shops.forEach((shop) => {
            setStoreSubscription(shop.id, shop.isSubscribed || false);
          });
        } else {
          // API 응답은 성공(2xx)했지만, success 플래그가 false인 경우
          throw new Error(
            response.data.message || '가게 목록을 가져오는데 실패했습니다.'
          );
        }
      } catch (err) {
        // 네트워크 에러 또는 위에서 던진 에러를 처리합니다.
        console.error('전체 맛집 데이터를 불러오는 데 실패했습니다.', err);
        setError(err.message || '맛집 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllShops();
  }, []); // 의존성 배열이 비어있으므로 최초 1회만 실행됩니다.

  // 2. 전체 가게 목록(allShops)이나 필터(filter) 값이 변경될 때마다 필터링을 다시 수행합니다.
  useEffect(() => {
    if (!filter || !allShops) {
      setFilteredShops([]);
      return;
    }
    // 클라이언트 측에서 카테고리 필터링을 수행합니다.
    const shopsToShow = allShops.filter((shop) => shop.category === filter);
    setFilteredShops(shopsToShow);
  }, [filter, allShops]);

  // 3. 구독(즐겨찾기) 상태를 토글하는 함수 - Store 사용
  const handleToggleSubscribe = async (shopId, isSubscribed) => {
    try {
      await toggleSubscription(shopId, isSubscribed);
    } catch (error) {
      alert('구독 상태 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleMoreClick = () => {
    navigate(`/shops/food/${filter}`);
  };

  if (loading) {
    return (
      <section className="shop-section">
        <p>맛집 목록을 불러오는 중...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="shop-section">
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="shop-section">
      <header className="shop-header">
        <h2 className="shop-title">{filter} 맛집</h2>
        <button onClick={handleMoreClick} className="shop-see-more-btn">
          더보기 &gt;
        </button>
      </header>
      <div className="shop-list-container">
        {filteredShops.length === 0 ? (
          <p>해당 카테고리의 맛집이 없습니다.</p>
        ) : (
          filteredShops.map((shop) => (
            <div
              key={shop.id}
              className="shop-item-card"
              onClick={() => navigate(`/shop/${shop.id}`)}
            >
              <div className="shop-image-placeholder">
                <img
                  src={shop.bannerImageUrl}
                  alt={shop.name}
                  className="shop-image"
                />
                <button
                  className={`shop-like-btn ${
                    isStoreSubscribed(shop.id) ? 'liked' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation(); // 카드 전체 클릭 방지
                    handleToggleSubscribe(shop.id, isStoreSubscribed(shop.id));
                  }}
                  disabled={isStoreLoading(shop.id)}
                >
                  <HeartIcon />
                </button>
              </div>
              <span className="shop-name">{shop.name}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Foodshop;
