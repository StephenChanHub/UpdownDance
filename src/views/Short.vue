<template>
  <view class="top-floating-layer">
    <SearchIsland />
  </view>

  <view class="short-video-container">
    <swiper v-if="mediaList.length" class="media-swiper" vertical circular :current="currentIndex"
      @change="handleSwiperChange">
      <swiper-item v-for="(item, index) in mediaList" :key="item.id">
        <view class="media-layer">
          <view class="media-stage" @click="handleStageTap(index)">
            <image v-if="item.type === 'image'" class="media-preview" :src="item.src" mode="aspectFit" />
            <video v-else :id="`short-video-${item.id}`" class="media-preview" :src="item.src" object-fit="contain"
              :show-center-play-btn="false" :show-fullscreen-btn="false" :show-play-btn="false" :controls="false"
              :autoplay="currentIndex === index" :loop="true" :muted="false" @play="handleVideoPlay(item.id)"
              @pause="handleVideoPause(item.id)" @ended="handleVideoEnded(item.id)"
              @timeupdate="handleVideoTimeUpdate($event, item.id)" />

            <view v-if="item.type === 'video' && !isVideoPlaying(item.id)" class="center-play-button"
              @click.stop="toggleCurrentVideo(item.id)">
              <text class="center-play-icon">▶</text>
            </view>
          </view>

          <view class="overlay-layer">
            <view class="user-info-island">
              <view class="user-main">
                <view class="avatar-circle">AVATAR</view>
                <view class="text-meta">
                  <text class="username">{{ item.username }}</text>
                  <text class="media-description">{{ item.description }}</text>
                </view>
              </view>
            </view>

            <view class="actions-side-island glass-island">
              <view class="action-item upload-trigger" @click="pickLocalMedia">
                <text class="upload-plus">+</text>
                <text class="count">Review</text>
              </view>
              <view class="action-item" @click="handleAction('like')">
                <image class="action-icon" :src="likeIcon" mode="aspectFit" />
                <text class="count">1.2k</text>
              </view>
              <view class="action-item" @click="handleAction('message')">
                <image class="action-icon" :src="chatIcon" mode="aspectFit" />
                <text class="count">482</text>
              </view>
              <view class="action-item" @click="handleAction('share')">
                <image class="action-icon" :src="shareIcon" mode="aspectFit" />
                <text class="count">Share</text>
              </view>
            </view>
          </view>

          <view v-if="item.type === 'video'" class="bottom-progress-bar">
            <view class="bottom-progress-fill" :style="{ width: `${progressMap[item.id] || 0}%` }"></view>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <view v-else class="media-layer">
      <view class="video-placeholder">
        <text class="play-icon">▶</text>
        <text class="media-label">V E D I O / I M A G E</text>
        <text class="placeholder-tip">Tap the plus island to review local files</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue';
import SearchIsland from '../components/SearchIsland.vue';
import likeIcon from '../../public/img/like.png';
import chatIcon from '../../public/img/chat.png';
import shareIcon from '../../public/img/share.png';

const currentIndex = ref(0);
const mediaList = ref([]);
const playingMap = ref({});
const progressMap = ref({});

const currentMedia = computed(() => {
  return mediaList.value[currentIndex.value] || {
    username: '@Preview',
    description: 'Swipe up and down to enjoy your local review feed.',
  };
});

const currentProgress = computed(() => {
  if (currentMedia.value.type !== 'video') return 0;
  return progressMap.value[currentMedia.value.id] || 0;
});

const getVideoContext = (id) => {
  return uni.createVideoContext(`short-video-${id}`);
};

const isVideoPlaying = (id) => {
  return Boolean(playingMap.value[id]);
};

const toggleCurrentVideo = (id) => {
  const context = getVideoContext(id);
  if (isVideoPlaying(id)) {
    context.pause();
    return;
  }
  context.play();
};

const playCurrentVideoIfNeeded = () => {
  const item = mediaList.value[currentIndex.value];
  if (!item || item.type !== 'video') return;

  nextTick(() => {
    getVideoContext(item.id).play();
  });
};

const pauseVideoByIndex = (index) => {
  const item = mediaList.value[index];
  if (!item || item.type !== 'video') return;
  getVideoContext(item.id).pause();
};

const appendMediaItems = (items, append = false) => {
  mediaList.value = append ? [...mediaList.value, ...items].slice(0, 9) : items.slice(0, 9);
  currentIndex.value = 0;
  nextTick(() => {
    playCurrentVideoIfNeeded();
  });
};

const pickImages = () => {
  uni.chooseImage({
    count: 9,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success: (res) => {
      appendMediaItems(
        (res.tempFilePaths || []).map((path, index) => ({
          id: `${Date.now()}-image-${index}`,
          src: path,
          type: 'image',
          username: `@Local_${index + 1}`,
          description: 'Local image review',
        }))
      );
    },
  });
};

const appendSingleVideo = () => {
  if (mediaList.value.filter((item) => item.type === 'video').length >= 9) {
    uni.showToast({ title: 'Up to 9 videos', icon: 'none' });
    return;
  }

  uni.chooseVideo({
    sourceType: ['album'],
    compressed: true,
    success: (res) => {
      appendMediaItems(
        [
          {
            id: `${Date.now()}-video-${mediaList.value.length}`,
            src: res.tempFilePath,
            type: 'video',
            username: `@Local_${mediaList.value.length + 1}`,
            description: 'Local video review',
          },
        ],
        true
      );

      if (mediaList.value.filter((item) => item.type === 'video').length < 9) {
        uni.showModal({
          title: 'Continue adding?',
          content: 'Video selection is single-pick in this environment. Add another video?',
          success: (modalRes) => {
            if (modalRes.confirm) {
              appendSingleVideo();
            }
          },
        });
      }
    },
  });
};

const pickVideo = () => {
  appendSingleVideo();
};

const pickLocalMedia = () => {
  uni.showActionSheet({
    itemList: ['Choose Images', 'Choose Video'],
    success: (res) => {
      if (res.tapIndex === 0) {
        pickImages();
        return;
      }

      pickVideo();
    },
  });
};

const handleSwiperChange = (event) => {
  const previousIndex = currentIndex.value;
  pauseVideoByIndex(previousIndex);
  currentIndex.value = event.detail.current;
  playCurrentVideoIfNeeded();
};

const handleStageTap = (index) => {
  const item = mediaList.value[index];
  if (!item || item.type !== 'video') return;
  toggleCurrentVideo(item.id);
};

const handleVideoPlay = (id) => {
  playingMap.value = { ...playingMap.value, [id]: true };
};

const handleVideoPause = (id) => {
  playingMap.value = { ...playingMap.value, [id]: false };
};

const handleVideoEnded = (id) => {
  playingMap.value = { ...playingMap.value, [id]: false };
  progressMap.value = { ...progressMap.value, [id]: 0 };
};

const handleVideoTimeUpdate = (event, id) => {
  const detail = event.detail || {};
  const duration = Number(detail.duration || 0);
  const currentTime = Number(detail.currentTime || 0);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  progressMap.value = {
    ...progressMap.value,
    [id]: progress,
  };
};

const handleAction = (type) => {
  console.log(`Short action: ${type}`);
};
</script>

<style scoped>
.short-video-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
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

.media-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.media-stage,
.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #2c2c2e 0%, #000000 100%);
  color: rgba(255, 255, 255, 0.3);
}

.media-preview {
  width: 100%;
  height: 100%;
}

.center-play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-play-icon {
  font-size: 34px;
  color: #fff;
  margin-left: 4px;
}

.bottom-progress-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.18);
  z-index: 5;
}

.bottom-progress-fill {
  height: 100%;
  background: #ffffff;
  box-shadow: 0 0 14px rgba(255, 255, 255, 0.45);
  transition: width 0.08s linear;
}

.play-icon {
  font-size: 60px;
  margin-bottom: 10px;
  opacity: 0.5;
}

.media-label {
  letter-spacing: 4px;
  font-weight: 600;
}

.placeholder-tip {
  margin-top: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
}

.overlay-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px 20px 30% 20px;
  box-sizing: border-box;
}

.user-info-island {
  pointer-events: auto;
  max-width: 70%;
}

.user-main {
  display: flex;
  align-items: flex-end;
  gap: 15px;
}

.avatar-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px) saturate(150%);
  -webkit-backdrop-filter: blur(5px) saturate(150%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  font-weight: 600;
}

.text-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: white;
}

.username {
  font-size: 18px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.media-description {
  font-size: 13px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.9);
}

.actions-side-island {
  position: absolute;
  right: 20px;
  bottom: 40%;
  flex-direction: column;
  padding: 20px 10px;
  gap: 25px;
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px) saturate(150%);
  -webkit-backdrop-filter: blur(5px) saturate(150%);
  border-radius: 35px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.1);
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.action-item:active {
  transform: scale(0.9);
}

.upload-plus {
  font-size: 30px;
  line-height: 1;
  color: #007aff;
  margin-bottom: 6px;
}

.action-icon {
  width: 26px;
  height: 26px;
  display: block;
  margin-bottom: 6px;
  opacity: 0.96;
}

.action-item .count {
  font-size: 11px;
  font-weight: 700;
  color: #3a3a3c;
}
</style>
