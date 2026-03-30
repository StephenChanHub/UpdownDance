<template>
  <view v-if="post" class="detail-page">

    <!-- Back button — fixed top-left -->
    <view class="back-btn" @click="handleBack">
      <text class="back-icon">‹</text>
    </view>

    <!-- Hero images — fixed swiper, left/right to switch -->
    <view class="hero-wrap" :style="{ height: `${heroHeight}px` }">
      <swiper v-if="postImages.length" class="hero-swiper" circular :indicator-dots="postImages.length > 1"
        indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#ffffff"
        @change="currentImageIndex = $event.detail.current">
        <swiper-item v-for="(img, i) in postImages" :key="i" @click="previewImage(i)">
          <image class="hero-image" :src="img" mode="aspectFill" />
        </swiper-item>
      </swiper>
      <view v-else class="hero-placeholder">
        <text class="hero-placeholder-icon">🖼️</text>
      </view>
      <!-- image count badge -->
      <view v-if="postImages.length > 1" class="img-count-badge">
        <text class="img-count-text">{{ currentImageIndex + 1 }}/{{ postImages.length }}</text>
      </view>
    </view>

    <!-- Draggable content card -->
    <view class="content-card glass-card" :style="{ transform: `translateY(${cardY}px)` }">
      <!-- Card handle -->
      <view class="card-handle" @click="toggleCard" />

      <!-- Author row -->
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

      <!-- Comments — independent scroll once card is pinned -->
      <view class="comments-section">
        <text class="comments-heading">Comments</text>
        <scroll-view class="comments-scroll" scroll-y :style="{ height: commentsScrollHeight }">
          <view v-if="comments.length === 0" class="comments-empty">
            <text class="comments-empty-text">Be the first to comment.</text>
          </view>
          <view v-for="(c, ci) in comments" :key="ci" class="comment-item">
            <view class="comment-avatar">
              <text class="comment-avatar-text">{{ c.avatar }}</text>
            </view>
            <view class="comment-body">
              <text class="comment-name">{{ c.name }}</text>
              <text class="comment-text">{{ c.text }}</text>
              <view class="comment-actions">
                <text class="reply-btn" @click="startReply(ci, c.name)">Reply</text>
              </view>
              <!-- Replies -->
              <view v-if="c.replies && c.replies.length" class="replies-list">
                <view v-for="(r, ri) in c.replies" :key="ri" class="reply-item">
                  <view class="reply-avatar">
                    <text class="reply-avatar-text">{{ r.avatar }}</text>
                  </view>
                  <view class="reply-body">
                    <text class="comment-name">{{ r.name }}</text>
                    <text class="comment-text">{{ r.text }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="comments-bottom-spacer" />
        </scroll-view>
      </view>
    </view>

    <!-- Fixed bottom bar -->
    <view class="bottom-bar glass-card">
      <!-- Reply hint -->
      <view v-if="replyTarget" class="reply-hint">
        <text class="reply-hint-text">Replying to {{ replyTarget.name }}</text>
        <text class="reply-cancel" @click="cancelReply">✕</text>
      </view>
      <view class="bottom-bar-inner">
        <view class="bar-icon-btn" @click="toggleLike">
          <text class="bar-icon" :class="{ liked: isLiked }">{{ isLiked ? '♥' : '♡' }}</text>
          <text class="bar-icon-label">{{ likeCount }}</text>
        </view>
        <view class="bar-icon-btn" @click="handleShare">
          <text class="bar-icon">↗</text>
          <text class="bar-icon-label">Share</text>
        </view>
        <view class="comment-input-wrap">
          <input class="comment-input" v-model="commentDraft"
            :placeholder="replyTarget ? `Reply to ${replyTarget.name}…` : 'Add a comment…'"
            placeholder-style="color:#b0b0b8" confirm-type="send" @confirm="submitComment" />
        </view>
        <view class="send-btn" :class="{ active: commentDraft.trim() }" @click="submitComment">
          <text class="send-icon">↑</text>
        </view>
      </view>
    </view>

  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { usePostStore } from '../stores/postStore';
import { useAppViewStore } from '../stores/appViewStore';
import moreIcon from '../../public/img/more.png';

const { selectedPost } = usePostStore();
const { closePostDetail } = useAppViewStore();

const post = computed(() => selectedPost.value);

const postImages = computed(() => {
  if (!post.value) return [];
  return post.value.images?.length ? post.value.images : (post.value.image ? [post.value.image] : []);
});

const screenW = ref(390);

// Hero area keeps physical position fixed; height follows first image ratio
const heroHeight = computed(() => {
  const ratio = post.value?.ratio || '9:16';
  const ratioMap = { '9:16': 16 / 9, '16:9': 9 / 16, '1:1': 1 };
  const hByRatio = screenW.value * (ratioMap[ratio] || 16 / 9);
  return Math.max(220, Math.min(hByRatio, screenW.value * 1.45));
});

const currentImageIndex = ref(0);

const previewImage = (index) => {
  uni.previewImage({
    current: postImages.value[index],
    urls: postImages.value,
  });
};

const avatarLabel = computed(() => {
  const name = post.value?.username || '';
  return name.replace('@', '').slice(0, 2).toUpperCase() || '?';
});

const formattedDate = computed(() => {
  if (!post.value?.createdAt) return '';
  const d = new Date(post.value.createdAt);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
});

// ─── Card drag logic ──────────────────────────────────────────────────
// cardY: translateY of the card. 0 = initial position (peeking from bottom).
// minY:  highest the card can go (pinned just below back-btn).
// maxY:  lowest resting position (initial peek).

const screenH = ref(750);   // updated on mount
const safeTop = ref(44);    // status bar + back-btn area
const BACK_BTN_H = 40;
const BACK_BTN_TOP = 10;
const BOTTOM_BAR_H = 70;

const minY = computed(() => safeTop.value + BACK_BTN_TOP + BACK_BTN_H + 2);
const maxY = computed(() => Math.max(minY.value + 20, heroHeight.value + 100));
const cardY = ref(0);
const isPinned = ref(false);

// Height available for the comments scroll area — extends to screen bottom
const commentsScrollHeight = computed(() => {
  const safeBottom = uni.getSystemInfoSync()?.safeAreaInsets?.bottom ?? 0;
  const bottomBarH = BOTTOM_BAR_H + safeBottom;
  const cardTop = isPinned.value ? minY.value : cardY.value;
  const headerH = 260; // approx: handle + meta-row + title + content + comments-heading
  const avail = screenH.value - cardTop - headerH - bottomBarH;
  return `${Math.max(avail, 80)}px`;
});

onMounted(() => {
  const info = uni.getSystemInfoSync();
  screenH.value = info.windowHeight || 750;
  screenW.value = info.windowWidth || 390;
  safeTop.value = (info.safeAreaInsets?.top ?? info.statusBarHeight ?? 44);
  cardY.value = maxY.value;
});

const toggleCard = () => {
  if (isPinned.value) {
    cardY.value = maxY.value;
    isPinned.value = false;
  } else {
    cardY.value = minY.value;
    isPinned.value = true;
  }
};

// ─── Actions ─────────────────────────────────────────────────────────
const isFollowing = ref(false);
const toggleFollow = () => { isFollowing.value = !isFollowing.value; };

const isLiked = ref(false);
const likeCount = ref(128);
const toggleLike = () => {
  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;
};

const comments = ref([]);
const commentDraft = ref('');
const replyTarget = ref(null); // { commentIndex, name }

const submitComment = () => {
  const text = commentDraft.value.trim();
  if (!text) return;
  if (replyTarget.value !== null) {
    // Add reply to parent comment
    const parent = comments.value[replyTarget.value.commentIndex];
    if (parent) {
      if (!parent.replies) parent.replies = [];
      parent.replies.push({ avatar: avatarLabel.value, name: 'You', text });
    }
    replyTarget.value = null;
  } else {
    comments.value.push({ avatar: avatarLabel.value, name: 'You', text, replies: [] });
  }
  commentDraft.value = '';
};

const startReply = (commentIndex, name) => {
  replyTarget.value = { commentIndex, name };
  commentDraft.value = '';
};

const cancelReply = () => {
  replyTarget.value = null;
  commentDraft.value = '';
};

const handleShare = () => uni.showToast({ title: 'Link copied!', icon: 'none' });

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
</script>

<style scoped>
/* ── Page ────────────────────────────────────────────────────────────── */
.detail-page {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #000;
}

/* ── Back button ─────────────────────────────────────────────────────── */
.back-btn {
  position: fixed;
  top: calc(10px + env(safe-area-inset-top));
  left: 15px;
  z-index: 200;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px) saturate(150%);
  -webkit-backdrop-filter: blur(10px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 28px;
  font-weight: 300;
  color: #fff;
  line-height: 1;
  margin-top: -2px;
}

/* ── Hero — fixed background ────────────────────────────────────────── */
.hero-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  flex-shrink: 0;
  overflow: hidden;
  background: #000;
  z-index: 0;
}

.hero-swiper {
  width: 100%;
  height: 100%;
}

.hero-image {
  width: 100%;
  height: 100%;
  display: block;
}

.hero-placeholder {
  width: 100%;
  height: 100%;
  background: #1c1c1e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-placeholder-icon {
  font-size: 52px;
  opacity: 0.4;
}

.img-count-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 999px;
  padding: 3px 10px;
}

.img-count-text {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

/* ── Content card — draggable ────────────────────────────────────────── */
.content-card {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 10;
  border-radius: 30px 30px 0 0;
  padding: 12px 20px 0;
  box-sizing: border-box;
  transition: transform 0.26s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
}

.glass-card {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.62);
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.3);
}

/* ── Card handle ─────────────────────────────────────────────────────── */
.card-handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: white;
  margin: 0 auto 14px;
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
  margin-bottom: 4px;
}

/* ── Comments section ────────────────────────────────────────────────── */
.comments-section {
  margin-top: 20px;
}

.comments-heading {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #1c1c1e;
  margin-bottom: 14px;
}

.comments-scroll {
  height: 100%;
  width: 100%;
  overflow: hidden;

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
  font-size: 15px;
  font-weight: 700;
  color: white;
  margin-bottom: 3px;
}

.comment-text {
  display: block;
  font-size: 15px;
  line-height: 1.45;
  color: black;
}

.comments-bottom-spacer {
  height: 20px;
}

/* ── Comment actions & replies ───────────────────────────────────────── */
.comment-actions {
  margin-top: 6px;
}

.reply-btn {
  font-size: 12px;
  font-weight: 600;
  color: #007aff;
}

.replies-list {
  margin-top: 10px;
  padding-left: 8px;
  border-left: 2px solid rgba(0, 122, 255, 0.15);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reply-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.reply-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff9500, #ffcc00);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.reply-avatar-text {
  font-size: 9px;
  font-weight: 700;
  color: #fff;
}

.reply-body {
  flex: 1;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 10px;
  padding: 6px 10px;
}

/* ── Reply hint bar ──────────────────────────────────────────────────── */
.reply-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 16px;
  background: rgba(0, 122, 255, 0.08);
  border-radius: 12px 12px 0 0;
  margin-bottom: 4px;
}

.reply-hint-text {
  font-size: 12px;
  font-weight: 600;
  color: #007aff;
}

.reply-cancel {
  font-size: 14px;
  color: #8e8e93;
  padding: 2px 6px;
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