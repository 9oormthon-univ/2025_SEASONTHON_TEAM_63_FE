import './Advertisement.css';

function Advertisement() {
    return (
        <div className="Advertisement-wapper">
            {/* 첫 번째 광고판 */}
            <div className="Advertisement-main-1">
                {/* 내부 콘텐츠를 div로 한번 감싸서 정렬을 용이하게 합니다. */}
                <div>
                    <p className="ad-line-1">
                        <span className="ad-name">OO</span>님, 지금까지 총
                    </p>
                    <div className="ad-line-2">
                        <span className="ad-money">1234567</span>
                        <span className="ad-unit">원 할인 받았어요!</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Advertisement;
