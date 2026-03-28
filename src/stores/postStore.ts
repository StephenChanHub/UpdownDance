import { computed, ref } from 'vue';

const posts = ref([]);
const selectedPostId = ref(null);

const createPost = ({ image, title, content }) => {
  const id = Date.now().toString();

  posts.value.unshift({
    id,
    image,
    title: title?.trim() || 'Untitled',
    content: content?.trim() || '',
    username: 'Stephen',
    createdAt: new Date().toISOString(),
  });

  return id;
};

const updatePost = (id, payload) => {
  posts.value = posts.value.map((post) => {
    if (post.id !== id) return post;
    return {
      ...post,
      ...payload,
      title: payload.title?.trim?.() ?? post.title,
      content: payload.content?.trim?.() ?? post.content,
    };
  });
};

const deletePost = (id) => {
  posts.value = posts.value.filter((post) => post.id !== id);
  if (selectedPostId.value === id) {
    selectedPostId.value = null;
  }
};

const selectPost = (id) => {
  selectedPostId.value = id;
};

const clearSelectedPost = () => {
  selectedPostId.value = null;
};

const selectedPost = computed(() => {
  return posts.value.find((post) => post.id === selectedPostId.value) || null;
});

export const usePostStore = () => ({
  posts,
  selectedPostId,
  selectedPost,
  createPost,
  updatePost,
  deletePost,
  selectPost,
  clearSelectedPost,
});
