import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useCartStore from '../../store/cartStore';
import { getStoreMenus } from '../../api/storedetail/menuApi';
import './styles/Storemenu.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FoodBankIcon from '@mui/icons-material/FoodBank';

const StoreMenu = () => {
  const navigate = useNavigate();
  const { storeId } = useParams(); // URL에서 storeId 동적 추출
  const { cart, addToCart, updateQuantity, getTotalPrice, getCartItem } =
    useCartStore();

  // 상태 관리
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 메뉴 데이터 API 호출
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        setError(null);

        // storeId가 없으면 기본값 사용 (개발 중)
        const currentStoreId = storeId || '123';
        const data = await getStoreMenus(currentStoreId);

        setMenuData(data);
      } catch (err) {
        console.error('메뉴 데이터 로딩 에러:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [storeId]);

  return (
    <>
      <div className="store-menu-container">
        <main className="menu-list">
          {loading ? (
            // 로딩 상태 - 기존 스타일 유지한 스켈레톤
            <div className="loading-container">
              {[1, 2, 3].map((index) => (
                <div key={index} className="menu-item menu-item-skeleton">
                  <div className="menu-item-image skeleton-image"></div>
                  <div className="menu-item-content">
                    <div className="menu-item-info">
                      <div className="skeleton-text skeleton-name"></div>
                      <div className="skeleton-text skeleton-description"></div>
                      <div className="skeleton-text skeleton-price"></div>
                    </div>
                    <div className="skeleton-button"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // 에러 상태 - 기존 스타일과 일치하는 디자인
            <div className="error-container">
              <div className="error-message">
                <p>😅 메뉴를 불러올 수 없습니다</p>
                <p className="error-detail">{error}</p>
                <button
                  className="retry-button"
                  onClick={() => window.location.reload()}
                >
                  다시 시도
                </button>
              </div>
            </div>
          ) : menuData.length === 0 ? (
            // 빈 데이터 상태
            <div className="empty-menu-container">
              <div className="empty-menu-message">
                <FoodBankIcon sx={{ fontSize: 40 }} />

                <p>등록된 메뉴가 없습니다</p>
                <p className="empty-detail">
                  곧 맛있는 메뉴들이 준비될 예정입니다!
                </p>
              </div>
            </div>
          ) : (
            // 정상 데이터 렌더링 - 기존 로직 유지
            menuData.map((item) => {
              const cartItem = getCartItem(item.id);
              return (
                <div key={item.id} className="menu-item">
                  <div className="menu-item-image"></div>
                  <div className="menu-item-content">
                    <div className="menu-item-info">
                      <p className="menu-item-name">{item.name}</p>
                      <p className="menu-item-description">
                        {item.description}
                      </p>
                      <div>
                        {item.discount && (
                          <span className="menu-item-discount">
                            {item.discount}
                          </span>
                        )}
                        {item.originalPrice && (
                          <span className="menu-item-original-price">
                            {item.originalPrice.toLocaleString()}원
                          </span>
                        )}
                        <span className="menu-item-price">
                          {item.price.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                    <div>
                      {cartItem ? (
                        <div className="quantity-control">
                          <button onClick={() => updateQuantity(item.id, -1)}>
                            −
                          </button>
                          <span>{cartItem.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}>
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          className="add-to-cart-btn"
                          onClick={() => addToCart(item)}
                        >
                          담기
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </main>

        {/* 결제 / 장바구니 footer 팝업 */}
        {cart.length > 0 && (
          <footer className="cart-footer">
            <div className="cart-total">
              <span>합계금액: </span>
              <strong>{getTotalPrice().toLocaleString()}원</strong>
            </div>
            <button
              className="view-cart-btn"
              onClick={() => navigate('/store-basket')}
            >
              <ShoppingCartIcon />
              장바구니 보기
            </button>
          </footer>
        )}
      </div>
    </>
  );
};

export default StoreMenu;
