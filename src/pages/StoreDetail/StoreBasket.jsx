import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useCartStore from '../../store/cartStore';
import { getStoreInfo } from '../../api/storedetail/storeApi';
import { createOrder, completePayment } from '../../api/order/orderApi';
import PortOne from '@portone/browser-sdk/v2';
import './styles/StoreBasket.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StoreBasket = () => {
    const navigate = useNavigate();
    const { storeId } = useParams();
    const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCartStore();

    const [storeInfo, setStoreInfo] = useState({ name: 'RE:visit' });
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('IDLE');

    useEffect(() => {
        const fetchStoreInfo = async () => {
            try {
                setLoading(true);
                const currentStoreId = storeId || '123';
                const data = await getStoreInfo(currentStoreId);
                setStoreInfo({ name: data.name || 'RE:visit' });
            } catch (error) {
                console.error('가게 정보 로딩 에러:', error);
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

    const handleCheckout = () => {
        if (getTotalPrice() === 0) {
            alert('결제 금액이 0원입니다.');
            return;
        }
        setShowPaymentModal(true);
    };

    const handleCloseModal = () => {
        setShowPaymentModal(false);
        setPaymentStatus('IDLE');
    };

    const isLoggedIn = () => localStorage.getItem('authToken') !== null;

    const handleConfirmPayment = async () => {
        try {
            if (!isLoggedIn()) {
                alert('로그인이 필요합니다.');
                if (window.confirm('로그인 페이지로 이동하시겠습니까?')) {
                    navigate('/');
                }
                return;
            }
            setPaymentStatus('PENDING');
            const orderRequest = {
                storeId: parseInt(storeId) || 123,
                items: cart.map((item) => ({ menuId: item.id, quantity: item.quantity })),
            };
            const orderResponse = await createOrder(orderRequest);
            if (!orderResponse.success) throw new Error(orderResponse.message || '주문 생성 실패');

            const { data: order } = orderResponse;
            const payment = await PortOne.requestPayment({
                storeId: import.meta.env.VITE_PORTONE_STORE_ID,
                channelKey: import.meta.env.VITE_PORTONE_CHANNEL_KEY,
                paymentId: order.MerchantUid,
                orderName: `${storeInfo.name} 주문`,
                totalAmount: getTotalPrice(),
                currency: 'KRW',
                payMethod: 'TRANSFER',
                redirectUrl: `${window.location.origin}/orders`,
                customData: { orderId: order.id, storeId: storeId },
            });

            if (payment.code !== undefined) {
                setPaymentStatus('FAILED');
                alert(`결제 실패: ${payment.message}`);
                return;
            }

            const completeResponse = await completePayment({ paymentId: payment.paymentId });
            if (completeResponse.success) {
                setPaymentStatus('SUCCESS');
                alert('결제가 완료되었습니다!');
                setShowPaymentModal(false);
                cart.forEach((item) => removeFromCart(item.id));
                navigate('/orders', { replace: true });
            } else {
                throw new Error(completeResponse.message || '결제 완료 처리 실패');
            }
        } catch (error) {
            console.error('결제 에러:', error);
            setPaymentStatus('FAILED');
            alert(`결제 중 오류가 발생했습니다: ${error.message}`);
        }
    };

    // ✨ 공동 결제하기 버튼 핸들러
    const handleJointPayment = () => {
        setShowPaymentModal(false); // 모달을 닫고
        navigate('/joint-payment'); // 공동 결제자 선택 페이지로 이동
    };

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
                        const originalPrice = item.originalPrice || item.price;
                        const discountRate = item.originalPrice
                            ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
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
                                                <span className="menu-item-discount">{discountRate}% 할인</span>
                                            )}
                                            {item.originalPrice && (
                                                <span className="menu-item-original-price">
                                                    {item.originalPrice.toLocaleString()}원
                                                </span>
                                            )}
                                            <span className="menu-item-price">{item.price.toLocaleString()}원</span>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="remove-item-btn">
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
            <footer className="basket-footer">
                <button className="checkout-btn" onClick={handleCheckout}>
                    결제하기
                </button>
            </footer>
            {showPaymentModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <div className="basket-modal-content">
                            <button className="close-btn" onClick={handleCloseModal}>
                                ×
                            </button>
                            <h2>결제 방식을 선택해주세요!</h2>
                            <p>선택하신 방식으로 결제가 진행됩니다.</p>
                            <div className="payment-buttons">
                                <button
                                    className="payment-option-btn confirm-btn"
                                    onClick={handleConfirmPayment}
                                    disabled={paymentStatus === 'PENDING'}
                                >
                                    {paymentStatus === 'PENDING' ? '결제 진행 중...' : '혼자 결제하기'}
                                </button>
                                <button className="payment-option-btn continue-btn" onClick={handleJointPayment}>
                                    {' '}
                                    {/* ✨ 핸들러 변경 */}
                                    공동 결제하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreBasket;
