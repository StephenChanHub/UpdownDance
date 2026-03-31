<template>
  <view class="short-root">

    <!-- ── Empty state ── -->
    <view v-if="feedList.length === 0" class="empty-state">
      <text class="empty-icon">▶</text>
      <text class="empty-title">No videos yet</text>
      <text class="empty-sub">Tap + to upload your first video</text>
      <view class="empty-upload-btn" @click="pickLocalMedia">
        <text class="empty-upload-text">+ Upload</text>
      </view>
    </view>

    <!-- ── Full-screen vertical swiper ── -->
    <swiper
      v-else
      class="short-swiper"
      vertical
      :current="currentIndex"
      :duration="280"
      @change="handleSwiperChange"
    >
      <swiper-item
        v-for="(item, index) in feedList"
        :key="item.id"
        class="short-slide"
      >
        <!-- Video stage -->
        <view class="stage" @click="handleStageTap(index, item)">
          <video
            v-if="item.type === 'video'"
            :id="`sv-${item.id}`"
            class="stage-media"
            :src="item.src"
            :poster="item.cover"
            object-fit="cover"
            :controls="false"
            :show-center-play-btn="false"
            :show-play-btn="false"
            :enable-progress-gesture="false"
            :show-fullscreen-btn="false"
            :loop="true"
            :autoplay="false"
            :muted="isMuted"
            @play="onPlay(item.id)"
            @pause="onPause(item.id)"
            @ended="onEnded(item.id)"
            @timeupdate="onTimeUpdate($event, item.id)"
          />
          <image
            v-else
            class="stage-media"
            :src="item.src"
            mode="aspectFill"
          />

          <!-- Pause icon overlay -->
          <view v-if="item.type === 'video' && !isPlaying(item.id) && currentIndex === index" class="pause-overlay">
            <text class="pause-icon">▶</text>
          </view>

          <!-- Progress bar -->
          <view v-if="item.type === 'video'" class="progress-bar">
            <view class="progress-fill" :style="{ width: `${progressMap[item.id] || 0}%` }" />
          </view>
        </view>

        <!-- ── Bottom-left: user info ── -->
        <view class="user-island">
          <view class="user-avatar">
            <image v-if="item.avatar" class="user-avatar-img" :src="item.avatar" mode="aspectFill" />
            <text v-else class="user-avatar-text">{{ item.username.slice(1, 3).toUpperCase() }}</text>
          </view>
          <view class="user-text">
            <text class="user-name">{{ item.username }}</text>
            <text class="user-desc">{{ item.title }}</text>
          </view>
        </view>

        <!-- ── Right: action buttons ── -->
        <view class="action-island">
          <!-- Mute/Unmute -->
          <view class="action-btn" @click.stop="isMuted = !isMuted">
            <text class="action-sym">{{ isMuted ? '🔇' : '🔊' }}</text>
            <text class="action-label">{{ isMuted ? 'Muted' : 'Sound' }}</text>
          </view>
          <!-- Like -->
          <view class="action-btn" @click.stop="toggleLike(item.id)">
            <text class="action-sym" :class="{ liked: likedSet[item.id] }">
              {{ likedSet[item.id] ? '♥' : '♡' }}
            </text>
            <text class="action-label">{{ item.likes }}</text>
          </view>
          <!-- Comment -->
          <view class="action-btn" @click.stop="handleComment">
            <image class="action-icon" :src="chatIcon" mode="aspectFit" />
            <text class="action-label">{{ item.comments }}</text>
          </view>
          <!-- Share -->
          <view class="action-btn" @click.stop="handleShare">
            <image class="action-icon" :src="shareIcon" mode="aspectFit" />
            <text class="action-label">Share</text>
          </view>
          <!-- Upload -->
          <view class="action-btn upload-btn" @click.stop="pickLocalMedia">
            <text class="upload-plus">+</text>
            <text class="action-label">Upload</text>
          </view>
        </view>

      </swiper-item>
    </swiper>

    <!-- ── Top floating bar ── -->
    <view class="top-bar">
      <view class="top-tab" :class="{ active: topTab === 'Following' }" @click="topTab = 'Following'">
        <text class="top-tab-text">Following</text>
      </view>
      <view class="top-divider" />
      <view class="top-tab" :class="{ active: topTab === 'For You' }" @click="topTab = 'For You'">
        <text class="top-tab-text">For You</text>
      </view>
    </view>

  </view>
</template>

<script setup>
import { computed, nextTick, reactive, ref } from 'vue';
import { usePostStore } from '../stores/postStore';
import { useAuthStore } from '../stores/authStore';
import chatIcon from '../../public/img/chat.png';
import shareIcon from '../../public/img/share.png';

const { posts } = usePostStore();
const { user } = useAuthStore();

// ── Feed list: video posts from store ────────────────────────────────────────
const localUploads = ref([]);

const feedList = computed(() => {
  // store posts that are video posts
  const fromStore = posts.value
    .filter((p) => p.video)
    .map((p) => ({
      id: p.id,
      type: 'video',
      src: p.video,
      cover: p.videoCover || p.image || '',
      avatar: p.avatar || '',
      username: p.username ? `@${p.username}` : '@anonymous',
      title: p.title || '',
      likes: 128,
      comments: 24,
    }));

  // locally uploaded media
  return [...localUploads.value, ...fromStore];
});

// ── Tabs ─────────────────────────────────────────────────────────────────────
const topTab = ref('For You');

// ── Playback state ───────────────────────────────────────────────────────────
const currentIndex = ref(0);
const playingMap = reactive({});
const progressMap = reactive({});
const isMuted = ref(false);

const videoCtx = (id) => uni.createVideoContext(`sv-${id}`);
const isPlaying = (id) => Boolean(playingMap[id]);

const playAt = (index) => {
  const item = feedList.value[index];
  if (!item || item.type !== 'video') return;
  nextTick(() => videoCtx(item.id).play());
};

const pauseAt = (index) => {
  const item = feedList.value[index];
  if (!item || item.type !== 'video') return;
  videoCtx(item.id).pause();
};

const handleSwiperChange = ({ detail }) => {
  pauseAt(currentIndex.value);
  currentIndex.value = detail.current;
  playAt(detail.current);
};

const handleStageTap = (index, item) => {
  if (index !== currentIndex.value) return;
  if (item.type !== 'video') return;
  isPlaying(item.id) ? videoCtx(item.id).pause() : videoCtx(item.id).play();
};

const onPlay = (id) => { playingMap[id] = true; };
const onPause = (id) => { playingMap[id] = false; };
const onEnded = (id) => { playingMap[id] = false; progressMap[id] = 0; };
const onTimeUpdate = ({ detail = {} }, id) => {
  const { duration = 0, currentTime = 0 } = detail;
  progressMap[id] = duration > 0 ? (currentTime / duration) * 100 : 0;
};

// ── Like ─────────────────────────────────────────────────────────────────────
const likedSet = reactive({});
const toggleLike = (id) => {
  likedSet[id] = !likedSet[id];
};

// ── Upload local media ───────────────────────────────────────────────────────
const pickLocalMedia = () => {
  uni.chooseVideo({
    sourceType: ['album', 'camera'],
    compressed: false,
    maxDuration: 180,
    success: (res) => {
      const id = `local-${Date.now()}`;
      localUploads.value.unshift({
        id,
        type: 'video',
        src: res.tempFilePath || '',
        cover: res.thumbTempFilePath || '',
        avatar: user.avatar || '',
        username: user.nickname ? `@${user.nickname}` : '@me',
        title: 'My upload',
        likes: 0,
        comments: 0,
      });
      currentIndex.value = 0;
      nextTick(() => playAt(0));
    },
  });
};

// ── Actions ───────────────────────────────────────────────────────────────────
const handleComment = () => uni.showToast({ title: 'Comments coming soon', icon: 'none' });
const handleShare = () => uni.showToast({ title: 'Link copied!', icon: 'none' });
</script>

<style scoped>
/* ── Root ────────────────────────────────────────────────────────────── */
.short-root {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
}

/* ── Swiper ──────────────────────────────────────────────────────────── */
.short-swiper {
  width: 100%;
  height: 100%;
}

.short-slide {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* ── Stage ───────────────────────────────────────────────────────────── */
.stage {
  position: absolute;
  inset: 0;
}

.stage-media {
  width: 100%;
  height: 100%;
  display: block;
}

/* ── Pause overlay ───────────────────────────────────────────────────── */
.pause-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.18);
  pointer-events: none;
}

.pause-icon {
  font-size: 60px;
  color: rgba(255, 255, 255, 0.85);
}

/* ── Progress bar ────────────────────────────────────────────────────── */
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
}

.progress-fill {
  height: 100%;
  background: #fff;
  transition: width 0.08s linear;
}

/* ── User island (bottom-left) ───────────────────────────────────────── */
.user-island {
  position: absolute;
  left: 16px;
  bottom: calc(90px + env(safe-area-inset-bottom));
  right: 80px;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  pointer-events: none;
}

.user-avatar {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar-img {
  width: 100%;
  height: 100%;
  display: block;
}

.user-avatar-text {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}

.user-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
}

.user-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.88);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Action island (right) ───────────────────────────────────────────── */
.action-island {
  position: absolute;
  right: 12px;
  bottom: calc(90px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.action-btn:active {
  opacity: 0.7;
}

.action-sym {
  font-size: 30px;
  color: #fff;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
  line-height: 1;
}

.action-sym.liked {
  color: #ff3b30;
}

.action-icon {
  width: 28px;
  height: 28px;
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.5));
}

.action-label {
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.upload-btn .upload-plus {
  font-size: 30px;
  font-weight: 300;
  color: #007aff;
  line-height: 1;
}

/* ── Top bar ─────────────────────────────────────────────────────────── */
.top-bar {
  position: absolute;
  top: calc(14px + env(safe-area-inset-top));
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
  border-radius: 999px;
  padding: 6px 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.top-tab {
  padding: 2px 12px;
  cursor: pointer;
}

.top-tab-text {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.2s;
}

.top-tab.active .top-tab-text {
  color: #fff;
  font-weight: 800;
}

.top-divider {
  width: 1px;
  height: 14px;
  background: rgba(255, 255, 255, 0.2);
}

/* ── Empty state ─────────────────────────────────────────────────────── */
.empty-state {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000;
  gap: 12px;
}

.empty-icon {
  font-size: 64px;
  color: rgba(255, 255, 255, 0.2);
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
}

.empty-sub {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
}

.empty-upload-btn {
  margin-top: 8px;
  padding: 10px 28px;
  border-radius: 999px;
  background: #007aff;
}

.empty-upload-text {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}
</style>
