<template>
    <view class="me-page">
        <scroll-view class="profile-scroll" scroll-y>

            <!-- Profile header -->
            <view class="profile-header glass-card">
                <view class="base-info">
                    <view class="avatar" @click="openModal('edit')">
                        <image v-if="isLoggedIn && user.avatar" class="avatar-img" :src="user.avatar"
                            mode="aspectFill" />
                        <text v-else class="avatar-text">{{ avatarLabel }}</text>
                    </view>
                    <view class="name-wrap">
                        <text class="nickname">{{ isLoggedIn ? user.nickname : 'Guest' }}</text>
                        <text class="uid">{{ isLoggedIn ? `ID: ${user.account}` : 'Not logged in' }}</text>
                        <text v-if="isLoggedIn && user.bio" class="bio">{{ user.bio }}</text>
                    </view>
                    <!-- Login / Logout button -->
                    <view class="auth-btn" @click="isLoggedIn ? confirmLogout() : openModal('login')">
                        <text class="auth-btn-text">{{ isLoggedIn ? 'Logout' : 'Login' }}</text>
                    </view>
                </view>

                <view class="stats-row">
                    <view class="stat-item">
                        <text class="stat-num">{{ isLoggedIn ? user.following : '—' }}</text>
                        <text class="stat-label">Following</text>
                    </view>
                    <view class="stat-item">
                        <text class="stat-num">{{ isLoggedIn ? user.followers : '—' }}</text>
                        <text class="stat-label">Followers</text>
                    </view>
                    <view class="stat-item">
                        <text class="stat-num">{{ isLoggedIn ? user.likes : '—' }}</text>
                        <text class="stat-label">Likes</text>
                    </view>
                </view>

                <view v-if="isLoggedIn" class="action-row">
                    <view class="primary-btn" @click="openModal('edit')">
                        <text>Edit Profile</text>
                    </view>
                    <view class="secondary-btn"><text>Share</text></view>
                </view>
                <view v-else class="action-row">
                    <view class="primary-btn" @click="openModal('login')">
                        <text>Sign In</text>
                    </view>
                    <view class="secondary-btn" @click="openModal('register')">
                        <text>Register</text>
                    </view>
                </view>
            </view>

            <!-- Tabs -->
            <view class="tab-row">
                <view v-for="tab in tabs" :key="tab" class="tab-item" :class="{ active: activeTab === tab }"
                    @click="activeTab = tab">
                    <text>{{ tab }}</text>
                </view>
            </view>

            <!-- Empty / not logged in -->
            <view v-if="!isLoggedIn" class="empty-state">
                <text class="empty-icon">☁</text>
                <text class="empty-title">Nothing here yet</text>
                <text class="empty-tip">Sign in to view your posts, collections and likes.</text>
            </view>

            <!-- Notes feed (synced from published posts) -->
            <view v-else-if="activeTab === 'Notes'" class="notes-feed-container">
                <view v-if="feedRows.length === 0" class="empty-state">
                    <text class="empty-icon">✦</text>
                    <text class="empty-title">No posts yet</text>
                </view>
                <template v-else v-for="(row, ri) in feedRows" :key="ri">
                    <view v-if="row.type === 'wide'" class="feed-wide">
                        <MainPostCard :post="row.post" @open="handleOpenPost" />
                    </view>
                    <view v-else class="feed-pair">
                        <MainPostCard :post="row.posts[0]" @open="handleOpenPost" />
                        <MainPostCard v-if="row.posts[1]" :post="row.posts[1]" @open="handleOpenPost" />
                        <view v-else class="feed-pair-empty" />
                    </view>
                </template>
            </view>

            <!-- Placeholder for Collects / Likes -->
            <view v-else class="empty-state">
                <text class="empty-icon">✦</text>
                <text class="empty-title">No content yet</text>
            </view>

        </scroll-view>
    </view>

    <!-- Auth Modal -->
    <view v-if="modalVisible" class="modal-backdrop" @click.self="closeModal">
        <view class="modal-sheet">
            <view class="modal-header">
                <text class="modal-title">{{
                    modalMode === 'login' ? 'Sign In' : modalMode ===
                        'register' ? 'Create Account' : 'Edit Profile' }}</text>
                <view class="modal-close" @click="closeModal"><text>X</text></view>
            </view>

            <!-- Avatar row -->
            <view class="field-avatar-row" @click="pickAvatar">
                <view class="field-avatar-preview">
                    <image v-if="form.avatar" class="field-avatar-img" :src="form.avatar" mode="aspectFill" />
                    <text v-else class="field-avatar-text">{{ formAvatarLabel }}</text>
                </view>
                <view class="field-avatar-hint">
                    <text class="fah-title">Profile Photo</text>
                    <text class="fah-sub">Tap to upload and crop circle</text>
                </view>
            </view>

            <!-- Name -->
            <view class="field-group">
                <text class="field-label">Name</text>
                <input class="field-input" v-model="form.nickname" placeholder="Display name" maxlength="9"
                    placeholder-style="color:#b0b0b8" />
            </view>

            <!-- Account ID (register / edit only) -->
            <view v-if="modalMode !== 'login'" class="field-group">
                <text class="field-label">Account ID</text>
                <input class="field-input" v-model="form.account" placeholder="e.g. updown_stephen" maxlength="9"
                    placeholder-style="color:#b0b0b8" />
            </view>

            <!-- Password (login / register only) -->
            <view v-if="modalMode !== 'edit'" class="field-group">
                <text class="field-label">Password</text>
                <input class="field-input" v-model="form.password" password placeholder="Enter password" maxlength="9"
                    placeholder-style="color:#b0b0b8" />
            </view>

            <!-- Phone (register / edit) -->
            <view v-if="modalMode !== 'login'" class="field-group">
                <text class="field-label">Phone Number</text>
                <input class="field-input" v-model="form.phone" type="tel" placeholder="+1 234 567 8900" maxlength="20"
                    placeholder-style="color:#b0b0b8" />
            </view>

            <!-- Email (register / edit) -->
            <view v-if="modalMode !== 'login'" class="field-group">
                <text class="field-label">Email</text>
                <input class="field-input" v-model="form.email" type="email" placeholder="you@example.com"
                    maxlength="64" placeholder-style="color:#b0b0b8" />
            </view>

            <!-- Actions -->
            <view class="modal-actions">
                <view class="modal-btn cancel-btn" @click="closeModal"><text>Cancel</text></view>
                <view class="modal-btn submit-btn" @click="handleSubmit">
                    <text>{{ modalMode === 'login' ? 'Sign In' : modalMode === 'register' ? 'Register' : 'Save'
                    }}</text>
                </view>
            </view>

            <!-- Switch mode -->
            <view v-if="modalMode === 'login'" class="modal-switch">
                <text class="switch-text">No account? </text>
                <text class="switch-link" @click="modalMode = 'register'">Create one</text>
            </view>
            <view v-if="modalMode === 'register'" class="modal-switch">
                <text class="switch-text">Already have one? </text>
                <text class="switch-link" @click="modalMode = 'login'">Sign in</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { usePostStore } from '../stores/postStore';
import { useAppViewStore } from '../stores/appViewStore';
import MainPostCard from '../components/MainPostCard.vue';

const { isLoggedIn, user, avatarLabel, login, register, updateProfile, logout } = useAuthStore();
const { posts, selectPost } = usePostStore();
const { openPostDetail } = useAppViewStore();

// ─── Tabs & content ───────────────────────────────────────────────────────────
const tabs = ['Notes', 'Collects', 'Likes'];
const activeTab = ref('Notes');

const notesPosts = computed(() => {
    if (!isLoggedIn.value) return [];
    const identity = [user.nickname, user.account].filter(Boolean);
    return posts.value.filter((p) => identity.includes(p.username));
});

const feedRows = computed(() => {
    if (activeTab.value !== 'Notes') return [];

    const rows = [];
    const narrow = [];

    const flushNarrow = () => {
        while (narrow.length > 0) {
            rows.push({ type: 'pair', posts: narrow.splice(0, 2) });
        }
    };

    for (const post of notesPosts.value) {
        if ((post.ratio || '9:16') === '16:9') {
            flushNarrow();
            rows.push({ type: 'wide', post });
        } else {
            narrow.push(post);
        }
    }

    flushNarrow();
    return rows;
});

const handleOpenPost = (id) => {
    selectPost(id);
    openPostDetail();
};

// ─── Modal ────────────────────────────────────────────────────────────────────
const modalVisible = ref(false);
const modalMode = ref('login'); // 'login' | 'register' | 'edit'

const form = reactive({
    nickname: '',
    account: '',
    password: '',
    phone: '',
    email: '',
    avatar: '',
});

const CN_NAME_MAX = 9;
const ACCOUNT_MAX = 9;
const PASSWORD_MAX = 9;

const normalizeName = (v) => (v || '').trim().slice(0, CN_NAME_MAX);
const normalizeShort = (v, max) => (v || '').trim().slice(0, max);
const phoneRegex = /^\+?[0-9\s\-()]{6,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const formAvatarLabel = computed(() =>
    form.nickname ? form.nickname.slice(0, 2).toUpperCase() : '?'
);

const pickAvatar = () => {
    const uniAny = uni as any;
    uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: ({ tempFilePaths }) => {
            const path = tempFilePaths?.[0];
            if (!path) return;

            // 尝试调用系统裁剪（支持时裁 1:1），不支持则直接使用原图
            if (typeof uniAny.cropImage === 'function') {
                uniAny.cropImage({
                    src: path,
                    cropScale: '1:1',
                    success: ({ tempFilePath }) => {
                        form.avatar = tempFilePath || path;
                    },
                    fail: () => { form.avatar = path; },
                });
            } else {
                form.avatar = path;
            }
        },
    });
};

const openModal = (mode) => {
    modalMode.value = mode;
    if (mode === 'edit') {
        Object.assign(form, {
            nickname: user.nickname,
            account: user.account,
            phone: user.phone,
            email: user.email,
            avatar: user.avatar || '',
            password: '',
        });
    } else {
        Object.assign(form, { nickname: '', account: '', password: '', phone: '', email: '', avatar: '' });
    }
    modalVisible.value = true;
};

const closeModal = () => { modalVisible.value = false; };

const handleSubmit = () => {
    const mode = modalMode.value;

    form.nickname = normalizeName(form.nickname);
    form.account = normalizeShort(form.account, ACCOUNT_MAX);
    form.password = normalizeShort(form.password, PASSWORD_MAX);
    form.phone = (form.phone || '').trim();
    form.email = (form.email || '').trim();

    if (form.nickname && form.nickname.length > CN_NAME_MAX) {
        uni.showToast({ title: `Name 不能超过 ${CN_NAME_MAX} 个字符`, icon: 'none' });
        return;
    }

    if (form.account && form.account.length > ACCOUNT_MAX) {
        uni.showToast({ title: `Account 不能超过 ${ACCOUNT_MAX} 个字符`, icon: 'none' });
        return;
    }

    if (form.password && form.password.length > PASSWORD_MAX) {
        uni.showToast({ title: `Password 不能超过 ${PASSWORD_MAX} 个字符`, icon: 'none' });
        return;
    }

    if (form.phone && !phoneRegex.test(form.phone)) {
        uni.showToast({ title: 'Phone number 格式不正确', icon: 'none' });
        return;
    }

    if (form.email && !emailRegex.test(form.email)) {
        uni.showToast({ title: 'Email 格式不正确', icon: 'none' });
        return;
    }

    if (mode === 'login') {
        if (!form.nickname || !form.password) {
            uni.showToast({ title: 'Please fill in name & password', icon: 'none' });
            return;
        }
        login({ nickname: form.nickname, account: form.account, avatar: form.avatar });
        closeModal();
        uni.showToast({ title: 'Welcome back!', icon: 'success' });
        return;
    }

    if (mode === 'register') {
        if (!form.nickname || !form.account || !form.password) {
            uni.showToast({ title: 'Name, Account ID and Password are required', icon: 'none' });
            return;
        }
        register({
            nickname: form.nickname,
            account: form.account,
            phone: form.phone,
            email: form.email,
            avatar: form.avatar,
        });
        closeModal();
        uni.showToast({ title: 'Account created!', icon: 'success' });
        return;
    }

    if (mode === 'edit') {
        if (!form.nickname) {
            uni.showToast({ title: 'Name cannot be empty', icon: 'none' });
            return;
        }
        updateProfile({
            nickname: form.nickname,
            account: form.account || user.account,
            phone: form.phone,
            email: form.email,
            avatar: form.avatar,
        });
        closeModal();
        uni.showToast({ title: 'Profile updated', icon: 'success' });
    }
};

const confirmLogout = () => {
    uni.showModal({
        title: 'Log out?',
        content: 'You will be signed out of your account.',
        success: ({ confirm }) => {
            if (!confirm) return;
            logout();
            uni.showToast({ title: 'Logged out', icon: 'none' });
        },
    });
};
</script>

<style scoped>
/* ── Page ───────────────────────────────────────────────────────────── */
.me-page {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: linear-gradient(180deg, #f6f7fb 0%, #eceff6 100%);
}

.profile-scroll {
    height: 100%;
    box-sizing: border-box;
    padding: 76px 14px 18px;
}

/* ── Glass card ─────────────────────────────────────────────────────── */
.glass-card {
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(6px) saturate(145%);
    -webkit-backdrop-filter: blur(6px) saturate(145%);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}

.profile-header {
    border-radius: 24px;
    padding: 14px;
}

/* ── Base info ──────────────────────────────────────────────────────── */
.base-info {

    display: flex;
    align-items: center;
    gap: 12px;
}

.avatar {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #007aff, #53b3ff);
}

.avatar-img {
    width: 100%;
    height: 100%;
    display: block;
}

.avatar-text {
    color: #fff;
    font-size: 20px;
    font-weight: 700;
}

.name-wrap {
    flex: 1;
    min-width: 0;
}

.nickname {
    display: block;
    font-size: 20px;
    font-weight: 700;
    color: #1c1c1e;
}

.uid {
    display: block;
    margin-top: 2px;
    font-size: 12px;
    color: #8e8e93;
}

.bio {
    display: block;
    margin-top: 6px;
    font-size: 13px;
    color: #3a3a3c;
}

/* ── Auth button ─────────────────────────────────────────────────────── */
.auth-btn {
    flex-shrink: 0;
    height: 32px;
    padding: 0 14px;
    border-radius: 999px;
    background: rgba(0, 122, 255, 0.1);
    border: 1px solid rgba(0, 122, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
}

.auth-btn-text {
    font-size: 12px;
    font-weight: 700;
    color: #007aff;
}

/* ── Stats ──────────────────────────────────────────────────────────── */
.stats-row {
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
}

.stat-item {
    flex: 1;
    text-align: center;
}

.stat-num {
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: #1c1c1e;
}

.stat-label {
    display: block;
    margin-top: 2px;
    font-size: 11px;
    color: #8e8e93;
}

/* ── Action row ─────────────────────────────────────────────────────── */
.action-row {
    margin-top: 14px;
    display: flex;
    gap: 8px;
}

.primary-btn,
.secondary-btn {
    flex: 1;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
}

.primary-btn {
    background: #007aff;
    color: #fff;
}

.secondary-btn {
    background: rgba(0, 122, 255, 0.12);
    color: #007aff;
}

/* ── Tabs ────────────────────────────────────────────────────────────── */
.tab-row {
    margin-top: 12px;
    display: flex;
    gap: 8px;
}

.tab-item {
    flex: 1;
    text-align: center;
    padding: 8px 0;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    color: #6d6d72;
    background: rgba(255, 255, 255, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.56);
}

.tab-item.active {
    color: #fff;
    background: #007aff;
    border-color: #007aff;
}

/* ── Notes feed (Explore style) ─────────────────────────────────────── */
.notes-feed-container {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    padding-bottom: 10px;
    box-sizing: border-box;
}

.feed-wide {
    width: 100%;
}

.feed-pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
}

.feed-pair-empty {
    /* placeholder for odd item count */
}

/* ── Empty state ─────────────────────────────────────────────────────── */
.empty-state {
    grid-column: 1 / -1;
    padding: 60px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.empty-icon {
    font-size: 44px;
    opacity: 0.35;
}

.empty-title {
    font-size: 16px;
    font-weight: 700;
    color: #3a3a3c;
}

.empty-tip {
    font-size: 13px;
    color: #8e8e93;
    text-align: center;
    line-height: 1.5;
    max-width: 240px;
}

/* ── Modal backdrop ──────────────────────────────────────────────────── */
.modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 2000;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

/* ── Modal sheet ─────────────────────────────────────────────────────── */
.modal-sheet {
    width: 100%;
    max-height: 88vh;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(30px) saturate(160%);
    -webkit-backdrop-filter: blur(30px) saturate(160%);
    border-radius: 28px 28px 0 0;
    padding: 24px 20px calc(28px + env(safe-area-inset-bottom));
    box-sizing: border-box;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.modal-title {
    font-size: 20px;
    font-weight: 700;
    color: #1c1c1e;
}

.modal-close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.07);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #3a3a3c;
}

/* ── Avatar row ─────────────────────────────────────────────────────── */
.field-avatar-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
}

.field-avatar-preview {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    overflow: hidden;
    background: linear-gradient(135deg, #007aff, #53b3ff);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.field-avatar-img {
    width: 100%;
    height: 100%;
    display: block;
}

.field-avatar-text {
    font-size: 22px;
    font-weight: 700;
    color: #fff;
}

.field-avatar-hint {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.fah-title {
    font-size: 15px;
    font-weight: 600;
    color: #1c1c1e;
}

.fah-sub {
    font-size: 12px;
    color: #8e8e93;
}

/* ── Fields ──────────────────────────────────────────────────────────── */
.field-group {
    margin-bottom: 14px;
}

.field-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #8e8e93;
    margin-bottom: 6px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
}

.field-input {
    width: 100%;
    height: 46px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.08);
    padding: 0 14px;
    font-size: 15px;
    color: #1c1c1e;
    box-sizing: border-box;
}

/* ── Modal actions ───────────────────────────────────────────────────── */
.modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 24px;
}

.modal-btn {
    flex: 1;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 700;
}

.cancel-btn {
    background: rgba(0, 0, 0, 0.06);
    color: #3a3a3c;
}

.submit-btn {
    background: #007aff;
    color: #fff;
    box-shadow: 0 6px 18px rgba(0, 122, 255, 0.35);
}

/* ── Switch mode ─────────────────────────────────────────────────────── */
.modal-switch {
    margin-top: 16px;
    text-align: center;
}

.switch-text {
    font-size: 13px;
    color: #8e8e93;
}

.switch-link {
    font-size: 13px;
    font-weight: 700;
    color: #007aff;
}
</style>