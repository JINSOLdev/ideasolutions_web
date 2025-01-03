<template>
    <div>
        <h2 class="px-4 py-3">Please Log In</h2>
        <form class="px-4 py-3" @submit.prevent="fnLogin">
            <div class="mb-3">
                <label for="exampleDropdownFormEmail1" class="form-label">Email address</label>
                <input v-model="state.username" class="form-control" id="exampleDropdownFormEmail1" placeholder="email@example.com" />
            </div>
            <div class="mb-3">
                <label for="exampleDropdownFormPassword1" class="form-label">Password</label>
                <input v-model="state.password" type="password" class="form-control" id="exampleDropdownFormPassword1" placeholder="Password" />
            </div>
            <div class="mb-3">
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="dropdownCheck" />
                    <label class="form-check-label" for="dropdownCheck"> Remember me </label>
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Sign in</button>
            <p v-if="state.errorMessage" class="error-message">{{ state.errorMessage }}</p>
            <br />
            <br />
            <div class="dropdown-divider"></div>
            <RouterLink class="dropdown-item" to="/signup">New around here? Sign up</RouterLink>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/api/index.js';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

export default {
    setup() {
        const state = reactive({
            username: '',
            password: '',
            errorMessage: '',
        });

        const router = useRouter();
        const authStore = useAuthStore();

        const fnLogin = async () => {
            if (!state.username || !state.password) {
                state.errorMessage = 'Please enter your ID and password.';
                return;
            }

            try {
                const response = await axios.post(`${API_URL}/login`, {
                    username: state.username,
                    password: state.password,
                });

                // console.log('Response: ', response);

                const token = response?.headers['authorization']?.replace('Bearer ', '');
                if (token) {
                    authStore.login(token);
                    alert('로그인 성공');
                    router.push('/');
                } else {
                    state.errorMessage = 'Token not found in response headers.';
                    console.error('Invalid ID or password.');
                }
            } catch (error) {
                state.errorMessage = error.response?.data?.message || 'Unable to connect to the server.';
                console.error('Error:', error);
            }
        };

        return { state, fnLogin };
    },
};
</script>

<style scoped>
.error-message {
    color: red;
    margin-top: 10px;
}
</style>
