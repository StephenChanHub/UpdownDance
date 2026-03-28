<template>
  <view class="ios-app-container">
    <view class="main-content">
      <view class="slide-vertical-container">
        <component :is="currentView" />
      </view>
    </view>

    <view v-if="showBottomNav" class="bottom-floating-nav-layer">
      <view class="glass-island nav-container">
        <view
          v-for="item in NAV_ITEMS"
          :key="item.id"
          class="nav-item"
          :class="{ active: currentNavView === item.id }"
          @click="navigateTab(item.id)"
        >
          <view class="nav-icon-wrapper">
            <image class="nav-icon" :src="item.icon" mode="aspectFit" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import Explore from '../../views/Explore.vue';
import Short from '../../views/Short.vue';
import Store from '../../views/Store.vue';
import Message from '../../views/Message.vue';
import Me from '../../views/Me.vue';
import Post from '../../views/Post.vue';
import PostDetail from '../../views/PostDetail.vue';
import { NAV_ITEMS } from '../../constants/navigation';
import { useAppViewStore } from '../../stores/appViewStore';

const { activeView, currentNavView, navigateTab } = useAppViewStore();

const viewMap = {
  Explore,
  Short,
  Store,
  Message,
  Me,
  Post,
  PostDetail,
};

const currentView = computed(() => viewMap[activeView.value] || Explore);
const showBottomNav = computed(() => ['Explore', 'Short', 'Store', 'Message', 'Me'].includes(activeView.value));
</script>

<style scoped>
.ios-app-container {
  width: 100vw;
  height: 100vh;
  background-color: #F2F2F7;
  color: #000000;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  overflow: hidden;
  position: relative;
  margin: 0;
}

.bottom-floating-nav-layer {
  position: fixed;
  bottom: calc(34px + env(safe-area-inset-bottom));
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 1000;
  pointer-events: none;
}

.glass-island {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(30px) saturate(150%);
  -webkit-backdrop-filter: blur(30px) saturate(150%);
  border-radius: 35px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 18px 46px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  pointer-events: auto;
}

.nav-container {
  min-width: 320px;
  padding: 10px 14px;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;
}

.nav-icon-wrapper {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.nav-icon-wrapper::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0) 72%);
  opacity: 0;
  transform: scale(0.7);
  transition: all 0.32s ease;
  pointer-events: none;
}

.nav-icon {
  width: 18px;
  height: 18px;
  display: block;
  filter: grayscale(1) brightness(0.78) contrast(0.92);
  transition:
    transform 0.32s cubic-bezier(0.19, 1, 0.22, 1),
    filter 0.32s ease,
    opacity 0.32s ease;
}

.nav-item.active .nav-icon {
  transform: scale(1.5);
  filter: brightness(0) saturate(100%) invert(45%) sepia(98%) saturate(2370%) hue-rotate(198deg) brightness(102%) contrast(101%)
    drop-shadow(0 6px 12px rgba(0, 122, 255, 0.22));
}

.nav-item.active .nav-icon-wrapper::before {
  opacity: 1;
  transform: scale(1);
}

.main-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0;
  box-sizing: border-box;
}

.slide-vertical-container {
  height: 100%;
}

.slide-vertical-enter-active,
.slide-vertical-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-vertical-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-vertical-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
