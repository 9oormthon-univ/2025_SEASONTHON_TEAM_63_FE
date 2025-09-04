import axios from 'axios';
import { API_BASE_URL } from '../../config'; // config.js에서 baseURL 가져오기

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// 요청 인터셉터: 모든 요청에 인증 토큰을 자동으로 추가합니다.
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 401 에러 발생 시 자동 로그아웃 처리
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('authToken');
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');
            window.location.href = '/'; // 로그인 페이지 또는 개인정보 페이지로 리디렉션
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
