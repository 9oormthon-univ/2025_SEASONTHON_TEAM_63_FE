import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Advertisement from '../../components/Advertisement/Advertisement';
import './OrderDetails.css';

// 숫자를 통화 형식(,)으로 포맷팅하는 헬퍼 함수
const formatPrice = (number) => {
    return new Intl.NumberFormat('ko-KR').format(number);
};

function OrderDetails() {
    const [orders, setOrders] = useState([]);

    // 컴포넌트 마운트 시 더미 데이터를 state에 설정합니다.
    useEffect(() => {
        // 처음 제공해주셨던 더미 데이터 구조를 그대로 사용합니다.
        const dummyData = [
            {
                id: 1, // 리뷰 작성 시 WriteReview 페이지로 전달될 주문 ID
                restaurant: 'BHC치킨 왕십리점',
                menu1: '뿌링클 콤보',
                menu2: '치즈볼 추가',
                originalPrice: 24000,
                discountedPrice: 24000,
                discount: 0,
                orderTime: '2025.08.27 18:00',
            },
            {
                id: 2, // 리뷰 작성 시 WriteReview 페이지로 전달될 주문 ID
                restaurant: '맥도날드 한양대점',
                menu1: '빅맥 세트',
                menu2: '상하이 버거 단품',
                originalPrice: 12500,
                discountedPrice: 11000,
                discount: 12,
                orderTime: '2025.08.26 12:30',
            },
        ];
        setOrders(dummyData);
    }, []); // 빈 배열을 전달하여 최초 1회만 실행

    return (
        <div className="Main-wapper">
            <Advertisement />
            <main className="Main-content">
                {/* 주문내역 리스트 */}
                {orders.map((order) => (
                    <div className="Order-card" key={order.id}>
                        {/* 더미 데이터의 orderTime에서 날짜 부분만 표시 (간단한 처리) */}
                        <div className="Order-date">{order.orderTime.split(' ')[0]}</div>
                        <div className="Order-restaurant">{order.restaurant}</div>
                        <div className="Order-menu">
                            {order.menu1} <br /> {order.menu2}
                        </div>
                        <div className="Order-price">
                            결제금액 {/* originalPrice와 discountedPrice가 다를 때만 할인 전 가격 표시 */}
                            {order.originalPrice !== order.discountedPrice && (
                                <span className="Original-price">{formatPrice(order.originalPrice)}원</span>
                            )}
                            <span className="Discounted-price">{formatPrice(order.discountedPrice)}원</span>
                            {/* 할인율이 0보다 클 때만 할인 배지 표시 */}
                            {order.discount > 0 && <span className="Discount-badge">{order.discount}% 할인</span>}
                        </div>
                        <div className="Order-time">결제시간 {order.orderTime}</div>

                        {/* --- 이 부분이 리뷰 작성 페이지와 연결하는 핵심입니다 --- */}
                        <NavLink
                            to={`/write-review/${order.id}`} // URL에 주문 ID를 포함
                            state={{ storeName: order.restaurant }} // state로 가게 이름을 전달
                            className="Review-btn"
                        >
                            리뷰 작성하기
                        </NavLink>
                    </div>
                ))}
            </main>
        </div>
    );
}

export default OrderDetails;
