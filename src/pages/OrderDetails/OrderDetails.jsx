import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Advertisement from '../../components/Advertisement/Advertisement';
import { getUserOrders } from '../../api/order/orderApi';
import { getStoreInfo } from '../../api/storedetail/storeApi';
import './OrderDetails.css';

// 숫자를 통화 형식(,)으로 포맷팅하는 헬퍼 함수
const formatPrice = (number) => {
  return new Intl.NumberFormat('ko-KR').format(number);
};

function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 실제 API에서 주문 데이터를 가져옵니다.
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        // 실제 API 호출
        const response = await getUserOrders();

        if (response.success) {
          // API 응답을 UI에 맞는 형식으로 변환 (가게 정보 포함)
          const formattedOrders = await Promise.all(
            response.data.map(async (order) => {
              // 가게 정보 가져오기
              let storeName = `가게 ID: ${order.storeId}`;
              try {
                const storeInfo = await getStoreInfo(order.storeId);
                storeName = storeInfo.name || storeName;
              } catch (error) {
                // 가게 정보 가져오기 실패시 기본값 사용
              }

              return {
                id: order.id,
                restaurant: storeName,
                menu1: '주문 메뉴', // TODO: 메뉴 정보 API 필요
                originalPrice: order.totalOriginalPrice || 0,
                discountedPrice:
                  order.totalPrice || order.totalDiscountedPrice || 0,
                discount:
                  order.totalOriginalPrice > 0
                    ? Math.round(
                        ((order.totalOriginalPrice -
                          (order.totalPrice || order.totalDiscountedPrice)) /
                          order.totalOriginalPrice) *
                          100
                      )
                    : 0,
                orderTime: new Date().toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              };
            })
          );

          setOrders(formattedOrders);
        } else {
          throw new Error('주문 내역을 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('주문 내역 조회 에러:', error);
        setError('주문 내역을 불러오는 중 오류가 발생했습니다.');

        // 에러 시 더미 데이터 사용
        const dummyData = [
          {
            id: 1,
            restaurant: 'BHC치킨 왕십리점',
            menu1: '뿌링클 콤보',
            menu2: '치즈볼 추가',
            originalPrice: 24000,
            discountedPrice: 24000,
            discount: 0,
            orderTime: '2025.08.27 18:00',
          },
        ];
        setOrders(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="Main-wapper">
      <Advertisement />
      <main className="Main-content">
        {loading && (
          <div className="loading-message">주문 내역을 불러오는 중...</div>
        )}

        {error && <div className="error-message">{error}</div>}

        {!loading && orders.length === 0 && (
          <div className="empty-message">주문 내역이 없습니다.</div>
        )}

        {/* 주문내역 리스트 */}
        {orders.map((order) => (
          <div className="Order-card" key={order.id}>
            <div className="Order-restaurant">{order.restaurant}</div>
            <div className="Order-menu">
              {order.menu1} <br />
            </div>
            <div className="Order-price">
              결제금액{' '}
              {/* originalPrice와 discountedPrice가 다를 때만 할인 전 가격 표시 */}
              {order.originalPrice !== order.discountedPrice && (
                <span className="Original-price">
                  {formatPrice(order.originalPrice)}원
                </span>
              )}
              <span className="Discounted-price">
                {formatPrice(order.discountedPrice)}원
              </span>
              {/* 할인율이 0보다 클 때만 할인 배지 표시 */}
              {order.discount > 0 && (
                <span className="Discount-badge">{order.discount}% 할인</span>
              )}
            </div>
            <div className="Order-time">
              결제시간
              <span>{order.orderTime}</span>
            </div>

            <div className="review-contain">
              {/* --- 이 부분이 리뷰 작성 페이지와 연결하는 핵심입니다 --- */}
              <NavLink
                to={`/write-review/${order.id}`} // URL에 주문 ID를 포함
                state={{ storeName: order.restaurant }} // state로 가게 이름을 전달
                className="review-btn"
              >
                리뷰 작성하기
              </NavLink>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default OrderDetails;
