import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// 경로 수정: 'auth' 폴더가 아닌 'api' 폴더 바로 아래의 인스턴스를 사용합니다.
import axiosInstance from '../../api/auth/axiosInstance';
import LogoIcon from '../../assets/icon/logo.svg?react';
// PNG 이미지를 import 합니다.
import Kakao from '../../assets/icon/login/kakao.png';
import Naver from '../../assets/icon/login/naver.png';
import Google from '../../assets/icon/login/google.png';

import './LoginPage.css'; // 새로 만든 CSS 파일 import

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const credentials = { username, password };
            const response = await axiosInstance.post('/api/auth/login', credentials);

            if (response.data.success && response.data.data.access) {
                const accessToken = response.data.data.access;
                localStorage.setItem('authToken', accessToken);
                navigate('/main');
            } else {
                throw new Error(response.data.message || '로그인에 실패했습니다.');
            }
        } catch (err) {
            setError(err.response?.data?.message || '아이디 또는 비밀번호를 확인해주세요.');
        }
    };

    return (
        <div className="login-page-container">
            {/* 상단 40% 영역 */}
            <div className="login-top-section">
                <LogoIcon />
            </div>

            {/* 하단 60% 영역 */}
            <div className="login-bottom-section">
                <form onSubmit={handleSubmit} className="login-form">
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
                    <div className="error-message">{error && <p>{error}</p>}</div>
                    <button type="submit" className="login-button">
                        로그인
                    </button>
                </form>

                {/* 소셜 로그인 섹션 */}
                <div className="social-login-divider">
                    <span className="line"></span>
                    <span>또는</span>
                    <span className="line"></span>
                </div>

                <p className="social-login-title">소셜 계정으로 로그인</p>

                <div className="social-login-icon-buttons">
                    {/* PNG 이미지는 <img> 태그로 사용해야 합니다. */}
                    <button className="social-icon-button">
                        <img src={Kakao} alt="카카오 로그인" />
                    </button>
                    <button className="social-icon-button">
                        <img src={Google} alt="구글 로그인" />
                    </button>
                    <button className="social-icon-button">
                        <img src={Naver} alt="네이버 로그인" />
                    </button>
                </div>

                {/* 회원가입 링크 */}
                <div className="signup-link">
                    <p>
                        계정이 없으신가요? <Link to="/signup">회원가입</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
