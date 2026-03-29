<template>
  <!-- Fixed search bar floating above everything -->
  <view class="top-floating-layer">
    <SearchIsland />
  </view>

  <view class="short-container">
    <!-- Feed -->
    <swiper v-if="mediaList.length" class="media-swiper" vertical circular :current="currentIndex"
      @change="handleSwiperChange">
      <swiper-item v-for="(item, index) in mediaList" :key="item.id">
        <view class="media-frame">

          <!-- Media stage -->
          <!-- <view class="media-stage" @click="handleStageTap(index)">
            <image v-if="item.type === 'image'" class="media-preview" :src="item.src" mode="aspectFit" />
            <video v-else :id="`short-video-${item.id}`" class="media-preview" :src="item.src" object-fit="contain"
              :show-center-play-btn="false" :show-fullscreen-btn="false" :show-play-btn="false" :controls="false"
              :autoplay="currentIndex === index" :loop="true" :muted="false" @play="onPlay(item.id)"
              @pause="onPause(item.id)" @ended="onEnded(item.id)" @timeupdate="onTimeUpdate($event, item.id)" />

            <!-- Paused overlay button -->
          <!-- <view v-if="item.type === 'video' && !isPlaying(item.id)" class="play-button"
              @click.stop="toggleVideo(item.id)">
              <text class="play-button-icon">&#9654;</text>
            </view>
          </view> -->

          <!-- Overlay: user info + actions -->
          <view class="overlay">
            <!-- User info — bottom left -->
            <view class="user-island">
              <view class="avatar">AVATAR</view>
              <view class="user-text">
                <text class="username">{{ item.username }}</text>
                <text class="description">{{ item.description }}</text>
              </view>
            </view>

            <!-- Action buttons — right side -->
            <view class="action-island">
              <view class="action-btn upload-btn" @click="pickLocalMedia">
                <text class="upload-icon">+</text>
                <text class="action-label">Review</text>
              </view>
              <view class="action-btn" @click="handleAction('like')">
                <image class="action-icon" :src="likeIcon" mode="aspectFit" />
                <text class="action-label">1.2k</text>
              </view>
              <view class="action-btn" @click="handleAction('message')">
                <image class="action-icon" :src="chatIcon" mode="aspectFit" />
                <text class="action-label">482</text>
              </view>
              <view class="action-btn" @click="handleAction('share')">
                <image class="action-icon" :src="shareIcon" mode="aspectFit" />
                <text class="action-label">Share</text>
              </view>
            </view>
          </view>

          <!-- Video progress bar -->
          <view v-if="item.type === 'video'" class="progress-bar">
            <view class="progress-fill" :style="{ width: `${progressMap[item.id] || 0}%` }" />
          </view>

        </view>
      </swiper-item>
    </swiper>

    <!-- Empty state -->
    <view v-else class="empty-state">
      <text class="empty-play-icon">&#9654;</text>
      <!-- <text class="empty-label">V I D E O &nbsp;/&nbsp; I M A G E</text>
      <text class="empty-tip">Tap the plus island to review local files</text> -->
    </view>
  </view>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import SearchIsland from '../components/SearchIsland.vue';
import likeIcon from '../../public/img/like.png';
import chatIcon from '../../public/img/chat.png';
import shareIcon from '../../public/img/share.png';

// ─── State ────────────────────────────────────────────────────────────────────
const currentIndex = ref(0);
const mediaList = ref([]);
const playingMap = ref({});   // id -> boolean
const progressMap = ref({});   // id -> 0-100

// ─── Video context helpers ────────────────────────────────────────────────────
const videoCtx = (id) => uni.createVideoContext(`short-video-${id}`);

const isPlaying = (id) => Boolean(playingMap.value[id]);

const toggleVideo = (id) => {
  isPlaying(id) ? videoCtx(id).pause() : videoCtx(id).play();
};

const playCurrentIfNeeded = () => {
  const item = mediaList.value[currentIndex.value];
  if (!item || item.type !== 'video') return;
  nextTick(() => videoCtx(item.id).play());
};

const pauseAtIndex = (index) => {
  const item = mediaList.value[index];
  if (!item || item.type !== 'video') return;
  videoCtx(item.id).pause();
};

// ─── Media loading ────────────────────────────────────────────────────────────
const loadMediaList = (items, append = false) => {
  mediaList.value = append
    ? [...mediaList.value, ...items].slice(0, 9)
    : items.slice(0, 9);
  currentIndex.value = 0;
  nextTick(playCurrentIfNeeded);
};

const pickImages = () => {
  uni.chooseImage({
    count: 9,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success: ({ tempFilePaths = [] }) => {
      loadMediaList(
        tempFilePaths.map((src, i) => ({
          id: `${Date.now()}-image-${i}`,
          src,
          type: 'image',
          username: `@Local_${i + 1}`,
          description: 'Local image review',
        }))
      );
    },
  });
};

const pickSingleVideo = () => {
  const videoCount = mediaList.value.filter((m) => m.type === 'video').length;
  if (videoCount >= 9) {
    uni.showToast({ title: 'Up to 9 videos', icon: 'none' });
    return;
  }

  uni.chooseVideo({
    sourceType: ['album'],
    compressed: true,
    success: ({ tempFilePath }) => {
      loadMediaList(
        [{
          id: `${Date.now()}-video-${mediaList.value.length}`,
          src: tempFilePath,
          type: 'video',
          username: `@Local_${mediaList.value.length + 1}`,
          description: 'Local video review',
        }],
        true
      );

      const updatedCount = mediaList.value.filter((m) => m.type === 'video').length;
      if (updatedCount < 9) {
        uni.showModal({
          title: 'Continue adding?',
          content: 'Video selection is single-pick in this environment. Add another video?',
          success: ({ confirm }) => confirm && pickSingleVideo(),
        });
      }
    },
  });
};

const pickLocalMedia = () => {
  uni.showActionSheet({
    itemList: ['Choose Images', 'Choose Video'],
    success: ({ tapIndex }) => {
      tapIndex === 0 ? pickImages() : pickSingleVideo();
    },
  });
};

// ─── Swiper & tap handlers ────────────────────────────────────────────────────
const handleSwiperChange = ({ detail }) => {
  pauseAtIndex(currentIndex.value);
  currentIndex.value = detail.current;
  playCurrentIfNeeded();
};

const handleStageTap = (index) => {
  const item = mediaList.value[index];
  if (item?.type === 'video') toggleVideo(item.id);
};

// ─── Video event handlers ─────────────────────────────────────────────────────
const onPlay = (id) => { playingMap.value = { ...playingMap.value, [id]: true }; };
const onPause = (id) => { playingMap.value = { ...playingMap.value, [id]: false }; };
const onEnded = (id) => {
  playingMap.value = { ...playingMap.value, [id]: false };
  progressMap.value = { ...progressMap.value, [id]: 0 };
};
const onTimeUpdate = ({ detail = {} }, id) => {
  const { duration = 0, currentTime = 0 } = detail;
  progressMap.value = {
    ...progressMap.value,
    [id]: duration > 0 ? (currentTime / duration) * 100 : 0,
  };
};

// ─── Action stub ─────────────────────────────────────────────────────────────
const handleAction = (type) => console.log(`Short action: ${type}`);
</script>

<style scoped>
/* ── Design tokens ──────────────────────────────────────────────────── */
:root {
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.15);
  --glass-blur: blur(10px) saturate(150%);
  --shadow-soft: 0 15px 45px rgba(0, 0, 0, 0.15);
  --radius-pill: 35px;
}

/* ── Layout ─────────────────────────────────────────────────────────── */
.short-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
}

.top-floating-layer {
  position: fixed;
  top: calc(20px + env(safe-area-inset-top));
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 1000;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.media-swiper {
  width: 100%;
  height: 100%;
}

.media-frame {
  position: absolute;
  inset: 0;
}

/* ── Media stage ─────────────────────────────────────────────────────── */
.media-stage {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #2c2c2e 0%, #000 100%);
}

.media-preview {
  width: 100%;
  height: 100%;
}

/* ── Play button ────────────────────────────────────────────────────── */
.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-button-icon {
  font-size: 34px;
  color: #fff;
  margin-left: 4px;
}

/* ── Progress bar ────────────────────────────────────────────────────── */
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.18);
  z-index: 5;
}

.progress-fill {
  height: 100%;
  background: #fff;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
  transition: width 0.08s linear;
}

/* ── Overlay ─────────────────────────────────────────────────────────── */
.overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px 20px calc(30% + env(safe-area-inset-bottom)) 20px;
  box-sizing: border-box;
}

/* ── User island ─────────────────────────────────────────────────────── */
.user-island {
  pointer-events: auto;
  max-width: 70%;
  display: flex;
  align-items: flex-end;
  gap: 14px;
}

.avatar {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
}

.user-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.username {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.description {
  font-size: 13px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.88);
}

/* ── Action island ───────────────────────────────────────────────────── */
.action-island {
  position: absolute;
  right: 20px;
  bottom: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  padding: 18px 12px;
  pointer-events: auto;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-radius: var(--radius-pill);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-soft);
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: transform 0.18s ease;
}

.action-btn:active {
  transform: scale(0.88);
}

.upload-icon {
  font-size: 28px;
  line-height: 1;
  color: #007aff;
}

.action-icon {
  width: 26px;
  height: 26px;
}

.action-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
}

/* ── Empty state ─────────────────────────────────────────────────────── */
.empty-state {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #2c2c2e 0%, #000 100%);
  color: rgba(255, 255, 255, 0.35);
  gap: 10px;
}

.empty-play-icon {
  font-size: 58px;
  opacity: 0.45;
}

.empty-label {
  letter-spacing: 4px;
  font-weight: 600;
  font-size: 13px;
}

.empty-tip {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}
</style>
