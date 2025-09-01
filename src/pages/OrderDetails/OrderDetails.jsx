import React, { useState } from 'react';
import Advertisement from '../../components/Advertisement/Advertisement';
import './OrderDetails.css';

function OrderDetails() {
    // 헤더의 높이를 저장할 state
    const [headerHeight, setHeaderHeight] = useState(0);

    return (
        <div className="Main-wapper">
            <Advertisement />
            <main className="Main-content" style={{ paddingTop: `${headerHeight}px` }}></main>
        </div>
    );
}

export default OrderDetails;
