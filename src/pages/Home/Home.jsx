import React, { useState } from 'react';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

function Home() {
    // 헤더의 높이를 저장할 state
    const [headerHeight, setHeaderHeight] = useState(0);

    return (
        <div className="Main-wapper">
            <main className="Main-content" style={{ paddingTop: `${headerHeight}px` }}>
                <h1>HOme</h1>
                <p>광고 및 기타 내용이 여기에 표시됩니다.</p>

                <div style={{ height: '1000px', background: '#f0f0f0', paddingTop: '20px' }}>스크롤을 내려보세요.</div>
            </main>
        </div>
    );
}

export default Home;
