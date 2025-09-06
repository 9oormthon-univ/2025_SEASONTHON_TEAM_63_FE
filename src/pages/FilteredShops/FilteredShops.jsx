import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import { subCategoryData } from '../../data/categoryData';
import useFavoriteStore from '../../store/favoriteStore';
import axiosInstance from '../../api/auth/axiosInstance';
import StarRateIcon from '@mui/icons-material/StarRate';
import HeartIcon from '../../assets/icon/하트.svg?react';
import './FilteredShops.css';

const FilteredShops = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    isStoreSubscribed,
    isStoreLoading,
    setStoreSubscription,
    toggleSubscription,
  } = useFavoriteStore();

  // URL 쿼리 파라미터에서 카테고리 정보 가져오기
  const category = searchParams.get('category') || '';

  // 상태 관리
  const [currentSort, setCurrentSort] = useState('추천순');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 카테고리별 가게 목록 가져오기
  useEffect(() => {
    if (!category) {
      setShops([]);
      setLoading(false);
      return;
    }

    const fetchShopsByCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(
          `/api/stores?category=${category}`
        );

        if (response.data && response.data.success) {
          const fetchedShops = response.data.data.content || [];
          setShops(fetchedShops);

          // 받아온 가게들의 구독 상태를 전역 스토어에 동기화
          fetchedShops.forEach((shop) => {
            setStoreSubscription(shop.id, shop.isSubscribed || false);
          });
        } else {
          throw new Error(
            response.data.message || '가게 목록을 가져오는 데 실패했습니다.'
          );
        }
      } catch (err) {
        console.error(
          `${category} 카테고리 가게 데이터를 불러오는 데 실패했습니다.`,
          err
        );
        setError(err.message || '가게 정보를 불러오는 중 오류가 발생했습니다.');
        setShops([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShopsByCategory();
  }, [category, setStoreSubscription]);

  // 구독(즐겨찾기) 상태를 토글하는 함수
  const handleToggleSubscribe = async (shopId) => {
    const isSubscribed = isStoreSubscribed(shopId);
    try {
      await toggleSubscription(shopId, isSubscribed);
    } catch (error) {
      alert('구독 상태 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 가게 상세 페이지로 이동
  const handleShopClick = (shopId) => {
    navigate(`/store/${shopId}`);
  };

  const handleFilterClick = (newFilter) => {
    setSearchParams({ category: newFilter });
  };

  const subCategories = subCategoryData[category] || [];

  const sortedShops = useMemo(() => {
    let sorted = [...shops];

    switch (currentSort) {
      case '주문많은순':
        // 주문 수 기준 정렬 (API에서 해당 필드 제공 시)
        return sorted.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
      case '리뷰많은순':
        // 리뷰 수 기준 정렬
        return sorted.sort(
          (a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)
        );
      case '별점높은순':
        // 별점 기준 정렬
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case '추천순':
      default:
        // 기본 추천순 (API에서 제공하는 순서 유지)
        return sorted;
    }
  }, [shops, currentSort]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="filtered-shops-container">
        <PageHeader title={category || '가게 목록'} />
        <div className="loading-message">
          <p>가게 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="filtered-shops-container">
        <PageHeader title={category || '가게 목록'} />
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="filtered-shops-container">
      <PageHeader title={category || '가게 목록'} />

      {/* 서브 카테고리 탭 (있는 경우에만 표시) */}
      {subCategories.length > 0 && (
        <nav className="sub-category-tabs">
          {subCategories.map((sub) => (
            <button
              key={sub}
              className={`sub-category-btn ${category === sub ? 'active' : ''}`}
              onClick={() => handleFilterClick(sub)}
            >
              {sub}
            </button>
          ))}
        </nav>
      )}

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
        {sortedShops.length === 0 ? (
          <div className="no-shops-message">
            <p>해당 카테고리의 가게가 없습니다.</p>
          </div>
        ) : (
          sortedShops.map((shop) => {
            const isFavorited = isStoreSubscribed(shop.id);
            return (
              <div
                key={shop.id}
                className="list-shop-item"
                onClick={() => handleShopClick(shop.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="list-shop-image">
                  {shop.bannerImageUrl ? (
                    <img
                      src={shop.bannerImageUrl}
                      alt={shop.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="placeholder-image">이미지 없음</div>
                  )}
                </div>
                <div className="list-shop-details">
                  <p className="list-shop-name">{shop.name}</p>
                  <div className="list-shop-rating">
                    <StarRateIcon />
                    <span>{shop.rating || '0.0'}</span>
                  </div>
                  <p className="list-shop-info">
                    {shop.description || '가게 소개글이 없습니다.'}
                  </p>
                  <p className="list-shop-info">
                    위치: {shop.address || '주소 정보 없음'}
                  </p>
                  <p className="list-shop-info">
                    진행중인 챌린지: {shop.challengeCount || 0}개
                  </p>
                </div>
                <button
                  className={`list-like-btn ${isFavorited ? 'liked' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation(); // 부모 클릭 이벤트 방지
                    handleToggleSubscribe(shop.id);
                  }}
                  disabled={isStoreLoading(shop.id)}
                >
                  <HeartIcon />
                </button>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};

export default FilteredShops;
