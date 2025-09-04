import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/auth/axiosInstance';

// 이전 답변에서 빠졌던 './Auth.css' import 추가
import './Auth.css';

export default function SignUpForm() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        passwordConfirm: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const { username, password } = formData;

            await axiosInstance.post('/api/auth/sign-up', { username, password });

            const loginResponse = await axiosInstance.post('/api/auth/login', { username, password });

            if (loginResponse.data.success && loginResponse.data.data.access) {
                const accessToken = loginResponse.data.data.access;
                localStorage.setItem('authToken', accessToken);

                alert('기본 가입 및 로그인이 완료되었습니다. 추가 정보를 입력해주세요.');
                navigate('/signup-step2');
            } else {
                throw new Error(loginResponse.data.message || '로그인에 실패했습니다.');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || '회원가입 또는 로그인에 실패했습니다.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="auth-title">회원가입 (1/2)</h1>
                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        name="username"
                        type="text"
                        placeholder="아이디"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="비밀번호"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="passwordConfirm"
                        type="password"
                        placeholder="비밀번호 확인"
                        value={formData.passwordConfirm}
                        onChange={handleChange}
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="auth-button">
                        다음 단계로
                    </button>
                </form>
                <div className="auth-link">
                    <p>
                        이미 계정이 있으신가요? <Link to="/">로그인</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
