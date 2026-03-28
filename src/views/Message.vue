<template>
  <view class="message-page">
    <view class="header">
      <text class="title">Messages</text>
      <text class="sub-title">Simple Queue</text>
    </view>

    <scroll-view class="queue-scroll" scroll-y>
      <view class="queue-list">
        <view v-for="item in messageQueue" :key="item.id" class="queue-item" :class="{ unread: !item.read }"
          @click="toggleRead(item.id)">
          <view class="avatar-wrap">
            <view class="avatar-icon">
              <text class="avatar-head"></text>
              <text class="avatar-body"></text>
            </view>
          </view>
          <view class="content-wrap">
            <text class="user-line">{{ item.user }}</text>
            <text class="text-line">{{ item.text }}</text>
          </view>
          <view class="meta-wrap">
            <text class="time">{{ item.time }}</text>
            <view v-if="!item.read" class="dot"></view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const messageQueue = ref([
  { id: 1, user: 'user_01', text: 'text - - - -', time: '09:14', read: false },
  { id: 2, user: 'user_02', text: 'new comment on your post', time: '09:27', read: false },
  { id: 3, user: 'user_03', text: 'order has been shipped', time: '10:02', read: true },
  { id: 4, user: 'user_04', text: 'welcome to UpDown', time: '11:48', read: true },
  { id: 5, user: 'user_05', text: 'discount coupon available', time: '13:16', read: false },
]);

const toggleRead = (id) => {
  messageQueue.value = messageQueue.value.map((item) => {
    if (item.id !== id) return item;
    return { ...item, read: !item.read };
  });
};
</script>

<style scoped>
.message-page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 76px 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
  background: linear-gradient(180deg, #f5f6fa 0%, #eceef5 100%);
}

.header {
  padding: 2px 4px 8px;
}

.title {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #1c1c1e;
}

.sub-title {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  color: #8e8e93;
}

.queue-scroll {
  flex: 1;
  min-height: 0;
}

.queue-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 10px;
}

.queue-item {
  min-height: 66px;
  border-radius: 999px;
  padding: 10px 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.56);
  backdrop-filter: blur(12px) saturate(145%);
  -webkit-backdrop-filter: blur(12px) saturate(145%);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.queue-item.unread {
  box-shadow: 0 10px 24px rgba(0, 122, 255, 0.12);
}

.queue-item:active {
  transform: scale(0.985);
}

.avatar-wrap {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid #d5d8e2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.86);
  flex-shrink: 0;
}

.avatar-icon {
  position: relative;
  width: 18px;
  height: 18px;
}

.avatar-head {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  border: 2px solid #7e8594;
  border-radius: 50%;
}

.avatar-body {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 8px;
  border: 2px solid #7e8594;
  border-top: none;
  border-radius: 0 0 10px 10px;
}

.content-wrap {
  flex: 1;
  min-width: 0;
}

.user-line {
  display: block;
  font-size: 20px;
  line-height: 1.05;
  font-style: italic;
  font-weight: 600;
  color: #1c1c1e;
}

.text-line {
  display: block;
  margin-top: 3px;
  font-size: 16px;
  line-height: 1.05;
  font-style: italic;
  color: #4e5360;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

.time {
  font-size: 11px;
  color: #8e8e93;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #007aff;
}
</style>