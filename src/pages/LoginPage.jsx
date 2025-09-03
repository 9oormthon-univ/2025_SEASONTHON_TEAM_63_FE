import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { login } from '../api/authApi'; // 삭제
import axiosInstance from '../api/axiosInstance'; // axiosInstance 임포트
import './Auth.css';

export default function LoginPage() {
    // ... (state 선언은 동일)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const credentials = { username, password };
            // login 함수 대신 axiosInstance 직접 사용
            const response = await axiosInstance.post('/api/auth/login', credentials);

            if (response.data.success && response.data.data.access) {
                const accessToken = response.data.data.access;
                localStorage.setItem('authToken', accessToken);
                navigate('/main');
            } else {
                throw new Error(response.data.message || '로그인에 실패했습니다.');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || '로그인에 실패했습니다.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="auth-title">로고 들어갈예정</h1>

                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="아이디"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호"
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">
                        로그인
                    </button>
                </form>

                {/* ... (소셜 로그인 및 회원가입 링크 부분은 동일) ... */}

                <div className="signup-link">
                    <p>
                        계정이 없으신가요? <Link to="/signup">회원가입</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
