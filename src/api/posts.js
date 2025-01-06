import { posts, post } from '.';

// GetPosts (params x)
// export function getPosts(params) {
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//         alert('로그인이 필요합니다.');
//         return;
//     }
//     // console.log('Stored Token:', localStorage.getItem('authToken'));
//     return post.get('/api/posts', { params, headers: { Authorization: `${token}` } });
// }

// GetPosts (params o)
export function getPosts(params) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }

    const queryString = new URLSearchParams(params).toString();

    return posts.get(`/api/posts?${queryString}`, {
        headers: { Authorization: `${token}` },
    });
}

// GetPostById
export function getPostById(id) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }
    return post.get(`/api/post/${id}`, {
        headers: { Authorization: `${token}` },
    });
}

// CreatePost
export function createPost(data) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }
    return post.post('/api/post', data, {
        headers: { Authorization: `${token}` },
    });
}

// UpdatePost
export function updatePost(id, data) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }
    return posts.put(`/api/post/${id}`, data, {
        headers: { Authorization: `${token}` },
    });
}

// DeletePost
export function deletePost(id) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }

    return posts.delete(`/api/post/${id}`, {
        headers: { Authorization: `${token}` },
    });
}

// Admin

// AdminGetPosts
export function adminGetPosts(params) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }

    const queryString = new URLSearchParams(params).toString();

    return posts.get(`/api/admin/posts?${queryString}`, {
        headers: { Authorization: `${token}` },
    });
}

// AdminGetPostById
export function adminGetPostById(id) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }

    return post.get(`/api/admin/post/${id}`, {
        headers: { Authorization: `${token}` },
    });
}

// AdminCreatePost
export function adminCreatePost(data) {
    const token = localStorage.getItem('authToken');
    if(!token) {
        alert('로그인이 필요합니다.')
        return
    }
    return post.post(`/api/admin/post`, data, {
        headers: { Authorization: `${token}` },
    })
}

// AdminUpdatePost
export function adminUpdatePost(id, data) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }
    return posts.put(`/api/admin/post/${id}`, data, {
        headers: { Authorization: `${token}` },
    })
}

// AdminDeletePost
export function adminDeletePost(id){
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }
    return posts.delete(`/api/admin/post/${id}`, {
        headers: { Authorization: `${token}` },
    })
}
