<template>
    <header>
        <div class="header-content">
            <div class="username">
                <span> <router-link to="/">{{ username }}</router-link></span>님, 안녕하세요!
            </div>
            <ul class="menu">
                <li>
                    <router-link to="/">홈</router-link>
                </li>
                <li>
                    <router-link to="/about">회사소개</router-link>
                </li>
                <li>
                    <router-link to="/products">제품소개</router-link>
                </li>
                <li>
                    <router-link to="/posts/write">고객문의</router-link>
                </li>
                <li>
                    <router-link to="/posts">고객지원</router-link>
                </li>
                <li v-if="!isLoggedIn">
                    <router-link to="/login">로그인</router-link>
                </li>
                <li v-if="isLoggedIn && !adminLoggedIn">
                    <router-link to="/myPage">마이페이지</router-link>
                </li>
                <li v-if="adminLoggedIn">
                    <router-link to="/admin">관리자페이지</router-link>
                </li>
                <li v-if="isLoggedIn">
                    <router-link to="/login" @click="logout">로그아웃</router-link>
                </li>
            </ul>
        </div>
    </header>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js';
import { computed } from 'vue';

export default {
    setup() {
        const authStore = useAuthStore();

        // 반응성으로 로그인 상태와 username 가져오기
        const isLoggedIn = computed(() => authStore.isLoggedIn);
        const adminLoggedIn = computed(() => authStore.adminLoggedIn);
        const username = computed(() => authStore.username);

        const logout = () => {
            authStore.logout();
        };

        return {
            isLoggedIn,
            adminLoggedIn,
            username,
            logout,
        };
    },
};
</script>

<style scoped>
.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    background-color: #f5f5f5;
    padding: 0 20px; /* 좌우 패딩을 추가하여 콘텐츠를 양옆으로 여백을 줌 */
}

/* .username {
    font-weight: bold;
    color: #333;
    margin-right: 10px;
} */

span {
    font-weight: bold;
    text-decoration: underline ;
    color: #333;
    margin-right: 10px;
}

.menu {
    display: flex;
    gap: 15px;
    margin: 0;
    padding: 0;
}

li {
    list-style: none;
    margin: 15px;
}

a {
    text-decoration: none;
    color: inherit;
    font-weight: bold;
}

a:hover {
    color: #5368df; /* hover 시 색상 변경 */
}
</style>
