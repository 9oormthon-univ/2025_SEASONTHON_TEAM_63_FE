import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './PaymentManagement.css';
import { X, Minus, Plus } from 'lucide-react';
import soloPaymentImage from '../../assets/icon/PatmentM/혼자결재.png';

// 1. Context에서 스캐너를 열기 위한 커스텀 훅을 가져옵니다.
import { useScanner } from '../../components/contexts/ScannerContext';

// 2. RealQrScanner 컴포넌트를 export하여 다른 파일에서 사용할 수 있게 합니다.
export const RealQrScanner = ({ onClose }) => {
    const scannerRef = useRef(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            'qr-reader-container',
            { qrbox: { width: 250, height: 250 }, fps: 10 },
            false
        );
        scannerRef.current = scanner;

        const onScanSuccess = (decodedText, decodedResult) => {
            console.log(`스캔 성공: ${decodedText}`, decodedResult);
            alert(`QR 코드 내용: ${decodedText}`);
            handleClose();
        };

        const onScanFailure = (error) => {
            // 일반적으로 로그를 남기지 않음
        };

        scanner.render(onScanSuccess, onScanFailure);

        return () => {
            handleClose();
        };
    }, []);

    const handleClose = () => {
        if (scannerRef.current && scannerRef.current.getState() === 2) {
            scannerRef.current.clear().catch((error) => {
                console.error('스캐너 정리 실패:', error);
            });
        }
        onClose();
    };

    return (
        <div className="qr-scanner-overlay">
            <div className="qr-scanner-modal">
                <button onClick={handleClose} className="close-btn">
                    <X size={24} />
                </button>
                <div id="qr-reader-container" className="camera-view"></div>
                <p className="scan-guide-text">QR 코드를 사각형 안에 맞춰주세요.</p>
            </div>
        </div>
    );
};

// --- 나머지 컴포넌트 (PeoplePicker, MealTicket)는 이전과 동일 ---
const PeoplePicker = ({ onConfirm, onCancel }) => {
    const [count, setCount] = useState(2);
    // ... 컴포넌트 내부 구현 ...
    return <div className="people-picker-overlay">{/* ... JSX ... */}</div>;
};

const MealTicket = ({ store, amount, type }) => <div className={`meal-ticket ${type}`}>{/* ... JSX ... */}</div>;

function PaymentManagement() {
    // 3. 로컬 state인 showCamera를 제거하고, Context의 openScanner를 사용합니다.
    const { openScanner } = useScanner();
    const [showPeoplePicker, setShowPeoplePicker] = useState(false);

    const handleSoloPayment = () => {
        // 로컬 state 변경 대신 전역 함수 호출
        openScanner();
    };

    const handleGroupPayment = () => {
        setShowPeoplePicker(true);
    };

    const handleConfirmPeople = (count) => {
        console.log(`공동 결제 인원: ${count}명`);
        setShowPeoplePicker(false);
        // 인원 확인 후 스캐너 열기
        openScanner();
    };

    return (
        <div className="payment-management-container">
            <section className="payment-section">
                <h2>현장결제</h2>
                <div className="payment-buttons">
                    <button className="payment-btn solo" onClick={handleSoloPayment}>
                        <img src={soloPaymentImage} alt="혼자 결제하기" className="btn-image" />
                        <span>결제하기</span>
                    </button>
                </div>
            </section>

            <section className="ticket-section">{/* ... 식권 관련 UI ... */}</section>

            {showPeoplePicker && (
                <PeoplePicker onConfirm={handleConfirmPeople} onCancel={() => setShowPeoplePicker(false)} />
            )}

            {/* 4. 스캐너 렌더링 로직은 MainLayout으로 이동했으므로 여기서 완전히 삭제합니다. */}
        </div>
    );
}

export default PaymentManagement;
