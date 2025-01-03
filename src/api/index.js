import axios from 'axios';

export const REMOTE_BASE_URL = 'http://ideasolutions.co.kr:8085'; // Idea
export const DEV_BASE_URL = 'http://192.168.0.183:8085'; // Mi

export const API_URL = REMOTE_BASE_URL;

// 기본 axios 인스턴스 설정
// const defaultAxiosInstance = axios.create({
//     baseURL: REMOTE_BASE_URL, // 기본 API URL 설정
//     timeout: 5000,
//     headers: { 'Content-Type': 'application/json' },
// });

// 별도 API 인스턴스 생성 함수
function createApiInstance(baseURL, options = {}) {
    return axios.create({
        baseURL,
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
}

// posts API 인스턴스 생성
export const posts = createApiInstance(`${API_URL}`);
export const post = createApiInstance(`${API_URL}`);

// 기본 axios 인스턴스 export
// export default defaultAxiosInstance;
