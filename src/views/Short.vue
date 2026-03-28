<template>
  <view class="top-floating-layer">
    <SearchIsland />
  </view>



  <view class="short-video-container">
    <view class="media-layer">
      <view class="video-placeholder">
        <text class="play-icon">▶</text>
        <text class="media-label">V E D I O</text>
      </view>
    </view>

    <view class="overlay-layer">
      <view class="user-info-island">
        <view class="user-main">
          <view class="avatar-circle">AVATAR</view>
          <view class="text-meta">
            <text class="username">@Username</text>
            <view class="description-lines">
              <view class="line"></view>
              <view class="line short"></view>
            </view>
          </view>
        </view>
      </view>

      <view class="actions-side-island glass-island">
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
  </view>
</template>

<script setup>
import SearchIsland from '../components/SearchIsland.vue';
import likeIcon from '../../public/img/like.png';
import chatIcon from '../../public/img/chat.png';
import shareIcon from '../../public/img/share.png';

const handleAction = (type) => {
  console.log(`Short action: ${type}`);
};
</script>

<style scoped>
/* 容器设置为相对定位，确保内部绝对定位生效 */
.short-video-container {
  position: relative;
  width: 100%;
  height: 100%;
  /* min-height: 100%; */
  background: #000;
  /* 视频区域通常使用深色背景 */
  /* border-radius: 30px; */
  /* 匹配整体 iOS 圆角风格 */
  /* overflow: hidden; */
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.top-floating-layer {
  position: fixed;
  top: calc(40px + env(safe-area-inset-top));
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 1000;
  display: flex;
  align-items: center;
  pointer-events: none;
}


/* --- 1. 媒体层：完全填充容器 --- */
.media-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #2C2C2E 0%, #000000 100%);
  color: rgba(255, 255, 255, 0.3);
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

/* --- 2. 顶层叠加：用户信息与操作 --- */
.overlay-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  /* 穿透层：允许点击下方的按钮 */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  /* 内容靠下排列 */
  padding: 20px 20px 30% 20px;
  box-sizing: border-box;
}

/* 左下角用户信息 */
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
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
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

.description-lines {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.line {
  height: 4px;
  width: 180px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.line.short {
  width: 100px;
}

/* 右侧交互岛屿：复用 App.vue 的 glass-island */
.actions-side-island {
  position: absolute;
  right: 20px;
  bottom: 30%;
  flex-direction: column;
  /* 垂直排列按钮 */
  padding: 20px 10px;
  gap: 25px;
  pointer-events: auto;

  /* 复用您认可的悬浮容器参数 */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(30px) saturate(150%);
  -webkit-backdrop-filter: blur(30px) saturate(150%);
  border-radius: 35px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.15);
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
  color: #3A3A3C;
}
</style>