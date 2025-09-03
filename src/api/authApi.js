// src/api/authApi.js

const API_BASE_URL = 'https://43.201.107.27:8080';

// API 요청을 위한 공통 함수 (이 함수는 export하지 않습니다)
async function request(endpoint, options) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: `서버 에러: ${response.statusText}` };
    }
    throw new Error(errorData.message || '요청 처리 중 오류가 발생했습니다.');
  }

  const responseData = await response.text();
  return responseData ? JSON.parse(responseData) : {};
}

// --- 여기서부터 모든 함수를 export 합니다 ---

/**
 * 로그인 API
 * @param {object} credentials - { username, password }
 */
export const login = async (credentials) => {
  const response = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (response.success && response.data.access) {
    return response.data.access;
  } else {
    throw new Error('로그인 응답 형식이 올바르지 않습니다.');
  }
};

/**
 * 1단계: 기본 회원가입 API
 * @param {object} userData - { username, password }
 */
export const initialSignUp = (userData) => {
  return request('/api/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

/**
 * 2단계: 개인 회원 추가 정보 입력 API
 * @param {object} additionalData - { nickname, email, phone }
 */
export const completeUserSignUp = (additionalData) => {
  return request('/api/auth/complete-sign-up/user', {
    method: 'POST',
    body: JSON.stringify(additionalData),
  });
};

/**
 * 2단계: 기업 회원 추가 정보 입력 API
 * @param {object} additionalData - 기업 정보
 */
export const completeCorpSignUp = (additionalData) => {
  return request('/api/auth/complete-sign-up/corp', {
    method: 'POST',
    body: JSON.stringify(additionalData),
  });
};
