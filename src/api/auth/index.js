import axiosInstance from '../axiosInstance';

/**
 * 로그인 API
 */
export const login = async (credentials) => {
    const response = await axiosInstance.post('/api/auth/login', credentials);
    if (response.data.success && response.data.data.access) {
        return response.data.data.access;
    }
    throw new Error(response.data.message || '로그인 응답이 올바르지 않습니다.');
};

/**
 * 1단계: 기본 회원가입 API
 */
export const initialSignUp = (userData) => {
    return axiosInstance.post('/api/auth/sign-up', userData);
};

/**
 * 2단계: 개인 회원 추가 정보 입력 API
 */
export const completeUserSignUp = (additionalData) => {
    return axiosInstance.post('/api/auth/complete-sign-up/user', additionalData);
};
