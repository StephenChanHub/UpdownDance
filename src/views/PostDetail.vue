<template>
  <view v-if="post" class="detail-page">
    <scroll-view class="detail-scroll" scroll-y>
      <view class="detail-shell glass-card">
        <image class="detail-media" :src="post.image" mode="aspectFill" />

        <view class="detail-meta">
          <text class="detail-title">{{ post.title }}</text>
          <text class="detail-user">@{{ post.username }}</text>
          <text class="detail-content">{{ post.content || 'No content yet.' }}</text>
        </view>

        <view class="detail-actions">
          <view class="detail-btn secondary" @click="handleBack">
            <text>back</text>
          </view>
          <view class="detail-btn secondary" @click="handleEdit">
            <text>edit</text>
          </view>
          <view class="detail-btn danger" @click="handleDelete">
            <text>delete</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { usePostStore } from '../stores/postStore';
import { useAppViewStore } from '../stores/appViewStore';

const { selectedPost, deletePost } = usePostStore();
const { closePostDetail, openPostEdit } = useAppViewStore();

const post = computed(() => selectedPost.value);

const handleBack = () => {
  closePostDetail();
};

const handleEdit = () => {
  openPostEdit();
};

const handleDelete = () => {
  if (!post.value) return;
  deletePost(post.value.id);
  closePostDetail();
};
</script>

<style scoped>
.detail-page {
  width: 100%;
  height: 100%;
  padding: 18px;
  box-sizing: border-box;
}

.detail-scroll {
  width: 100%;
  height: 100%;
}

.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(28px) saturate(150%);
  -webkit-backdrop-filter: blur(28px) saturate(150%);
  border-radius: 34px;
  border: 1px solid rgba(255, 255, 255, 0.62);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.08);
}

.detail-shell {
  min-height: calc(100% - 10px);
  padding: 18px;
  box-sizing: border-box;
}

.detail-media {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 28px;
  display: block;
  margin-bottom: 18px;
}

.detail-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-title {
  font-size: 26px;
  font-weight: 800;
  color: #1c1c1e;
}

.detail-user {
  font-size: 14px;
  color: #8e8e93;
}

.detail-content {
  margin-top: 4px;
  font-size: 15px;
  line-height: 1.55;
  color: #3a3a3c;
}

.detail-actions {
  margin-top: 26px;
  display: flex;
  gap: 10px;
}

.detail-btn {
  flex: 1;
  min-height: 44px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
}

.secondary {
  background: rgba(255, 255, 255, 0.72);
  color: #1c1c1e;
}

.danger {
  background: rgba(255, 59, 48, 0.88);
  color: #fff;
}
</style>
