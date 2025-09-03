import axios from 'axios';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'https://43.201.107.27:8080', // 기본 API 주소
});

// 요청 인터셉터 (Request Interceptor)
axiosInstance.interceptors.request.use(
  (config) => {
    // 요청을 보내기 전에 localStorage에서 토큰을 가져옵니다.
    const token = localStorage.getItem('authToken');

    // 토큰이 존재하면 Authorization 헤더에 추가합니다.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (Response Interceptor)
axiosInstance.interceptors.response.use(
  (response) => {
    // 정상 응답은 그대로 반환
    return response;
  },
  (error) => {
    // 응답 에러 처리
    if (error.response && error.response.status === 401) {
      // 401 에러 발생 시 (토큰 만료 등)
      console.warn('401 Unauthorized 에러 발생. 자동 로그아웃 처리됩니다.');
      localStorage.removeItem('authToken'); // 만료된 토큰 삭제
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      window.location.href = '/'; // 로그인 페이지로 리디렉션
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
