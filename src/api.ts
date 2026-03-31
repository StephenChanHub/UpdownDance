const BASE_URL = 'https://urtumnpimfvy.sealosgzg.site';
const TOKEN_KEY = 'updown_token';

const getToken = () => {
  try {
    return uni.getStorageSync(TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

const setToken = (token: string) => {
  try {
    if (token) {
      uni.setStorageSync(TOKEN_KEY, token);
    } else {
      uni.removeStorageSync(TOKEN_KEY);
    }
  } catch {
    // ignore
  }
};

const buildUrl = (path: string) => `${BASE_URL}${path}`;

const request = <T = any>({
  url,
  method = 'GET',
  data,
  auth = false,
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  data?: Record<string, any>;
  auth?: boolean;
}) => new Promise<T>((resolve, reject) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  uni.request({
    url: buildUrl(url),
    method,
    data,
    header: headers,
    success: (res: any) => {
      const body = res?.data || {};
      if (res.statusCode >= 200 && res.statusCode < 300 && body.code === 0) {
        resolve(body.data as T);
        return;
      }
      reject(new Error(body.message || 'Request failed'));
    },
    fail: (err: any) => {
      reject(new Error(err?.errMsg || 'Network error'));
    },
  });
});

export const api = {
  getToken,
  setToken,

  health: () => request<{ status: string }>({ url: '/health' }),

  register: (payload: {
    nickname: string;
    account: string;
    password: string;
    phone?: string;
    email?: string;
    avatar?: string;
  }) => request<{ accessToken: string; user: any }>({
    url: '/auth/register',
    method: 'POST',
    data: payload,
  }),

  login: (payload: { account?: string; nickname?: string; password: string }) => request<{ accessToken: string; user: any }>({
    url: '/auth/login',
    method: 'POST',
    data: payload,
  }),

  me: () => request<{ user: any }>({ url: '/auth/me', auth: true }),

  logout: () => request<{ success: boolean }>({
    url: '/auth/logout',
    method: 'POST',
    auth: true,
  }),

  updateProfile: (payload: Partial<{
    nickname: string;
    account: string;
    bio: string;
    phone: string;
    email: string;
    avatar: string;
  }>) => request<{ user: any }>({
    url: '/users/profile',
    method: 'PATCH',
    data: payload,
    auth: true,
  }),

  registerLocalMediaIndex: (payload: { localPath: string; type: string }) => request<{
    mediaId: string;
    mediaRef: string;
    localPath: string;
    type: string;
  }>({
    url: '/media/local-index',
    method: 'POST',
    data: payload,
    auth: true,
  }),

  getLocalMediaIndex: (mediaId: string) => request({ url: `/media/local-index/${mediaId}` }),

  createPost: (payload: {
    image?: string;
    images?: string[];
    ratio: '9:16' | '1:1' | '16:9';
    title: string;
    content?: string;
  }) => request<{ post: any }>({
    url: '/posts',
    method: 'POST',
    data: payload,
    auth: true,
  }),

  getPosts: (params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    authorId?: string;
  }) => request<{
    list: any[];
    pagination: { page: number; pageSize: number; total: number };
  }>({
    url: '/posts',
    data: params,
  }),

  getPostDetail: (postId: string) => request<{ post: any }>({ url: `/posts/${postId}` }),

  updatePost: (postId: string, payload: Partial<{
    image: string;
    images: string[];
    ratio: '9:16' | '1:1' | '16:9';
    title: string;
    content: string;
  }>) => request<{ post: any }>({
    url: `/posts/${postId}`,
    method: 'PATCH',
    data: payload,
    auth: true,
  }),

  deletePost: (postId: string) => request<{ success: boolean }>({
    url: `/posts/${postId}`,
    method: 'DELETE',
    auth: true,
  }),
};
