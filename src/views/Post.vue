<template>
  <view class="post-page">
    <view class="post-shell glass-card">
      <view class="media-picker" @click="pickImage">
        <image v-if="image" class="picked-media" :src="image" mode="aspectFill" />
        <view v-else class="media-placeholder">
          <view class="media-dashed-box">
            <text class="media-plus">+</text>
          </view>
        </view>
      </view>

      <view class="field-block">
        <text class="field-label">title</text>
        <textarea
          class="field-input title-textarea"
          auto-height
          maxlength="60"
          :value="title"
          placeholder="Give this postcard a title"
          @input="title = $event.detail.value"
        />
      </view>

      <view class="field-block">
        <text class="field-label">content</text>
        <textarea
          class="field-textarea"
          maxlength="300"
          :value="content"
          placeholder="Write something for your postcard"
          @input="content = $event.detail.value"
        />
      </view>

      <view class="action-row">
        <view class="action-btn cancel-btn" @click="handleCancel">
          <text>cancel</text>
        </view>
        <view class="action-btn submit-btn" @click="handleSubmit">
          <text>submit</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { usePostStore } from '../stores/postStore';
import { useAppViewStore } from '../stores/appViewStore';

const { selectedPost, createPost, updatePost, clearSelectedPost } = usePostStore();
const { postMode, closePostCreate, closePostEdit, openPostDetail } = useAppViewStore();

const title = ref('');
const content = ref('');
const image = ref('');

const isEditMode = computed(() => postMode.value === 'edit' && Boolean(selectedPost.value));

watch(
  selectedPost,
  (post) => {
    if (!post || postMode.value === 'create') {
      title.value = '';
      content.value = '';
      image.value = '';
      return;
    }

    title.value = post.title || '';
    content.value = post.content || '';
    image.value = post.image || '';
  },
  { immediate: true }
);

watch(
  postMode,
  (mode) => {
    if (mode === 'create') {
      title.value = '';
      content.value = '';
      image.value = '';
    } else if (selectedPost.value) {
      title.value = selectedPost.value.title || '';
      content.value = selectedPost.value.content || '';
      image.value = selectedPost.value.image || '';
    }
  },
  { immediate: true }
);

const pickImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success: (res) => {
      image.value = res.tempFilePaths?.[0] || '';
    },
  });
};

const handleCancel = () => {
  if (isEditMode.value) {
    closePostEdit();
    return;
  }

  clearSelectedPost();
  closePostCreate();
};

const handleSubmit = () => {
  if (!image.value) {
    uni.showToast({ title: 'Please add an image', icon: 'none' });
    return;
  }

  if (isEditMode.value && selectedPost.value) {
    updatePost(selectedPost.value.id, {
      image: image.value,
      title: title.value,
      content: content.value,
    });
    openPostDetail();
    return;
  }

  createPost({
    image: image.value,
    title: title.value,
    content: content.value,
  });

  clearSelectedPost();
  closePostCreate();
};
</script>

<style scoped>
.post-page {
  width: 100%;
  height: 100%;
  padding: 28px 18px 34px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(28px) saturate(150%);
  -webkit-backdrop-filter: blur(28px) saturate(150%);
  border-radius: 34px;
  border: 1px solid rgba(255, 255, 255, 0.62);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.08);
}

.post-shell {
  width: min(100%, 420px);
  min-height: 78vh;
  padding: 22px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.media-picker {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 28px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.58);
  cursor: pointer;
}

.picked-media {
  width: 100%;
  height: 100%;
  display: block;
}

.media-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-dashed-box {
  width: calc(100% - 28px);
  height: calc(100% - 28px);
  border-radius: 24px;
  border: 2px dashed rgba(28, 28, 30, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-plus {
  font-size: 64px;
  font-weight: 200;
  color: #007aff;
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 15px;
  font-weight: 700;
  color: #1c1c1e;
}

.field-input,
.field-textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  padding: 14px 16px;
  box-sizing: border-box;
  font-size: 15px;
  color: #1c1c1e;
}

.title-textarea {
  min-height: 50px;
  max-height: 50px;
  line-height: 22px;
  overflow: hidden;
}

.field-textarea {
  min-height: 138px;
}

.action-row {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.action-btn {
  flex: 1;
  min-height: 44px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.7);
  color: #1c1c1e;
}

.submit-btn {
  background: #007aff;
  color: #fff;
}
</style>
