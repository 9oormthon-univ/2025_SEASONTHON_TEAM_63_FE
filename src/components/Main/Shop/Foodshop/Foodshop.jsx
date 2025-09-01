import { useNavigate } from 'react-router-dom';
import '../Shop.css';
import HeartIcon from '../../../../assets/icon/하트.svg?react';

// 전역 스토어와 중앙 데이터를 가져옵니다.
import useFavoriteStore from '../../../../store/favoriteStore';
import { shopsByFilter } from '../../../../data/shops'; // 수정된 경로

function Foodshop({ filter }) {
  const navigate = useNavigate(); // 네비게이션 추가 /김성수
  const { favoriteShopIds, toggleFavorite } = useFavoriteStore();
  const currentShops = shopsByFilter[filter] || [];

  const handleMoreClick = () => {
    // Note: We need to know the main category ('food') to build the correct URL.
    // For now, it's hardcoded. This could be improved by passing the category as a prop.
    navigate(`/shops/food/${filter}`); // 네비게이션 필터 / 김성수
  };

  return (
    <section className="shop-section">
      <header className="shop-header">
        <h2 className="shop-title">{filter} 맛집</h2>
        {/* 더보기 버튼 추가 / 김성수 */}
        <button onClick={handleMoreClick} className="shop-see-more-btn">
          더보기 &gt;
        </button>
      </header>
      <div className="shop-list-container">
        {currentShops.map((shop) => {
          const isFavorited = favoriteShopIds.has(shop.id);
          return (
            <div key={shop.id} className="shop-item-card">
              <div className="shop-image-placeholder">
                <button
                  className={`shop-like-btn ${isFavorited ? 'liked' : ''}`}
                  onClick={() => toggleFavorite(shop.id)}
                >
                  <HeartIcon />
                </button>
              </div>
              <span className="shop-name">{shop.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Foodshop;
