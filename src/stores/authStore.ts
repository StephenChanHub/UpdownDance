import { computed, reactive, ref } from 'vue';
import { api } from '../api';

const STORAGE_KEY = 'updown_auth';

const _saved = (() => {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const isLoggedIn = ref(_saved?.isLoggedIn ?? false);

const user = reactive({
  id: _saved?.id ?? '',
  nickname: _saved?.nickname ?? '',
  account: _saved?.account ?? '',
  avatar: _saved?.avatar ?? '',
  bio: _saved?.bio ?? '',
  phone: _saved?.phone ?? '',
  email: _saved?.email ?? '',
  following: _saved?.following ?? 0,
  followers: _saved?.followers ?? 0,
  likes: _saved?.likes ?? 0,
});

const persist = () => {
  try {
    uni.setStorageSync(STORAGE_KEY, JSON.stringify({
      isLoggedIn: isLoggedIn.value,
      ...user,
    }));
  } catch {
    // ignore
  }
};

const clearPersist = () => {
  try {
    uni.removeStorageSync(STORAGE_KEY);
  } catch {
    // ignore
  }
};

const applyUser = (payload: any) => {
  user.id = payload?.id || '';
  user.nickname = payload?.nickname || '';
  user.account = payload?.account || '';
  user.avatar = payload?.avatar || '';
  user.bio = payload?.bio || '';
  user.phone = payload?.phone || '';
  user.email = payload?.email || '';
  user.following = payload?.following || 0;
  user.followers = payload?.followers || 0;
  user.likes = payload?.likes || 0;
};

const avatarLabel = computed(() => {
  if (!isLoggedIn.value) return '?';
  const src = user.nickname || user.account;
  return src.slice(0, 2).toUpperCase();
});

const login = async (payload: { account?: string; nickname?: string; password: string }) => {
  const data = await api.login(payload);
  api.setToken(data.accessToken);
  applyUser(data.user);
  isLoggedIn.value = true;
  persist();
};

const register = async (payload: {
  nickname: string;
  account: string;
  password: string;
  phone?: string;
  email?: string;
  avatar?: string;
}) => {
  const data = await api.register(payload);
  api.setToken(data.accessToken);
  applyUser(data.user);
  isLoggedIn.value = true;
  persist();
};

const fetchMe = async () => {
  if (!api.getToken()) return;
  const data = await api.me();
  applyUser(data.user);
  isLoggedIn.value = true;
  persist();
};

const updateProfile = async (payload: Partial<typeof user>) => {
  const data = await api.updateProfile(payload);
  applyUser(data.user);
  persist();
};

const logout = async () => {
  if (api.getToken()) {
    await api.logout();
  }
  isLoggedIn.value = false;
  Object.assign(user, {
    id: '',
    nickname: '',
    account: '',
    avatar: '',
    bio: '',
    phone: '',
    email: '',
    following: 0,
    followers: 0,
    likes: 0,
  });
  api.setToken('');
  clearPersist();
};

export const useAuthStore = () => ({
  isLoggedIn,
  user,
  avatarLabel,
  login,
  register,
  fetchMe,
  updateProfile,
  logout,
});
