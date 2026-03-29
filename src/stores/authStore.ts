import { computed, reactive, ref } from 'vue';

const isLoggedIn = ref(false);

const user = reactive({
    nickname:  '',
    account:   '',
    bio:       '',
    phone:     '',
    email:     '',
    following: 0,
    followers: 0,
    likes:     0,
});

const avatarLabel = computed(() => {
    if (!isLoggedIn.value) return '?';
    const src = user.nickname || user.account;
    return src.slice(0, 2).toUpperCase();
});

const login = (payload: { nickname: string; account: string }) => {
    user.nickname  = payload.nickname;
    user.account   = payload.account || `updown_${payload.nickname.toLowerCase().replace(/\s+/g, '_')}`;
    user.following = 0;
    user.followers = 0;
    user.likes     = 0;
    isLoggedIn.value = true;
};

const register = (payload: { nickname: string; account: string; phone?: string; email?: string }) => {
    user.nickname  = payload.nickname;
    user.account   = payload.account;
    user.phone     = payload.phone || '';
    user.email     = payload.email || '';
    user.following = 0;
    user.followers = 0;
    user.likes     = 0;
    isLoggedIn.value = true;
};

const updateProfile = (payload: Partial<typeof user>) => {
    Object.assign(user, payload);
};

const logout = () => {
    isLoggedIn.value = false;
    Object.assign(user, {
        nickname: '', account: '', bio: '', phone: '',
        email: '', following: 0, followers: 0, likes: 0,
    });
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
