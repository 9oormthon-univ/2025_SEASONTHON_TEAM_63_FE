import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useCartStore from '../../store/cartStore';
import { getStoreInfo } from '../../api/storedetail/storeApi';
import './styles/StoreBasket.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StoreBasket = () => {
  const navigate = useNavigate();
  const { storeId } = useParams(); // URL에서 storeId 가져오기
  const { cart, updateQuantity, removeFromCart, getTotalPrice } =
    useCartStore();

  // 가게 정보 상태 관리
  const [storeInfo, setStoreInfo] = useState({
    name: 'RE:visit', // 기본값
  });
  const [loading, setLoading] = useState(true);

  // 가게 정보 API 호출
  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        setLoading(true);
        const currentStoreId = storeId || '123'; // StoreDetail에서와 동일한 로직
        const data = await getStoreInfo(currentStoreId);

        setStoreInfo({
          name: data.name || 'RE:visit',
        });
      } catch (error) {
        console.error('가게 정보 로딩 에러:', error);
        // 에러 시 기본값 유지
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInfo();
  }, [storeId]);

  const totalOriginalPrice = cart.reduce((total, item) => {
    const original = item.originalPrice || item.price;
    return total + original * item.quantity;
  }, 0);

  const totalDiscount = totalOriginalPrice - getTotalPrice();

  return (
    <div className="basket-container">
      <header className="basket-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowBackIcon />
        </button>
        <h1>장바구니</h1>
      </header>

      <main className="basket-main">
        <p className="basket-store-name">
          {loading ? '가게 이름 로딩중...' : `${storeInfo.name}에서 담은 메뉴`}
        </p>

        <ul className="basket-item-list">
          {cart.map((item) => {
            // 할인율 계산
            const originalPrice = item.originalPrice || item.price;
            const discountRate = item.originalPrice
              ? Math.round(
                  ((item.originalPrice - item.price) / item.originalPrice) * 100
                )
              : 0;

            return (
              <li key={item.id} className="basket-item">
                <div className="item-top-section">
                  <div className="item-checkbox">
                    <CheckCircleIcon />
                  </div>
                  <div className="item-image-placeholder" />
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <div className="item-price-info">
                      {discountRate > 0 && (
                        <span className="menu-item-discount">
                          {discountRate}% 할인
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
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-item-btn"
                  >
                    ×
                  </button>
                </div>
                <div className="item-bottom-section">
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item.id, -1)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>
                      +
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="order-summary">
          <h2 className="summary-title">결제 금액</h2>
          <div className="summary-row">
            <span>상품 금액</span>
            <span>{totalOriginalPrice.toLocaleString()}원</span>
          </div>
          <div className="summary-row discount">
            <span>할인</span>
            <span>-{totalDiscount.toLocaleString()}원</span>
          </div>
          <div className="summary-row total">
            <span>총 결제 금액</span>
            <span>{getTotalPrice().toLocaleString()}원</span>
          </div>
        </div>
      </main>

      {/* 결제 버튼 */}
      <footer className="basket-footer">
        <button className="checkout-btn">결제하기</button>
      </footer>
    </div>
  );
};

export default StoreBasket;
