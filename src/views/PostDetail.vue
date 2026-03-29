<template>
  <view v-if="post" class="detail-page">

    <!-- Back button — fixed top-left -->
    <view class="back-btn" @click="handleBack">
      <text class="back-icon">‹</text>
    </view>

    <scroll-view class="detail-scroll" scroll-y>

      <!-- Hero image -->
      <view class="hero-wrap">
        <image v-if="post.image" class="hero-image" :src="post.image" mode="aspectFill" />
        <view v-else class="hero-placeholder">
          <text class="hero-placeholder-icon"></text>
        </view>
      </view>

      <!-- Content card -->
      <view class="content-card glass-card">
        <view class="meta-row">
          <view class="author-avatar">
            <text class="author-avatar-text">{{ avatarLabel }}</text>
          </view>
          <view class="author-info">
            <text class="author-name">{{ post.username || 'Anonymous' }}</text>
            <text class="post-date">{{ formattedDate }}</text>
          </view>
          <view class="meta-actions">
            <view class="follow-btn" :class="{ following: isFollowing }" @click="toggleFollow">
              <text class="follow-btn-text">{{ isFollowing ? 'Following' : 'Follow' }}</text>
            </view>
            <view class="more-btn" @click="handleMore">
              <image class="more-icon" :src="moreIcon" mode="aspectFit" />
            </view>
          </view>
        </view>

        <text class="post-title">{{ post.title }}</text>
        <text class="post-content">{{ post.content || 'No content yet.' }}</text>

        <!-- Comments section -->
        <view class="comments-section">
          <text class="comments-heading">Comments</text>
          <view v-if="comments.length === 0" class="comments-empty">
            <text class="comments-empty-text">Be the first to comment.</text>
          </view>
          <view v-for="(c, i) in comments" :key="i" class="comment-item">
            <view class="comment-avatar">
              <text class="comment-avatar-text">{{ c.avatar }}</text>
            </view>
            <view class="comment-body">
              <text class="comment-name">{{ c.name }}</text>
              <text class="comment-text">{{ c.text }}</text>
            </view>
          </view>
        </view>

        <!-- Bottom spacer so content clears the fixed bar -->
        <view class="bottom-spacer" />
      </view>
    </scroll-view>

    <!-- Fixed bottom bar -->
    <view class="bottom-bar glass-card">
      <view class="bottom-bar-inner">
        <!-- Like -->
        <view class="bar-icon-btn" @click="toggleLike">
          <text class="bar-icon" :class="{ liked: isLiked }">{{ isLiked ? '♥' : '♡' }}</text>
          <text class="bar-icon-label">{{ likeCount }}</text>
        </view>
        <!-- Share -->
        <view class="bar-icon-btn" @click="handleShare">
          <text class="bar-icon">↗</text>
          <text class="bar-icon-label">Share</text>
        </view>
        <!-- Comment input -->
        <view class="comment-input-wrap">
          <input
            class="comment-input"
            v-model="commentDraft"
            placeholder="Add a comment…"
            placeholder-style="color:#b0b0b8"
            confirm-type="send"
            @confirm="submitComment"
          />
        </view>
        <!-- Send -->
        <view class="send-btn" :class="{ active: commentDraft.trim() }" @click="submitComment">
          <text class="send-icon">↑</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue';
import { usePostStore } from '../stores/postStore';
import { useAppViewStore } from '../stores/appViewStore';
import moreIcon from '../../public/img/more.png';

const { selectedPost } = usePostStore();
const { closePostDetail } = useAppViewStore();

const post = computed(() => selectedPost.value);

const avatarLabel = computed(() => {
  const name = post.value?.username || '';
  return name.replace('@', '').slice(0, 2).toUpperCase() || '?';
});

const formattedDate = computed(() => {
  if (!post.value?.createdAt) return '';
  const d = new Date(post.value.createdAt);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
});

const isFollowing = ref(false);
const toggleFollow = () => { isFollowing.value = !isFollowing.value; };

const isLiked    = ref(false);
const likeCount  = ref(128);
const toggleLike = () => {
  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;
};

const comments     = ref([]);
const commentDraft = ref('');

const submitComment = () => {
  const text = commentDraft.value.trim();
  if (!text) return;
  comments.value.push({
    avatar: avatarLabel.value,
    name:   'You',
    text,
  });
  commentDraft.value = '';
};

const handleShare = () => {
  uni.showToast({ title: 'Link copied!', icon: 'none' });
};

const handleMore = () => {
  uni.showActionSheet({
    itemList: ['Report', 'Not Interested', 'Copy Link'],
    success: ({ tapIndex }) => {
      const actions = ['Report', 'Not Interested', 'Copy Link'];
      uni.showToast({ title: actions[tapIndex], icon: 'none' });
    },
  });
};

const handleBack = () => closePostDetail();

// edit / delete intentionally removed
</script>

<style scoped>
/* ── Page ────────────────────────────────────────────────────────────── */
.detail-page {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(180deg, #f0f2f8 0%, #e8ecf4 100%);
  overflow: hidden;
}

/* ── Back button ─────────────────────────────────────────────────────── */
.back-btn {
  position: fixed;
  top: calc(18px + env(safe-area-inset-top));
  left: 18px;
  z-index: 100;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 28px;
  font-weight: 300;
  color: #1c1c1e;
  line-height: 1;
  margin-top: -2px;
}

/* ── Scroll ──────────────────────────────────────────────────────────── */
.detail-scroll {
  width: 100%;
  height: 100%;
}

/* ── Hero image ──────────────────────────────────────────────────────── */
.hero-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  display: block;
}

.hero-placeholder {
  width: 100%;
  height: 100%;
  background: #e5e9f2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-placeholder-icon {
  font-size: 52px;
  opacity: 0.4;
}

/* ── Content card ────────────────────────────────────────────────────── */
.glass-card {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(28px) saturate(150%);
  -webkit-backdrop-filter: blur(28px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.62);
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.06);
}

.content-card {
  margin-top: -24px;
  border-radius: 28px 28px 0 0;
  padding: 24px 20px 0;
  box-sizing: border-box;
  min-height: 280px;
}

/* ── Author row ──────────────────────────────────────────────────────── */
.meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007aff, #53b3ff);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.author-avatar-text {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
}

.author-name {
  font-size: 15px;
  font-weight: 700;
  color: #1c1c1e;
}

.post-date {
  font-size: 12px;
  color: #8e8e93;
}

/* ── Meta actions ────────────────────────────────────────────────────── */
.meta-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.follow-btn {
  height: 30px;
  padding: 0 14px;
  border-radius: 999px;
  background: #007aff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.follow-btn.following {
  background: rgba(0, 122, 255, 0.12);
}

.follow-btn-text {
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}

.follow-btn.following .follow-btn-text {
  color: #007aff;
}

.more-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
}

.more-icon {
  width: 18px;
  height: 18px;
  opacity: 0.6;
}

/* ── Post body ───────────────────────────────────────────────────────── */
.post-title {
  display: block;
  font-size: 24px;
  font-weight: 800;
  color: #1c1c1e;
  line-height: 1.25;
  margin-bottom: 12px;
}

.post-content {
  display: block;
  font-size: 15px;
  line-height: 1.65;
  color: #3a3a3c;
}

/* ── Comments section ────────────────────────────────────────────────── */
.comments-section {
  margin-top: 28px;
}

.comments-heading {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #1c1c1e;
  margin-bottom: 14px;
}

.comments-empty {
  padding: 20px 0;
  text-align: center;
}

.comments-empty-text {
  font-size: 13px;
  color: #b0b0b8;
}

.comment-item {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.comment-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5e5ce6, #9b9af0);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.comment-avatar-text {
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}

.comment-body {
  flex: 1;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 14px;
  padding: 8px 12px;
}

.comment-name {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #1c1c1e;
  margin-bottom: 3px;
}

.comment-text {
  display: block;
  font-size: 13px;
  line-height: 1.45;
  color: #3a3a3c;
}

.bottom-spacer {
  height: 80px;
}

/* ── Bottom bar ──────────────────────────────────────────────────────── */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
  box-sizing: border-box;
  border-radius: 24px 24px 0 0;
}

.bottom-bar-inner {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-icon-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.bar-icon {
  font-size: 22px;
  color: #3a3a3c;
  line-height: 1;
}

.bar-icon.liked {
  color: #ff3b30;
}

.bar-icon-label {
  font-size: 10px;
  font-weight: 600;
  color: #8e8e93;
}

.comment-input-wrap {
  flex: 1;
  height: 38px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 999px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.comment-input {
  width: 100%;
  font-size: 14px;
  color: #1c1c1e;
  background: transparent;
}

.send-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 122, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
}

.send-btn.active {
  background: #007aff;
}

.send-btn.active .send-icon {
  color: #fff;
}

.send-icon {
  font-size: 18px;
  font-weight: 700;
  color: rgba(0, 122, 255, 0.4);
}
</style>
