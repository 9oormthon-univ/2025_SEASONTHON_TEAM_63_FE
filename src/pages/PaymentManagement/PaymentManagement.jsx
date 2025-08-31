import React, { useState } from 'react';
import './PaymentManagement.css'; // 스타일링을 위한 CSS 파일을 임포트합니다.
import { Camera, X, Users, Minus, Plus } from 'lucide-react'; // 아이콘 사용 (lucide-react 라이브러리 필요)

// QR 스캐너를 흉내 내는 가상 컴포넌트
const QrScanner = ({ onClose }) => (
    <div className="qr-scanner-overlay">
        <div className="qr-scanner-modal">
            <button onClick={onClose} className="close-btn">
                <X size={24} />
            </button>
            <div className="camera-view">
                <div className="qr-frame"></div>
                <p>QR 코드를 스캔해주세요.</p>
            </div>
        </div>
    </div>
);

// 공동 결제 시 인원 수를 선택하는 모달 컴포넌트
const PeoplePicker = ({ onConfirm, onCancel }) => {
    const [count, setCount] = useState(2);

    return (
        <div className="people-picker-overlay">
            <div className="people-picker-modal">
                <h3>공동 결제 인원 설정</h3>
                <div className="people-counter">
                    <button onClick={() => setCount((prev) => Math.max(2, prev - 1))}>
                        <Minus size={20} />
                    </button>
                    <span>{count}명</span>
                    <button onClick={() => setCount((prev) => prev + 1)}>
                        <Plus size={20} />
                    </button>
                </div>
                <div className="modal-actions">
                    <button onClick={onCancel} className="cancel-btn">
                        취소
                    </button>
                    <button onClick={() => onConfirm(count)} className="confirm-btn">
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

// 가상의 식권 데이터를 표시하는 컴포넌트
const MealTicket = ({ store, amount, type }) => (
    <div className={`meal-ticket ${type}`}>
        <div className="ticket-content">
            <div className="ticket-logo"></div>
            <div className="ticket-info">
                <span className="store-name">{store}</span>
                <span className="ticket-amount">{amount}</span>
            </div>
        </div>
    </div>
);

function PaymentManagement() {
    const [showCamera, setShowCamera] = useState(false);
    const [showPeoplePicker, setShowPeoplePicker] = useState(false);

    // '혼자 결제하기' 버튼 클릭 핸들러
    const handleSoloPayment = () => {
        setShowCamera(true);
    };

    // '공동 결제하기' 버튼 클릭 핸들러
    const handleGroupPayment = () => {
        setShowPeoplePicker(true);
    };

    // 인원 설정 후 '확인' 버튼 클릭 핸들러
    const handleConfirmPeople = (count) => {
        console.log(`공동 결제 인원: ${count}명`);
        setShowPeoplePicker(false);
        setShowCamera(true);
    };

    return (
        <div className="payment-management-container">
            {/* 현장 결제 섹션 */}
            <section className="payment-section">
                <h2>현장결제</h2>
                <div className="payment-buttons">
                    <button className="payment-btn solo" onClick={handleSoloPayment}>
                        <div className="btn-icon-wrapper solo-icon"></div>
                        <span>혼자 결제하기</span>
                    </button>
                    <button className="payment-btn group" onClick={handleGroupPayment}>
                        <div className="btn-icon-wrapper group-icon"></div>
                        <span>공동 결제하기</span>
                    </button>
                </div>
            </section>

            {/* 식권 섹션 */}
            <section className="ticket-section">
                <h2>식권</h2>

                <h3>나의 식권</h3>
                <div className="ticket-list">
                    <MealTicket store="OO가게 식권" amount="금액: 10000원" type="my-ticket" />
                    <MealTicket store="XX가게 식권" amount="잔액: 100" type="my-ticket" />
                </div>

                <h3>공동 식권</h3>
                <div className="ticket-list">
                    <MealTicket store="OO가게 식권" amount="금액: 10000원" type="group-ticket" />
                    <MealTicket store="XX가게 식권" amount="잔액: 100" type="group-ticket" />
                </div>
            </section>

            {/* 조건부 렌더링: 인원 선택 모달 */}
            {showPeoplePicker && (
                <PeoplePicker onConfirm={handleConfirmPeople} onCancel={() => setShowPeoplePicker(false)} />
            )}

            {/* 조건부 렌더링: QR 스캐너 */}
            {showCamera && <QrScanner onClose={() => setShowCamera(false)} />}
        </div>
    );
}

export default PaymentManagement;
