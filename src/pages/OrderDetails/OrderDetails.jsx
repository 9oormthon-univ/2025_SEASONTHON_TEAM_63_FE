import React, { useState, useEffect } from 'react';
import Advertisement from '../../components/Advertisement/Advertisement';
import './OrderDetails.css';
import { NavLink } from 'react-router-dom';
function OrderDetails() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [orders, setOrders] = useState([]);

  // 예시 API 호출 (실제 API 엔드포인트로 바꿔주세요)
  useEffect(() => {
    async function fetchOrders() {
      // fetch('/api/orders')로 실제 API에서 주문정보 가져오기
      const data = [
        {
          id: 1,
          restaurant: 'BHC치킨 왕십리점',
          menu1: '첫번째메뉴명',
          menu2: '두번째메뉴명',
          originalPrice: 18000,
          discountedPrice: 12600,
          discount: 30,
          orderTime: '2025.08.27 18:00',
        },
        {
          id: 2,
          restaurant: 'BHC치킨 왕십리점',
          menu1: '첫번째메뉴명',
          menu2: '두번째메뉴명',
          originalPrice: 18000,
          discountedPrice: 15000,
          discount: 15,
          orderTime: '2025.08.27 18:00',
        },
      ];
      setOrders(data);
    }
    fetchOrders();
  }, []);

  return (
    <div className="Main-wapper">
      <Advertisement />
      <main
        className="Main-content"
        style={{ paddingTop: `${headerHeight}px` }}
      >
        {/* 주문내역 리스트 */}
        {orders.map((order) => (
          <div className="Order-card" key={order.id}>
            <div className="Order-date">8월 27일 수요일</div>
            <div className="Order-restaurant">{order.restaurant}</div>
            <div className="Order-menu">
              {order.menu1} <br /> {order.menu2}
            </div>
            <div className="Order-price">
              결제금액{' '}
              <span className="Original-price">{order.originalPrice}원</span>
              <span className="Discounted-price">
                {order.discountedPrice}원
              </span>
              <span className="Discount-badge">{order.discount}% 할인</span>
            </div>
            <div className="Order-time">결제시간 {order.orderTime}</div>

            <NavLink to="/write-review" className="Review-btn">
              리뷰 작성하기
            </NavLink>
          </div>
        ))}
      </main>
    </div>
  );
}

export default OrderDetails;
