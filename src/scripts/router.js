import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/HomeView.vue';
import About from '@/pages/AboutView.vue';
import Login from '@/pages/common/LoginView.vue';
import Signup from '@/pages/common/SignupView.vue';
import Products from '@/pages/ProductView.vue';
import NotFound from '@/pages/NotFoundView.vue';
import PostList from '@/pages/posts/user/PostListView.vue';
import PostWrite from '@/pages/posts/user/PostWriteView.vue';
import PostDetail from '@/pages/posts/user/PostDetailView.vue';
import AdminPostDetail from '@/pages/posts/admin/AdminPostDetailView.vue';
import AdminPostWriteEdit from '@/pages/posts/admin/AdminPostWriteView.vue';
import AdminPostList from '@/pages/posts/admin/AdminPostListView.vue'
import Admin from '@/pages/AdminView.vue';
import User from '@/pages/UserView.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/about',
        name: 'About',
        component: About,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup,
    },
    {
        path: '/admin',
        name: 'Admin',
        component: Admin,
        meta: { requiresAuth: true },
    },
    {
        path: '/myPage',
        name: 'User',
        component: User,
        meta: { requiresAuth: true },
    },
    {
        path: '/products',
        name: 'Products',
        component: Products,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
    },
    {
        path: '/posts',
        name: 'PostList',
        component: PostList,
    },
    {
        path: '/post',
        name: 'PostWriteCreate',
        component: PostWrite,
    },
    {
        path: '/post/:id',
        name: 'PostWriteEdit',
        component: PostWrite,
    },
    {
        path: '/post/:id',
        name: 'PostDetail',
        component: PostDetail,
        props: true,
    },
    {
        path: '/admin/post/:id',
        name: 'AdminPostDetail',
        component: AdminPostDetail,
    },
    {
        path: '/admin/post/:id',
        name: 'AdminPostWriteEdit',
        component : AdminPostWriteEdit
    },
    {
        path: '/admin',
        name : 'AdminPostList',
        component: AdminPostList,
    }
 
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
