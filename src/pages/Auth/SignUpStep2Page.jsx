// src/pages/SignUpStep2Page.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function SignUpStep2Page() {
    const navigate = useNavigate();

    // 이제 토큰 기반으로 인증하므로, location state에서 username을 받아올 필요가 없습니다.
    // 이전에 있던 useLocation, username 변수, 비정상 접근 처리 로직을 모두 삭제합니다.

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="auth-title">회원가입 (2/2)</h1>
                <p style={{ color: '#555', marginBottom: '30px' }}>가입하실 회원 유형을 선택해주세요.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button
                        // navigate 함수에서 더 이상 state를 전달하지 않습니다.
                        onClick={() => navigate('/complete-signup/user')}
                        className="auth-button"
                    >
                        개인 회원
                    </button>
                    <button
                        // navigate 함수에서 더 이상 state를 전달하지 않습니다.
                        onClick={() => navigate('/complete-signup/corp')}
                        className="auth-button"
                    >
                        기업 회원
                    </button>
                </div>
            </div>
        </div>
    );
}
