import React, { useState } from 'react';
import './PaymentManagement.css';
import { X, Minus, Plus } from 'lucide-react';

// --- 추가된 부분: 이미지 파일을 직접 import 합니다. ---
// 경로 별칭(@)이 설정되어 있다고 가정합니다. 만약 아니라면 상대 경로('./../../assets/...')를 사용하세요.
import soloPaymentImage from '../../assets/icon/PatmentM/혼자결재.png';
import groupPaymentImage from '../../assets/icon/PatmentM/공동결재.png';

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

    const handleSoloPayment = () => {
        setShowCamera(true);
    };

    const handleGroupPayment = () => {
        setShowPeoplePicker(true);
    };

    const handleConfirmPeople = (count) => {
        console.log(`공동 결제 인원: ${count}명`);
        setShowPeoplePicker(false);
        setShowCamera(true);
    };

    return (
        <div className="payment-management-container">
            <section className="payment-section">
                <h2>현장결제</h2>
                <div className="payment-buttons">
                    {/* --- 변경된 부분: div 아이콘을 img 태그로 교체 --- */}
                    <button className="payment-btn solo" onClick={handleSoloPayment}>
                        <img src={soloPaymentImage} alt="혼자 결제하기" className="btn-image" />
                        <span>혼자 결제하기</span>
                    </button>
                    <button className="payment-btn group" onClick={handleGroupPayment}>
                        <img src={groupPaymentImage} alt="공동 결제하기" className="btn-image" />
                        <span>공동 결제하기</span>
                    </button>
                </div>
            </section>

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

            {showPeoplePicker && (
                <PeoplePicker onConfirm={handleConfirmPeople} onCancel={() => setShowPeoplePicker(false)} />
            )}
            {showCamera && <QrScanner onClose={() => setShowCamera(false)} />}
        </div>
    );
}

export default PaymentManagement;
