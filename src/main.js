import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.js';
import './assets/base.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from '@/scripts/router.js';
import api from '@/api/index.js';

const pinia = createPinia();
const app = createApp(App);

app.use(api).use(router).use(pinia).mount('#app');
