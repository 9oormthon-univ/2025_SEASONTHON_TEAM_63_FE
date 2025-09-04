import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import axiosInstance from '../../api/auth/axiosInstance'; // axios 인스턴스 import
import './styles/Storemenu.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FoodBankIcon from '@mui/icons-material/FoodBank';

const StoreMenu = () => {
    const navigate = useNavigate();
    const { storeId } = useParams(); // URL에서 storeId를 동적으로 추출합니다.
    const { cart, addToCart, updateQuantity, getTotalPrice, getCartItem } = useCartStore();

    // 상태 관리
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 메뉴 데이터 API 호출
    useEffect(() => {
        if (!storeId) {
            setError('가게 ID가 올바르지 않습니다.');
            setLoading(false);
            return;
        }

        const fetchMenuData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get(`/api/stores/${storeId}/menus`);
                if (response.data && response.data.success) {
                    setMenuData(response.data.data || []);
                } else {
                    throw new Error('메뉴 정보를 가져오는 데 실패했습니다.');
                }
            } catch (err) {
                console.error('메뉴 데이터 로딩 에러:', err);
                setError(err.message || '메뉴를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchMenuData();
    }, [storeId]);

    // 장바구니에 담을 아이템 객체 생성
    const handleAddToCart = (menu) => {
        const cartItem = {
            id: menu.id,
            name: menu.name,
            price: menu.discountedPrice > 0 ? menu.discountedPrice : menu.basePrice,
            imageUrl: menu.imageUrl,
        };
        addToCart(cartItem);
    };

    return (
        <>
            <div className="store-menu-container">
                <main className="menu-list">
                    {loading ? (
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
                        <div className="error-container">
                            <div className="error-message">
                                <p>😅 메뉴를 불러올 수 없습니다</p>
                                <p className="error-detail">{error}</p>
                                <button className="retry-button" onClick={() => window.location.reload()}>
                                    다시 시도
                                </button>
                            </div>
                        </div>
                    ) : menuData.length === 0 ? (
                        <div className="empty-menu-container">
                            <div className="empty-menu-message">
                                <FoodBankIcon sx={{ fontSize: 40 }} />
                                <p>등록된 메뉴가 없습니다</p>
                                <p className="empty-detail">곧 맛있는 메뉴들이 준비될 예정입니다!</p>
                            </div>
                        </div>
                    ) : (
                        menuData.map((menu) => {
                            const cartItem = getCartItem(menu.id);
                            const price = menu.discountedPrice > 0 ? menu.discountedPrice : menu.basePrice;
                            const originalPrice = menu.discountedPrice > 0 ? menu.basePrice : null;

                            return (
                                <div key={menu.id} className="menu-item">
                                    <div className="menu-item-image">
                                        <img src={menu.imageUrl} alt={menu.name} />
                                    </div>
                                    <div className="menu-item-content">
                                        <div className="menu-item-info">
                                            <p className="menu-item-name">{menu.name}</p>
                                            <p className="menu-item-description">{menu.description}</p>
                                            <div>
                                                {originalPrice && (
                                                    <span className="menu-item-original-price">
                                                        {originalPrice.toLocaleString()}원
                                                    </span>
                                                )}
                                                <span className="menu-item-price">{price.toLocaleString()}원</span>
                                            </div>
                                        </div>
                                        <div>
                                            {cartItem ? (
                                                <div className="quantity-control">
                                                    <button onClick={() => updateQuantity(menu.id, -1)}>−</button>
                                                    <span>{cartItem.quantity}</span>
                                                    <button onClick={() => updateQuantity(menu.id, 1)}>+</button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="add-to-cart-btn"
                                                    onClick={() => handleAddToCart(menu)}
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
                        <button className="view-cart-btn" onClick={() => navigate('/store-basket')}>
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
