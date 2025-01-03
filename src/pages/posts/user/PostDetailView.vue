<template>
    <div class="px-4 py-4">
        <div class="mx-4">
            <h2>{{ post.title }}</h2>
            <p>{{ post.contents }}</p>
            <p class="text-muted">{{ post.createdAt }}</p>
        </div>
        <hr class="mx-4" />
        <div class="row g-2 mx-4">
            <div class="col-auto">
                <button class="btn btn-outline-dark">이전글</button>
            </div>
            <div class="col-auto">
                <button class="btn btn-outline-dark">다음글</button>
            </div>
            <div class="col-auto me-auto"></div>
            <div class="col-auto">
                <button class="btn btn-outline-dark" @click="goListPage">목록</button>
            </div>
            <div class="col-auto">
                <button class="btn btn-outline-primary" @click="goEditPage">수정</button>
            </div>
            <div class="col-auto">
                <button class="btn btn-outline-danger" @click="remove">삭제</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';
import { onMounted, reactive } from 'vue';
import { getPostById, deletePost } from '@/api/posts.js';

export default {
    setup() {
        const router = useRouter();
        const route = useRoute();

        const postId = route.params.id;
        console.log(`postId:`, postId);

        const post = reactive({
            id: postId,
            title: '',
            contents: '',
            createdAt: '',
        });

        // 게시글 데이터 가져오기
        const fetchPost = async () => {
            try {
                const { data } = await getPostById(postId);
                console.log('Fetched post data:', data);

                const postData = data;
                if (postData) {
                    post.title = postData.response.title || '';
                    post.contents = postData.response.contents || '';
                    post.createdAt = postData.response.createdAt;
                }
            } catch (error) {
                console.error('Error fetching post:', error.message);
                alert('게시글을 불러오는 데 실패했습니다.');
            }
        };

        onMounted(fetchPost);

        const goEditPage = () => {
            router.push({
                name: 'PostWriteEdit',
                params: { id: postId },
            });
            console.log(`수정할 postId:`, postId);
        };

        // 게시글 삭제
        const remove = async () => {
            try {
                if (confirm('삭제 하시겠습니까?') === false) {
                    return;
                }
                await deletePost(postId); // postId로 삭제
                router.push({ name: 'PostList' });
            } catch (error) {
                console.error('Failed to delete post');
            }
        };

        // 목록 페이지로 이동
        const goListPage = () => {
            router.push({ name: 'PostList' });
        };

        return { goListPage, goEditPage, remove, post };
    },
};
</script>

<style scoped></style>
