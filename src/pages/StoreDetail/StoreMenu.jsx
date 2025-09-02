import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import menuData from '../../data/storedetail/menuData.json';
import './styles/Storemenu.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const StoreMenu = () => {
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, getTotalPrice, getCartItem } =
    useCartStore();

  return (
    <>
      <div className="store-menu-container">
        <main className="menu-list">
          {menuData.map((item) => {
            const cartItem = getCartItem(item.id);
            return (
              <div key={item.id} className="menu-item">
                <div className="menu-item-image"></div>
                <div className="menu-item-content">
                  <div className="menu-item-info">
                    <p className="menu-item-name">{item.name}</p>
                    <p className="menu-item-description">{item.description}</p>
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
          })}
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
