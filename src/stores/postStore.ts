import { computed, ref } from 'vue';
import { api } from '../api';
import { useAuthStore } from './authStore';

const posts = ref<any[]>([]);
const selectedPostId = ref<string | null>(null);
const searchQuery = ref('');
const pagination = ref({ page: 1, pageSize: 20, total: 0 });

const hydratePost = async (post: any) => {
  const next = { ...post };
  const refs = (next.images?.length ? next.images : (next.image ? [next.image] : [])) as string[];
  const resolved = await Promise.all(refs.map(async (ref) => {
    if (!ref?.startsWith('local://media/')) return ref;
    const mediaId = ref.replace('local://media/', '');
    try {
      const data: any = await api.getLocalMediaIndex(mediaId);
      return data.localPath || ref;
    } catch {
      return ref;
    }
  }));

  next.images = resolved;
  next.image = resolved[0] || next.image || '';
  return next;
};

const fetchPosts = async (params?: { page?: number; pageSize?: number; keyword?: string; authorId?: string }) => {
  const data = await api.getPosts({ page: 1, pageSize: 20, ...params });
  pagination.value = data.pagination;
  posts.value = await Promise.all((data.list || []).map((item) => hydratePost(item)));
};

const fetchPostDetail = async (id: string) => {
  const data = await api.getPostDetail(id);
  const post = await hydratePost(data.post);
  const idx = posts.value.findIndex((p) => p.id === id);
  if (idx >= 0) posts.value[idx] = post;
  else posts.value.unshift(post);
  selectedPostId.value = id;
};

const registerImages = async (paths: string[]) => {
  const result = await Promise.all(paths.map((localPath) => api.registerLocalMediaIndex({ localPath, type: 'image' })));
  return result.map((item) => item.mediaRef);
};

const createPost = async ({ images, image, title, content, ratio }: {
  images?: string[];
  image?: string;
  title: string;
  content?: string;
  ratio: '9:16' | '1:1' | '16:9';
}) => {
  const sourceImages = images?.length ? images : (image ? [image] : []);
  const mediaRefs = await registerImages(sourceImages);
  const data = await api.createPost({
    images: mediaRefs,
    image: mediaRefs[0],
    title: title?.trim(),
    content: content?.trim(),
    ratio,
  });
  const post = await hydratePost(data.post);
  posts.value.unshift(post);
  return post.id;
};

const updatePost = async (id: string, payload: Partial<{ images: string[]; image: string; title: string; content: string; ratio: '9:16' | '1:1' | '16:9' }>) => {
  let mediaRefs = payload.images;
  if (payload.images?.length) {
    mediaRefs = await registerImages(payload.images);
  }

  const data = await api.updatePost(id, {
    ...payload,
    images: mediaRefs,
    image: mediaRefs?.[0] || payload.image,
    title: payload.title?.trim?.(),
    content: payload.content?.trim?.(),
  });

  const post = await hydratePost(data.post);
  posts.value = posts.value.map((item) => (item.id === id ? post : item));
};

const deletePost = async (id: string) => {
  await api.deletePost(id);
  posts.value = posts.value.filter((post) => post.id !== id);
  if (selectedPostId.value === id) {
    selectedPostId.value = null;
  }
};

const selectPost = (id: string) => {
  selectedPostId.value = id;
};

const clearSelectedPost = () => {
  selectedPostId.value = null;
};

const setSearchQuery = (value: string) => {
  searchQuery.value = value?.trim?.() ?? '';
};

const selectedPost = computed(() => posts.value.find((post) => post.id === selectedPostId.value) || null);

const filteredPosts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return posts.value;
  return posts.value.filter((post) => {
    const username = (post.username || '').toLowerCase();
    const title = (post.title || '').toLowerCase();
    const content = (post.content || '').toLowerCase();
    return username.includes(query) || title.includes(query) || content.includes(query);
  });
});

export const usePostStore = () => ({
  posts,
  searchQuery,
  filteredPosts,
  pagination,
  selectedPostId,
  selectedPost,
  fetchPosts,
  fetchPostDetail,
  createPost,
  updatePost,
  deletePost,
  selectPost,
  clearSelectedPost,
  setSearchQuery,
});
