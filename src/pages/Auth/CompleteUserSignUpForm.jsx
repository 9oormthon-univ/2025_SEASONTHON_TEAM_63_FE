import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { completeUserSignUp } from '../api/authApi'; // 삭제
import axiosInstance from '../../api/auth/axiosInstance'; // axiosInstance 임포트

export default function CompleteUserSignUpForm() {
    // ... (state 선언은 동일)
    const [formData, setFormData] = useState({ nickname: '', email: '', phone: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        // ...
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // 에러 메시지 초기화
        try {
            // axiosInstance를 사용하면 자동으로 헤더에 토큰이 포함됩니다.
            await axiosInstance.post('/api/auth/complete-sign-up/user', formData);
            alert('모든 회원가입 절차가 완료되었습니다! 메인 페이지로 이동합니다.');

            // 토큰은 이미 있으므로, 바로 메인 페이지로 이동
            navigate('/main');
        } catch (err) {
            setError(err.response?.data?.message || err.message || '가입 완료에 실패했습니다.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="auth-title">개인 회원 정보 입력</h1>
                <form onSubmit={handleSubmit} className="auth-form">
                    <input name="nickname" placeholder="닉네임" onChange={handleChange} required />
                    <input name="email" type="email" placeholder="이메일" onChange={handleChange} required />
                    <input name="phone" placeholder="전화번호" onChange={handleChange} required />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="auth-button">
                        가입 완료
                    </button>
                </form>
            </div>
        </div>
    );
}
