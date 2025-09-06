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
  const [currentSort, setCurrentSort] = useState('POPULAR'); // 백엔드 API 형식으로 변경
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // 정렬 옵션 매핑
  const sortMapping = {
    인기순: 'POPULAR',
    최신순: 'LATEST',
    별점높은순: 'RATING',
    리뷰많은순: 'REVIEW_COUNT',
  };

  const sortOptions = ['인기순', '최신순', '별점높은순', '리뷰많은순'];

  // 카테고리별 가게 목록 가져오기
  useEffect(() => {
    if (!category) {
      setShops([]);
      setLoading(false);
      return;
    }

    const fetchShopsByCategory = async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        // GET 요청으로 쿼리 파라미터 전송
        const params = new URLSearchParams({
          page: page,
          size: pagination.size,
          sort: sortMapping[currentSort] || 'POPULAR',
          category: category,
        });

        console.log('API 요청 URL:', `/api/stores?${params.toString()}`); // 디버깅용

        const response = await axiosInstance.get(
          `/api/stores?${params.toString()}`
        );

        if (response.data && response.data.success) {
          const responseData = response.data.data;
          const fetchedShops = responseData.content || [];

          console.log('API 응답 데이터:', responseData); // 디버깅용
          console.log('가게 목록 샘플:', fetchedShops[0]); // 디버깅용

          setShops(fetchedShops);

          // 페이징 정보 업데이트
          setPagination({
            page: responseData.page,
            size: responseData.size,
            totalPages: responseData.totalPages,
            totalElements: responseData.totalElements,
            hasNext: responseData.hasNext,
            hasPrevious: responseData.hasPrevious,
          });

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

    fetchShopsByCategory(1); // 첫 페이지부터 시작
  }, [category, currentSort, setStoreSubscription]);

  // 페이지 로드 함수
  const loadPage = async (page) => {
    if (!category) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        size: pagination.size,
        sort: sortMapping[currentSort] || 'POPULAR',
        category: category,
      });

      const response = await axiosInstance.get(
        `/api/stores?${params.toString()}`
      );

      if (response.data && response.data.success) {
        const responseData = response.data.data;
        const fetchedShops = responseData.content || [];

        setShops(fetchedShops);
        setPagination({
          page: responseData.page,
          size: responseData.size,
          totalPages: responseData.totalPages,
          totalElements: responseData.totalElements,
          hasNext: responseData.hasNext,
          hasPrevious: responseData.hasPrevious,
        });

        fetchedShops.forEach((shop) => {
          setStoreSubscription(shop.id, shop.isSubscribed || false);
        });
      }
    } catch (err) {
      console.error('페이지 로드 실패:', err);
      setError('페이지를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 정렬 변경 핸들러
  const handleSortChange = (newSort) => {
    setCurrentSort(newSort);
    // 정렬이 바뀌면 첫 페이지부터 다시 로드
  };

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

  // 주소 객체를 문자열로 변환하는 헬퍼 함수
  const formatAddress = (address) => {
    if (typeof address === 'string') {
      return address;
    }
    if (typeof address === 'object' && address !== null) {
      // fullAddress가 있으면 사용, 없으면 roadAddress 사용
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
      return JSON.stringify(value); // 객체면 JSON 문자열로 변환 (임시)
    }
    return String(value);
  };

  const sortedShops = useMemo(() => {
    // 백엔드에서 이미 정렬된 데이터를 받아오므로 클라이언트 정렬 불필요
    return shops;
  }, [shops]);

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
        {sortOptions.map((sort) => (
          <button
            key={sort}
            className={`sorting-btn ${currentSort === sort ? 'active' : ''}`}
            onClick={() => handleSortChange(sort)}
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
                <div>
                  {shop.bannerImageUrl ? (
                    <img
                      className="list-shop-image"
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
                  <p className="list-shop-name">
                    {safeToString(shop.name, '가게명 없음')}
                  </p>
                  <div className="list-shop-rating">
                    <StarRateIcon />
                    <span>{safeToString(shop.averageRating, '0.0')}</span>
                  </div>
                  <p className="list-shop-info">
                    {safeToString(shop.description, '가게 소개글이 없습니다.')}
                  </p>
                  <p className="list-shop-info">
                    위치: {formatAddress(shop.address)}
                  </p>
                  <p className="list-shop-info">
                    리뷰: {safeToString(shop.reviewCount, '0')}개 | 주문:{' '}
                    {safeToString(shop.orderCount, '0')}회
                  </p>
                  <p className="list-shop-info">
                    영업상태: {shop.isOpen ? '영업중' : '영업종료'}
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

      {/* 페이징 UI */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => loadPage(pagination.page - 1)}
            disabled={!pagination.hasPrevious || loading}
          >
            이전
          </button>

          <span className="pagination-info">
            {pagination.page} / {pagination.totalPages} 페이지 (
            {pagination.totalElements}개 가게)
          </span>

          <button
            className="pagination-btn"
            onClick={() => loadPage(pagination.page + 1)}
            disabled={!pagination.hasNext || loading}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default FilteredShops;
