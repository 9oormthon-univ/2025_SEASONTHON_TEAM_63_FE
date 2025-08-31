import { useState } from 'react';
import menuData from '../../data/storedetail/menuData.json';
import './styles/StoreMenu.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const StoreMenu = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (itemId, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + amount;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItem = (itemId) => {
    return cart.find((item) => item.id === itemId);
  };

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
            <button className="view-cart-btn">
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
