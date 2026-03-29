import { computed, ref } from 'vue';
import { useAuthStore } from './authStore';

const posts = ref([]);
const selectedPostId = ref(null);
const searchQuery = ref('');

const createPost = ({ image, title, content }) => {
  const id = Date.now().toString();
  const { user } = useAuthStore();

  posts.value.unshift({
    id,
    image,
    title: title?.trim() || 'Untitled',
    content: content?.trim() || '',
    username: user.nickname || user.account || 'Anonymous',
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

const setSearchQuery = (value) => {
  searchQuery.value = value?.trim?.() ?? '';
};

const selectedPost = computed(() => {
  return posts.value.find((post) => post.id === selectedPostId.value) || null;
});

const filteredPosts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) return posts.value;

  return posts.value
    .map((post) => {
      const username = (post.username || '').toLowerCase();
      const title = (post.title || '').toLowerCase();
      const content = (post.content || '').toLowerCase();

      let priority = -1;

      if (username.includes(query)) {
        priority = 3;
      } else if (title.includes(query)) {
        priority = 2;
      } else if (content.includes(query)) {
        priority = 1;
      }

      return {
        post,
        priority,
      };
    })
    .filter((item) => item.priority > 0)
    .sort((a, b) => b.priority - a.priority)
    .map((item) => item.post);
});

export const usePostStore = () => ({
  posts,
  searchQuery,
  filteredPosts,
  selectedPostId,
  selectedPost,
  createPost,
  updatePost,
  deletePost,
  selectPost,
  clearSelectedPost,
  setSearchQuery,
});
