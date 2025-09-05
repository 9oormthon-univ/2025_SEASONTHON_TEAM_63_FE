import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode'; // React 19와 호환되는 라이브러리
import './PaymentManagement.css';
import { X, Minus, Plus } from 'lucide-react';

import soloPaymentImage from '../../assets/icon/PatmentM/혼자결재.png';
import groupPaymentImage from '../../assets/icon/PatmentM/공동결재.png';

// --- html5-qrcode를 사용하는 새로운 QR 스캐너 컴포넌트 ---
const RealQrScanner = ({ onClose }) => {
    const scannerRef = useRef(null);

    useEffect(() => {
        // 컴포넌트가 마운트될 때 스캐너 인스턴스 생성
        const scanner = new Html5QrcodeScanner(
            'qr-reader-container', // 스캐너를 렌더링할 DOM 요소의 ID
            {
                qrbox: {
                    width: 250,
                    height: 250,
                },
                fps: 10, // 초당 스캔 프레임 수
            },
            false // verbose, 상세 로그 출력 여부
        );

        scannerRef.current = scanner;

        // 스캔 성공 콜백
        const onScanSuccess = (decodedText, decodedResult) => {
            console.log(`스캔 성공: ${decodedText}`, decodedResult);
            alert(`QR 코드 내용: ${decodedText}`);

            // QR 코드에 있는 주소로 이동하려면 아래 주석을 해제하세요.
            // if (decodedText.startsWith('http')) {
            //   window.location.href = decodedText;
            // }

            // 스캔 후 리소스 정리 및 모달 닫기
            handleClose();
        };

        // 스캔 실패 콜백 (필요 시 사용)
        const onScanFailure = (error) => {
            // 스캔 실패는 계속 발생하므로 일반적으로 콘솔에 로그를 남기지 않습니다.
            // console.warn(`Code scan error = ${error}`);
        };

        // 스캐너 렌더링
        scanner.render(onScanSuccess, onScanFailure);

        // 컴포넌트 언마운트 시 스캐너 정리
        return () => {
            handleClose();
        };
    }, []);

    const handleClose = () => {
        if (scannerRef.current && scannerRef.current.getState() === 2) {
            // 2: SCANNING 상태
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
                {/* 스캐너가 렌더링될 컨테이너 */}
                <div id="qr-reader-container" className="camera-view"></div>
                <p className="scan-guide-text">QR 코드를 사각형 안에 맞춰주세요.</p>
            </div>
        </div>
    );
};

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

            {showCamera && <RealQrScanner onClose={() => setShowCamera(false)} />}
        </div>
    );
}

export default PaymentManagement;
