import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('authToken') || '');
    const user = ref(null);

    const isLoggedIn = computed(() => !!token.value);
    const adminLoggedIn = computed(() => user.value?.role === 'ROLE_ADMIN');
    const username = computed(() => user.value?.username || '') 

    const checkLoginStatus = () => {
        if (token.value) {
            const decoded = JSON.parse(atob(token.value.split('.')[1]));
            user.value = decoded; // JWT에서 사용자 정보 디코딩
        } else {
            user.value = null;
        }
    };

    const login = (newToken) => {
        localStorage.setItem('authToken', newToken);
        token.value = newToken;
        // checkLoginStatus();
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        token.value = '';
        user.value = null;
        alert('로그아웃 되었습니다.');
    };

    checkLoginStatus(); // 초기 상태 설정

    return {
        isLoggedIn,
        adminLoggedIn,
        username,
        login,
        logout,
    };
});
