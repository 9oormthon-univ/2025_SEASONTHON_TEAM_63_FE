import React, { useState } from 'react';

import './Main.css';

import Advertisement from '../Advertisement/Advertisement';

function Main() {
    // 헤더의 높이를 저장할 state
    const [headerHeight, setHeaderHeight] = useState(0);

    return (
        <div className="Main-wapper">
            {/* 메인 콘텐츠 영역 */}
            <main className="Main-content" style={{ paddingTop: `${headerHeight}px` }}>
                {/* 여기에 페이지의 실제 콘텐츠가 들어갑니다 */}
                <Advertisement />
                <h1>메인 콘텐츠</h1>
                <p>광고 및 기타 내용이 여기에 표시됩니다.</p>

                {/* 스크롤을 만들기 위한 임시 콘텐츠 */}
                <div style={{ height: '1000px', background: '#f0f0f0', paddingTop: '20px' }}>스크롤을 내려보세요.</div>
            </main>
        </div>
    );
}

export default Main;
