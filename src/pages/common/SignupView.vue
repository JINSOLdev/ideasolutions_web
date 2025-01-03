<template>
    <div>
        <h2 class="px-4 py-3">Please Sign Up</h2>
        <form class="px-4 py-3" @submit.prevent="fnSignup">
            <div class="mb-3">
                <label for="usernameInput" class="form-label">User Name</label>
                <input v-model="state.username" type="text" class="form-control" id="usernameInput" placeholder="username" autocomplete="username" />
            </div>
            <div class="mb-3">
                <label for="nameInput" class="form-label">Name</label>
                <input
                    v-model="state.name"
                    type="text"
                    class="form-control"
                    id="nameInput"
                    placeholder="4 to 10 lowercase letters (a-z) or numbers (0-9)  "
                    autocomplete="name"
                />
            </div>
            <div class="mb-3">
                <label for="emailInput" class="form-label">Email address</label>
                <input v-model="state.email" type="email" class="form-control" id="emailInput" placeholder="email@example.com" autocomplete="email" />
            </div>
            <div class="mb-3">
                <label for="phoneInput" class="form-label">Phone</label>
                <input v-model="state.phone" type="number" class="form-control" id="phoneInput" placeholder="your number" autocomplete="tel" />
            </div>
            <div class="mb-3">
                <label for="passwordInput" class="form-label">Password</label>
                <input v-model="state.password" type="password" class="form-control" id="passwordInput" placeholder="password" autocomplete="new-password" />
            </div>
            <button type="submit" class="btn btn-primary">Sign up</button>
            <p v-if="state.errorMessage" class="error-message">{{ state.errorMessage }}</p>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { API_URL } from '@/api/index.js';

export default {
    setup() {
        const state = reactive({
            name: '',
            email: '',
            password: '',
            username: '',
            errorMessage: '',
        });

        const router = useRouter();

        const fnSignup = async () => {
            if (!state.name || !state.email || !state.password || !state.username) {
                state.errorMessage = 'Please fill in all fields.';
                return;
            }

            if (state.name.length < 4 || !/^[a-z]+$/.test(state.name)) {
                state.errorMessage = 'Name must be at least 4 lowercase letters or numbers(0-9).';
                return;
            }

            try {
                const response = await axios.post(`${API_URL}/signup`, {
                    name: state.name,
                    email: state.email,
                    password: state.password,
                    username: state.username,
                });
                console.log('response:', JSON.stringify(response, null, 2));
                router.push('/login');
            } catch (error) {
                state.errorMessage = error.response?.data?.message || 'Unable to connect to the server.';
                console.error('Error:', error);
            }
        };

        return { state, fnSignup };
    },
};
</script>

<style scoped>
.error-message {
    color: red;
    margin-top: 10px;
}
</style>
