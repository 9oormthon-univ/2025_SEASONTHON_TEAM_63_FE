import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUpCorp } from '../api/authApi';
import './Auth.css';

export default function CorpSignUpForm() {
    const [formData, setFormData] = useState({
        // TODO: Swagger API 문서를 보고 실제 필드명으로 수정하세요.
        email: '',
        password: '',
        passwordConfirm: '',
        companyName: '',
        businessRegistrationNumber: '', // 사업자 등록번호
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
            const { passwordConfirm, ...corpData } = formData;
            await signUpCorp(corpData);

            alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
            navigate('/login');
        } catch (err) {
            setError(err.message || '회원가입에 실패했습니다.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="auth-title">기업 회원가입</h1>
                <form onSubmit={handleSubmit} className="auth-form">
                    {/* TODO: API 명세에 맞는 input 필드들을 구성하세요. */}
                    <input name="email" type="email" placeholder="기업 이메일" onChange={handleChange} required />
                    <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required />
                    <input
                        name="passwordConfirm"
                        type="password"
                        placeholder="비밀번호 확인"
                        onChange={handleChange}
                        required
                    />
                    <input name="companyName" type="text" placeholder="회사명" onChange={handleChange} required />
                    <input
                        name="businessRegistrationNumber"
                        type="text"
                        placeholder="사업자 등록번호"
                        onChange={handleChange}
                        required
                    />

                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="auth-button">
                        가입하기
                    </button>
                </form>
                <div className="auth-link">
                    <p>
                        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
