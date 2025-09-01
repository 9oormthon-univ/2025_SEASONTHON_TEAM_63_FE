import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import { subCategoryData } from '../../data/categoryData';
import { shopsByFilter } from '../../data/shops';
import useFavoriteStore from '../../store/favoriteStore';
import StarRateIcon from '@mui/icons-material/StarRate';
import HeartIcon from '../../assets/icon/하트.svg?react';
import './FilteredShops.css';

const FilteredShops = () => {
  const { category, filter } = useParams();
  const navigate = useNavigate();
  const { favoriteShopIds, toggleFavorite } = useFavoriteStore();

  const [currentSort, setCurrentSort] = useState('추천순');

  const handleFilterClick = (newFilter) => {
    navigate(`/shops/${category}/${newFilter}`);
  };

  const subCategories = subCategoryData[category] || [];
  const shops = shopsByFilter[filter] || [];

  const sortedShops = useMemo(() => {
    let sorted = [...shops];
    // Add sorting logic here based on currentSort
    // For now, just returns the original array
    return sorted;
  }, [shops, currentSort]);

  return (
    <div className="filtered-shops-container">
      <PageHeader title={filter} />

      <nav className="sub-category-tabs">
        {subCategories.map((sub) => (
          <button
            key={sub}
            className={`sub-category-btn ${filter === sub ? 'active' : ''}`}
            onClick={() => handleFilterClick(sub)}
          >
            {sub}
          </button>
        ))}
      </nav>

      <div className="sorting-filters">
        {['추천순', '주문많은순', '리뷰많은순', '별점높은순'].map((sort) => (
          <button
            key={sort}
            className={`sorting-btn ${currentSort === sort ? 'active' : ''}`}
            onClick={() => setCurrentSort(sort)}
          >
            {sort}
          </button>
        ))}
      </div>

      <main className="shop-list">
        {sortedShops.map((shop) => {
          const isFavorited = favoriteShopIds.has(shop.id);
          return (
            <div key={shop.id} className="list-shop-item">
              <div className="list-shop-image"></div>
              <div className="list-shop-details">
                <p className="list-shop-name">{shop.name}</p>
                <div className="list-shop-rating">
                  <StarRateIcon />
                  <span>{shop.rating}</span>
                </div>
                <p className="list-shop-info">가게 소개글: ~~</p>
                <p className="list-shop-info">위치: ~~</p>
                <p className="list-shop-info">진행중인 챌린지: ~~</p>
              </div>
              <button
                className={`list-like-btn ${isFavorited ? 'liked' : ''}`}
                onClick={() => toggleFavorite(shop.id)}
              >
                <HeartIcon />
              </button>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default FilteredShops;
