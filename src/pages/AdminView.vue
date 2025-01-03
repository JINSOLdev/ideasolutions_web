<template>
    <div class="userPage">
        <div class="menu">
            <ul>
                <li @click="selectMenu('profile')">관리자</li>
                <li @click="selectMenu('member')">멤버</li>
                <li @click="selectMenu('post')">게시글</li>
            </ul>
        </div>
        <div class="main">
            <div v-if="selectedMenu === 'profile'" class="profile-section">
                <h2>관리자</h2>
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
                        <input type="text" v-model="profile.phone" />
                    </div>
                    <div>
                        <label>Role:</label>
                        <input type="text" v-model="profile.role" />
                    </div>
                    <div class="button-container">
                        <button type="submit">수정</button>
                    </div>
                </form>
            </div>

            <div v-if="selectedMenu === 'member'" class="member-section">
                <div class="header">
                    <h2>멤버</h2>
                </div>
                <hr class="mx-4" />

                <table class="member-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Modify</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="member in members" :key="member.username">
                            <td>{{ member.username }}</td>
                            <td>{{ member.name }}</td>
                            <td>{{ member.email }}</td>
                            <td>{{ member.phone }}</td>
                            <td>{{ member.role }}</td>
                            <td>
                                <button @click="openModal(member)">수정</button>
                            </td>
                            <td>
                                <button @click="deleteMember(member)">삭제</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- 모달창 -->
                <div v-if="isModalOpen" class="modal-container">
                    <div class="modal-content">
                        <h3>회원 정보 수정</h3>
                        <table class="member-table">
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>New Password</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{{ selectedMember.username }}</td>
                                    <td><input type="newPassword" v-model="selectedMember.newPassword" /></td>
                                    <td>
                                        {{ selectedMember.role }}
                                        <select v-model="selectedMember.role">
                                            <option value="ROLE_USER">ROLE_USER</option>
                                            <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button @click="saveMember">저장</button>
                        <button @click="closeModal">닫기</button>
                    </div>
                </div>

                <div class="pagination">
                    <button :disabled="memberParams.page === 1" @click="goPreviousPage">이전</button>
                    <span>페이지 {{ memberParams.page }} / {{ memberPageCount }}</span>
                    <button :disabled="memberParams.page === memberPageCount" @click="goNextPage">다음</button>
                </div>
            </div>

            <div v-if="selectedMenu === 'post'" class="post-section">
                <h2>전체 문의글</h2>
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
import { adminGetPosts } from '@/api/posts';
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
        const router = useRouter();
        const posts = ref([]);
        const members = ref([]);
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
        const params = ref({
            title: '',
            contents: '',
            sortProperty: 'updatedAt',
            order: 'desc',
            size: 3,
            page: 1,
        });
        const memberParams = ref({
            username: '',
            name: '',
            email: '',
            phone: '',
            role: '',
            size: 5,
            page: 1,
        });
        const memberTotalCount = ref(0);

        const totalCount = ref(0);

        const isModalOpen = ref(false); // 모달창 상태
        const selectedMember = ref([]);

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

                const response = await axios.get(`${API_URL}/api/admin/user/${username}`, {
                    headers: {
                        Authorization: ` ${token}`,
                    },
                });
                console.log('User API response:', response);

                profile.name = response.data.response.name;
                profile.username = response.data.response.username;
                profile.email = response.data.response.email;
                profile.phone = response.data.response.phone;
                profile.role = response.data.response.role;
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
                if (!username) {
                    console.error('No username found in token');
                    return;
                }

                const response = await axios.put(
                    `${API_URL}/api/admin/user/${username}`,
                    {
                        username: profile.username,
                        password: profile.password,
                        newPassword: profile.newPassword,
                        name: profile.name,
                        email: profile.email,
                        phone: profile.phone,
                        role: profile.role,
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
                console.error('Failed to update profile:', err.response?.data || err.message);
                alert('프로필 수정에 실패했습니다.');
            }
        };

        // 관리자 회원조회
        const fetchMembers = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const { data } = await axios.get(`${API_URL}/api/admin/users`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                    params: { page: memberParams.value.page - 1, size: memberParams.value.size },
                });

                members.value = data.response.list || [];
                memberTotalCount.value = data.response.totalElements || 0;
                console.log(`members:`, members.value);
            } catch (err) {
                console.error('Failed to fetch members:', err);
            }
        };

        const goPreviousPage = () => {
            if (memberParams.value.page > 1) {
                memberParams.value.page--;
                fetchMembers();
            }
        };

        const goNextPage = () => {
            if (memberParams.value.page < memberPageCount.value) {
                memberParams.value.page++;
                fetchMembers();
            }
        };

        const memberPageCount = computed(() => Math.ceil(memberTotalCount.value / memberParams.value.size));

        // 관리자 회원 수정 (role, password)
        const openModal = (member) => {
            isModalOpen.value = true;
            selectedMember.value = { ...member };
            console.log(`selectedMember.value: `, selectedMember.value);
        };

        const closeModal = () => {
            isModalOpen.value = false;
            selectedMember.value = {};
        };

        const saveMember = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                // 선택된 멤버의 username을 API 요청에 사용
                const username = selectedMember.value.username;

                // PUT 요청으로 회원 정보 업데이트
                const response = await axios.put(
                    `${API_URL}/api/admin/user/${username}`,
                    {
                        role: selectedMember.value.role,
                        newPassword: selectedMember.value.newPassword,
                    },
                    {
                        headers: {
                            Authorization: `${token}`,
                        },
                    }
                );

                console.log('Member updated successfully:', response.data);
                alert('회원 정보가 수정되었습니다.');

                // 모달 닫기 및 멤버 목록 새로고침
                closeModal();
                fetchMembers();
            } catch (error) {
                console.error('Failed to update member:', error.response?.data || error.message);
                alert('회원 정보 수정에 실패했습니다.');
            }
        };

        // 관리자 회원 삭제
        const deleteMember = async (member) => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const username = member.username;

                const response = await axios.delete(`${API_URL}/api/admin/user/${username}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                console.log('Member deleted successfully:', response.data);
                alert(`회원 "${member.username}"이 삭제 되었습니다.`);
                fetchMembers();
            } catch (error) {
                console.error('Failed to delete member:', error.response?.data || error.message);
                alert('회원 삭제에 실패했습니다.');
            }
        };

        // 전체 문의글
        const adminFetchPosts = async () => {
            try {
                const adjustedParams = { ...params.value, page: params.value.page - 1 };
                const { data } = await adminGetPosts(adjustedParams);

                posts.value = data.response.list || [];
                totalCount.value = data.response.totalElements || 0;
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            }
        };

        const pageCount = computed(() => Math.ceil(totalCount.value / params.value.size));

        const selectMenu = (menu) => {
            selectedMenu.value = menu;
            if (menu === 'post') {
                watchEffect(adminFetchPosts);
            }
        };

        const goPage = (id) => {
            router.push({
                name: 'AdminPostDetail',
                params: {
                    id,
                },
            });
        };

        // 관리자가 멤버 정보 변경(role, password)

        onMounted(() => {
            fnUser();
            fetchMembers();
        });

        return {
            selectedMenu,
            profile,
            selectMenu,
            saveProfile,
            fnUser,
            fetchMembers,
            posts,
            params,
            goPage,
            members,
            memberParams,
            memberPageCount,
            goPreviousPage,
            goNextPage,
            pageCount,
            openModal,
            closeModal,
            isModalOpen,
            selectedMember,
            saveMember,
            deleteMember,
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
.member-section,
.post-section {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.member-section .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

.member-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.member-table th,
.member-table td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
}

.member-table th {
    background-color: #f2f2f2;
    font-weight: bold;
}

.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.pagination button {
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.pagination button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
    background-color: #0056b3;
}

.pagination span {
    font-size: 16px;
    color: #333;
}

.edit-button {
    margin-left: 16px;
}

.modal-container {
    display: flex;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6); /* 반투명 배경 */
    z-index: 1000; /* 다른 요소 위에 표시 */
}

.modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 600px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: auto;
}

.modal-content h3 {
    margin-bottom: 15px;
    text-align: center;
}

.modal-content table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
}

.modal-content th,
.modal-content td {
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
}

.modal-content th {
    background-color: #f2f2f2;
    font-weight: bold;
}

.modal-content input,
.modal-content select {
    width: 100%;
    padding: 5px;
    box-sizing: border-box;
}

.modal-content button {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
}

.modal-content button:hover {
    background-color: #0056b3;
}

button {
    margin: 5px;
}
</style>
