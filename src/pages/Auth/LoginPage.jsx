import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// `axiosInstance`의 경로를 `api` 폴더 바로 아래를 보도록 수정합니다.
import axiosInstance from '../../api/auth/axiosInstance';
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
      setError(
        err.response?.data?.message || '아이디 또는 비밀번호를 확인해주세요.'
      );
    }
  };

  return (
    <div className="login-page-container">
      {/* 상단 40% 영역 */}
      <div className="login-top-section">RE:visit</div>

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
          {/* 에러 메시지 표시 영역 */}
          <div className="error-message">{error && <p>{error}</p>}</div>

          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

        {/* 소셜 로그인 섹션 */}
        <p className="social-login-divider">또는</p>
        <div className="social-login-text-buttons">
          <button>카카오 로그인</button>
          <button>구글 로그인</button>
          <button>네이버 로그인</button>
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
