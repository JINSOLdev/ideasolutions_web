<template>
    <div class="userPage">
        <div class="menu">
            <ul>
                <li @click="selectMenu('profile')">내 프로필</li>
                <li @click="selectMenu('post')">포스트</li>
            </ul>
        </div>
        <div class="main">
            <div v-if="selectedMenu === 'profile'" class="profile-section">
                <h2>내 프로필</h2>
                <hr class="mx-4" />
                <form @submit.prevent="saveProfile">
                    <div>
                        <label>User Name:</label>
                        <input type="text" v-model="profile.username" />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="text" v-model="profile.password" />
                    </div>
                    <div>
                        <label>New password:</label>
                        <input type="text" v-model="profile.newPassword" />
                    </div>
                    <div>
                        <label>Name:</label>
                        <input type="text" v-model="profile.name" />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" v-model="profile.email" />
                    </div>
                    <div>
                        <label>Phone:</label>
                        <input type="number" v-model="profile.phone" />
                    </div>
                    <!-- <div>
                        <label>Role:</label>
                        <input type="text" v-model="profile.role" />
                    </div> -->

                    <div class="button-container">
                        <button type="submit">수정</button>
                    </div>
                </form>
            </div>

            <div v-if="selectedMenu === 'post'" class="post-section">
                <h2>내가 작성한 글</h2>
                <hr class="mx-4" />

                <PostFilter v-model:title="params.title" v-model:size="params.size" />
                <hr class="mx-4" />

                <AppGrid :items="posts">
                    <template v-slot="{ item }">
                        <PostItem :title="item.title" :contents="item.contents" :createdAt="item.createdAt" @click="goPage(item.id)" />
                    </template>
                </AppGrid>

                <!-- 페이지네이션 -->
                <AppPagination :current-page="params.page" :page-count="pageCount" @page="(page) => (params.page = page)" />
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed, watchEffect, reactive } from 'vue';
import { API_URL } from '@/api/index.js';
import { getPosts } from '@/api/posts';
import { useRouter } from 'vue-router';
import axios from 'axios';
import PostItem from '@/components/posts/PostItem.vue';
import PostFilter from '@/components/posts/PostFilter.vue';
import AppGrid from '@/components/AppGrid.vue';
import AppPagination from '@/components/AppPagination.vue';

export default {
    components: {
        PostItem,
        PostFilter,
        AppGrid,
        AppPagination,
    },
    setup() {
        const selectedMenu = ref('profile');
        const profile = reactive({
            username: '',
            password: '',
            newPassword: '',
            name: '',
            email: '',
            phone: '',
            role: '',
        });

        const selectMenu = (menu) => {
            selectedMenu.value = menu;
            if (menu === 'post') {
                fetchPosts();
            }
        };

        // 사용자 정보 가져오기
        const base64Decode = (str) => {
            // 추가된 Base64 디코딩 함수
            try {
                return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
            } catch (e) {
                console.error('Base64 decoding failed:', e);
                return null;
            }
        };

        const fnUser = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                // Base64 디코딩 추가 및 수정
                const base64Url = token.split('.')[1];
                const decodedValue = JSON.parse(base64Decode(base64Url));

                const username = decodedValue?.username;
                if (!username) {
                    console.error('No username found in token');
                    return;
                }

                const response = await axios.get(`${API_URL}/api/user/${username}`, {
                    headers: {
                        Authorization: ` ${token}`,
                    },
                });
                // console.log('User API response:', response);

                profile.name = response.data.response.name;
                profile.username = response.data.response.username;
                profile.email = response.data.response.email;
                profile.phone = response.data.response.phone;
                // profile.role = response.data.response.role;
            } catch (error) {
                // 에러 메시지 상세화
                console.error('Failed to fetch user data:', error.response?.data || error.message);
            }
        };

        // 프로필 수정
        const saveProfile = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const base64Url = token.split('.')[1];
                const decodedValue = JSON.parse(base64Decode(base64Url));
                const username = decodedValue?.username;

                const response = await axios.put(
                    `${API_URL}/api/user/${username}`,
                    {
                        username: profile.username,
                        password: profile.password,
                        newPassword: profile.newPassword,
                        name: profile.name,
                        email: profile.email,
                        phone: profile.phone,
                        // role: profile.role,
                    },

                    {
                        headers: {
                            Authorization: `${token}`,
                        },
                    }
                );

                console.log('Profile updated successfully', response.data.response);
                alert('프로필이 수정되었습니다.');

                if (profile.newPassword) {
                    localStorage.removeItem('authToken');
                    alert('비밀번호가 변경되었습니다. 다시 로그인 해 주세요.');
                    router.push('/login');
                }
            } catch (err) {
                console.error('Failed to update profile:', err);
                alert('프로필 수정에 실패했습니다.');
            }
        };

        const router = useRouter();
        const posts = ref([]);
        const params = ref({
            title: '',
            contents: '',
            sortProperty: 'updatedAt',
            order: 'desc',
            size: 5,
            page: 1,
        });

        // pagination 계산
        const totalCount = ref(0);
        const pageCount = computed(() => {
            return totalCount.value ? Math.ceil(totalCount.value / params.value.size) : 1;
        });

        // 내가 쓴 글 가져오기
        const fetchPosts = async () => {
            try {
                const adjustedParams = { ...params.value, page: params.value.page - 1 }; // 페이지는 0부터 시작하므로 조정
                console.log('params.size: ', adjustedParams.size);

                const { data } = await getPosts(adjustedParams);

                posts.value = data.response.list || [];
                console.log('Fetched posts: ', posts.value);

                // 서버에서 totalElements로 총 게시물 수 설정
                totalCount.value = data.response.totalElements || 0;
                console.log(`totalCount.value: `, totalCount.value);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            }
        };

        // 페이지네이션 변경 감지
        watchEffect(() => {
            if (selectedMenu.value === 'post') {
                fetchPosts();
            }
        });

        // 게시글 상세 페이지로 이동
        const goPage = (id) => {
            router.push({
                name: 'PostDetail',
                params: {
                    id,
                },
            });
        };

        // 컴포넌트 로드시 데이터 가져오기
        onMounted(() => {
            fnUser();
        });

        return {
            selectedMenu,
            profile,
            selectMenu,
            saveProfile,
            fnUser,
            posts,
            params,
            pageCount,
            fetchPosts,
            goPage,
        };
    },
};
</script>

<style scoped>
.userPage {
    width: 100%;
    height: 100%;
    display: flex;
}

h2 {
    margin-bottom: 2rem;
}

.menu {
    width: 20%;
    background-color: lightgray;
    padding: 20px;
}

.menu ul {
    padding: 0;
}

.menu li {
    list-style-type: none;
    cursor: pointer;
    padding: 10px;
    transition: background-color 0.3s ease-in-out;
}

.menu li:hover {
    background-color: #ccc;
}

.main {
    width: 80%;
    background-color: #f5f5f5;
    overflow-y: auto;
    padding: 20px;
}

.profile-section,
.post-section {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

form div {
    margin-bottom: 15px;
}

form label {
    display: inline-block;
    width: 120px;
}

form input,
form select,
form textarea {
    width: calc(100% - 130px);
    padding: 5px;
}

.button-container {
    display: flex;
    justify-content: flex-end;
}

button {
    margin-top: 15px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>
