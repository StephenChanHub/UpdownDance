import { computed, reactive, ref } from 'vue';

const STORAGE_KEY = 'updown_auth';

// ─── Load persisted state ─────────────────────────────────────────────
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
    nickname:  _saved?.nickname  ?? '',
    account:   _saved?.account   ?? '',
    avatar:    _saved?.avatar    ?? '',
    bio:       _saved?.bio       ?? '',
    phone:     _saved?.phone     ?? '',
    email:     _saved?.email     ?? '',
    following: _saved?.following ?? 0,
    followers: _saved?.followers ?? 0,
    likes:     _saved?.likes     ?? 0,
});

// ─── Persist helper ───────────────────────────────────────────────────
const persist = () => {
    try {
        uni.setStorageSync(STORAGE_KEY, JSON.stringify({
            isLoggedIn: isLoggedIn.value,
            ...user,
        }));
    } catch { /* ignore */ }
};

const clearPersist = () => {
    try { uni.removeStorageSync(STORAGE_KEY); } catch { /* ignore */ }
};

// ─── Computed ─────────────────────────────────────────────────────────
const avatarLabel = computed(() => {
    if (!isLoggedIn.value) return '?';
    const src = user.nickname || user.account;
    return src.slice(0, 2).toUpperCase();
});

// ─── Actions ──────────────────────────────────────────────────────────
const login = (payload: { nickname: string; account: string; avatar?: string }) => {
    user.nickname  = payload.nickname;
    user.account   = payload.account || `updown_${payload.nickname.toLowerCase().replace(/\s+/g, '_')}`;
    if (payload.avatar !== undefined) user.avatar = payload.avatar;
    user.following = 0;
    user.followers = 0;
    user.likes     = 0;
    isLoggedIn.value = true;
    persist();
};

const register = (payload: { nickname: string; account: string; phone?: string; email?: string; avatar?: string }) => {
    user.nickname  = payload.nickname;
    user.account   = payload.account;
    user.avatar    = payload.avatar || user.avatar || '';
    user.phone     = payload.phone || '';
    user.email     = payload.email || '';
    user.following = 0;
    user.followers = 0;
    user.likes     = 0;
    isLoggedIn.value = true;
    persist();
};

const updateProfile = (payload: Partial<typeof user>) => {
    Object.assign(user, payload);
    persist();
};

const logout = () => {
    isLoggedIn.value = false;
    Object.assign(user, {
        nickname: '', account: '', avatar: '', bio: '', phone: '',
        email: '', following: 0, followers: 0, likes: 0,
    });
    clearPersist();
};

export const useAuthStore = () => ({
    isLoggedIn,
    user,
    avatarLabel,
    login,
    register,
    updateProfile,
    logout,
});
