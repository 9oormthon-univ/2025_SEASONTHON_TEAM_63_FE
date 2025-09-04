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
        // storeId가 없으면 API를 호출하지 않습니다.
        if (!storeId) {
            setError('가게 ID가 올바르지 않습니다.');
            setLoading(false);
            return;
        }

        const fetchMenuData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 실제 메뉴 API를 호출합니다.
                const response = await axiosInstance.get(`/api/stores/${storeId}/menus`);

                if (response.data && response.data.success) {
                    // API 응답 데이터는 response.data.data 에 배열로 들어있습니다.
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
    }, [storeId]); // storeId가 변경될 때마다 effect를 다시 실행합니다.

    // 장바구니에 담을 아이템 객체 생성 (API 데이터 구조에 맞게)
    const handleAddToCart = (menu) => {
        const cartItem = {
            id: menu.id,
            name: menu.name,
            price: menu.discountedPrice > 0 ? menu.discountedPrice : menu.basePrice,
            imageUrl: menu.imageUrl,
            // 필요한 다른 정보 추가
        };
        addToCart(cartItem);
    };

    return (
        <>
            <div className="store-menu-container">
                <main className="menu-list">
                    {loading ? (
                        <div className="loading-container">{/* 로딩 스켈레톤 UI (기존 코드 유지) */}</div>
                    ) : error ? (
                        <div className="error-container">{/* 에러 UI (기존 코드 유지) */}</div>
                    ) : menuData.length === 0 ? (
                        <div className="empty-menu-container">{/* 메뉴 없음 UI (기존 코드 유지) */}</div>
                    ) : (
                        // API 응답 데이터로 메뉴 목록을 렌더링합니다.
                        menuData.map((menu) => {
                            const cartItem = getCartItem(menu.id);
                            const price = menu.discountedPrice > 0 ? menu.discountedPrice : menu.basePrice;
                            const originalPrice = menu.discountedPrice > 0 ? menu.basePrice : null;

                            return (
                                <div key={menu.id} className="menu-item">
                                    <div className="menu-item-image">
                                        {/* 메뉴 이미지 표시 */}
                                        <img src={menu.imageUrl} alt={menu.name} />
                                    </div>
                                    <div className="menu-item-content">
                                        <div className="menu-item-info">
                                            <p className="menu-item-name">{menu.name}</p>
                                            <p className="menu-item-description">{menu.description}</p>
                                            <div>
                                                {/* 할인율은 API에 없으므로, 할인 가격이 있을 경우 원래 가격을 함께 표시 */}
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
                                                    {/* 수량 조절 UI (기존 코드 유지) */}
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

                {/* 결제 / 장바구니 footer 팝업 (기존 코드 유지) */}
            </div>
        </>
    );
};

export default StoreMenu;
