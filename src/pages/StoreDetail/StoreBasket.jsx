import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import './styles/StoreBasket.css';
import infoData from '../../data/storedetail/infoData.json';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StoreBasket = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getTotalPrice } =
    useCartStore();

  const storeName = infoData.name;

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
        <p className="basket-store-name">{storeName}에서 담은 메뉴</p>

        <ul className="basket-item-list">
          {cart.map((item) => (
            <li key={item.id} className="basket-item">
              <div className="item-top-section">
                <div className="item-checkbox">
                  <CheckCircleIcon />
                </div>
                <div className="item-image-placeholder" />
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <div className="item-price-info">
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
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-item-btn"
                >
                  ×
                </button>
              </div>
              <div className="item-bottom-section">
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
              </div>
            </li>
          ))}
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
