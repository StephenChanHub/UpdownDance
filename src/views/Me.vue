<template>
    <view class="me-page">
        <scroll-view class="profile-scroll" scroll-y>
            <view class="profile-header glass-card">
                <view class="base-info">
                    <view class="avatar">SC</view>
                    <view class="name-wrap">
                        <text class="nickname">Stephen Chan</text>
                        <text class="uid">ID: updown_stephen</text>
                        <text class="bio">记录灵感、短视频和日常好物。</text>
                    </view>
                </view>

                <view class="stats-row">
                    <view class="stat-item">
                        <text class="stat-num">128</text>
                        <text class="stat-label">Following</text>
                    </view>
                    <view class="stat-item">
                        <text class="stat-num">9.6k</text>
                        <text class="stat-label">Followers</text>
                    </view>
                    <view class="stat-item">
                        <text class="stat-num">3.2w</text>
                        <text class="stat-label">Likes</text>
                    </view>
                </view>

                <view class="action-row">
                    <view class="primary-btn">
                        <text>Edit Profile</text>
                    </view>
                    <view class="secondary-btn">
                        <text>Share</text>
                    </view>
                </view>
            </view>

            <view class="tab-row">
                <view v-for="tab in tabs" :key="tab" class="tab-item" :class="{ active: activeTab === tab }"
                    @click="activeTab = tab">
                    <text>{{ tab }}</text>
                </view>
            </view>

            <view class="note-grid">
                <view v-for="item in filteredNotes" :key="item.id" class="note-card">
                    <view class="cover">
                        <text class="cover-tag">{{ item.tag }}</text>
                    </view>
                    <text class="note-title">{{ item.title }}</text>
                    <view class="note-meta">
                        <text class="meta-left">{{ item.category }}</text>
                        <text class="meta-right">❤ {{ item.likes }}</text>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup>
import { computed, ref } from 'vue';

const tabs = ['Notes', 'Collects', 'Likes'];
const activeTab = ref('Notes');

const notes = ref([
    { id: 1, title: 'Weekend outfit ideas', likes: '1.2k', tag: 'OOTD', category: 'Notes', group: 'Notes' },
    { id: 2, title: 'Coffee shop check-in', likes: '842', tag: 'Cafe', category: 'Notes', group: 'Notes' },
    { id: 3, title: 'Desk setup 2026', likes: '2.3k', tag: 'Setup', category: 'Digital', group: 'Collects' },
    { id: 4, title: 'Travel camera preset', likes: '517', tag: 'Preset', category: 'Photo', group: 'Collects' },
    { id: 5, title: 'Sunset timelapse', likes: '3.4k', tag: 'Video', category: 'Short', group: 'Likes' },
    { id: 6, title: 'Daily skincare flow', likes: '1.8k', tag: 'Care', category: 'Lifestyle', group: 'Likes' },
]);

const filteredNotes = computed(() => {
    return notes.value.filter((item) => item.group === activeTab.value);
});
</script>

<style scoped>
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

.glass-card {
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(26px) saturate(145%);
    -webkit-backdrop-filter: blur(26px) saturate(145%);
    border: 1px solid rgba(255, 255, 255, 0.56);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}

.profile-header {
    border-radius: 24px;
    padding: 14px;
}

.base-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #007aff, #53b3ff);
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

.note-grid {
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    padding-bottom: 10px;
}

.note-card {
    background: #fff;
    border-radius: 14px;
    padding: 10px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

.cover {
    height: 102px;
    border-radius: 10px;
    background: linear-gradient(135deg, #e9f2ff, #dbe9ff);
    display: flex;
    align-items: center;
    justify-content: center;
}

.cover-tag {
    font-size: 12px;
    font-weight: 700;
    color: #2f5ea8;
}

.note-title {
    display: block;
    margin-top: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #1c1c1e;
    line-height: 1.3;
}

.note-meta {
    margin-top: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.meta-left {
    font-size: 11px;
    color: #8e8e93;
}

.meta-right {
    font-size: 11px;
    color: #ff3b30;
    font-weight: 700;
}
</style>