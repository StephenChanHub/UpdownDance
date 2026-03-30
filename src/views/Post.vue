<template>
  <view class="post-page">
    <scroll-view class="post-scroll" scroll-y>
      <view class="post-shell glass-card">

        <!-- 3×3 image grid -->
        <view class="media-grid">
          <view v-for="(img, i) in gridSlots" :key="i" class="grid-cell" @click="img ? removeImage(i) : pickImages()">
            <image v-if="img" class="grid-img" :src="img" mode="aspectFill" />
            <view v-else class="grid-empty">
              <text class="grid-plus">+</text>
            </view>
            <!-- Remove badge -->
            <view v-if="img" class="grid-remove">
              <text class="grid-remove-icon">X</text>
            </view>
          </view>
        </view>
        <text class="media-hint">{{ images.length }}/9 · Tap + to add, tap photo to remove</text>

        <!-- Ratio selector -->
        <view class="field-block">
          <text class="field-label">Aspect Ratio</text>
          <view class="ratio-row">
            <view v-for="r in ['9:16', '1:1', '16:9']" :key="r" class="ratio-btn" :class="{ active: ratio === r }"
              @click="ratio = r">
              <view class="ratio-preview" :class="`rp-${r.replace(':', '-')}`" />
              <text class="ratio-label">{{ r }}</text>
            </view>
          </view>
        </view>

        <view class="field-block">
          <text class="field-label">Title</text>
          <textarea class="field-input title-textarea" auto-height maxlength="60" :value="title"
            placeholder="Give this postcard a title" @input="title = $event.detail.value" />
        </view>

        <view class="field-block">
          <text class="field-label">Content</text>
          <textarea class="field-textarea" maxlength="300" :value="content"
            placeholder="Write something for your postcard" @input="content = $event.detail.value" />
        </view>

        <view class="action-row">
          <view class="action-btn cancel-btn" @click="handleCancel">
            <text>Cancel</text>
          </view>
          <view class="action-btn submit-btn" @click="handleSubmit">
            <text>Submit</text>
          </view>
        </view>

      </view>
    </scroll-view>
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
const images = ref([]);
const ratio = ref('9:16');

const MAX = 9;
const COLS = 3;

// Always show a full 3×3 grid: filled cells + one empty slot (if room)
const gridSlots = computed(() => {
  const slots = [...images.value];
  if (slots.length < MAX) slots.push(null); // one add-button slot
  // pad to multiple of COLS for even grid
  while (slots.length % COLS !== 0) slots.push(null);
  return slots.slice(0, MAX + (MAX % COLS === 0 ? 0 : COLS - (MAX % COLS)));
});

const isEditMode = computed(() => postMode.value === 'edit' && Boolean(selectedPost.value));

const resetForm = () => {
  title.value = '';
  content.value = '';
  images.value = [];
  ratio.value = '9:16';
};

watch(selectedPost, (post) => {
  if (!post || postMode.value === 'create') { resetForm(); return; }
  title.value = post.title || '';
  content.value = post.content || '';
  images.value = post.images || (post.image ? [post.image] : []);
}, { immediate: true });

watch(postMode, (mode) => {
  if (mode === 'create') { resetForm(); return; }
  if (selectedPost.value) {
    title.value = selectedPost.value.title || '';
    content.value = selectedPost.value.content || '';
    images.value = selectedPost.value.images || (selectedPost.value.image ? [selectedPost.value.image] : []);
  }
}, { immediate: true });

const pickImages = () => {
  const remaining = MAX - images.value.length;
  if (remaining <= 0) return;
  uni.chooseImage({
    count: remaining,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success: (res) => {
      images.value = [...images.value, ...(res.tempFilePaths || [])].slice(0, MAX);
    },
  });
};

const removeImage = (index) => {
  uni.showModal({
    title: 'Remove photo?',
    content: 'This photo will be removed from the post.',
    success: ({ confirm }) => {
      if (!confirm) return;
      images.value = images.value.filter((_, i) => i !== index);
    },
  });
};

const handleCancel = () => {
  if (isEditMode.value) { closePostEdit(); return; }
  clearSelectedPost();
  closePostCreate();
};

const handleSubmit = () => {
  if (images.value.length === 0) {
    uni.showToast({ title: 'Please add at least one image', icon: 'none' });
    return;
  }

  if (isEditMode.value && selectedPost.value) {
    updatePost(selectedPost.value.id, {
      images: images.value,
      image: images.value[0],
      title: title.value,
      content: content.value,
    });
    openPostDetail();
    return;
  }

  createPost({ images: images.value, title: title.value, content: content.value, ratio: ratio.value });
  clearSelectedPost();
  closePostCreate();
};
</script>

<style scoped>
.post-page {

  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.post-scroll {

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

.post-shell {
  margin: 15% 18px 34px;
  padding: 22px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ── 3×3 image grid ──────────────────────────────────────────────────── */
.media-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  width: 100%;
}

.grid-cell {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.58);
  border: 1.5px dashed rgba(28, 28, 30, 0.14);
  cursor: pointer;
}

.grid-img {
  width: 100%;
  height: 100%;
  display: block;
}

.grid-empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-plus {
  font-size: 32px;
  font-weight: 200;
  color: #007aff;
}

.grid-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-remove-icon {
  font-size: 11px;
  color: #fff;
  font-weight: 700;
}

.media-hint {
  font-size: 12px;
  color: #8e8e93;
  text-align: center;
  margin-top: -8px;
}

/* ── Fields ──────────────────────────────────────────────────────────── */
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

/* ── Ratio selector ─────────────────────────────────────────────────── */
.ratio-row {
  display: flex;
  gap: 10px;
}

.ratio-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 6px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.68);
  border: 1.5px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: border-color 0.18s, background 0.18s;
}

.ratio-btn.active {
  border-color: #007aff;
  background: rgba(0, 122, 255, 0.08);
}

.ratio-preview {
  background: #1c1c1e;
  border-radius: 4px;
}

.rp-9-16 {
  width: 18px;
  height: 32px;
}

.rp-1-1 {
  width: 26px;
  height: 26px;
}

.rp-16-9 {
  width: 36px;
  height: 20px;
}

.ratio-label {
  font-size: 11px;
  font-weight: 700;
  color: #3a3a3c;
}

.ratio-btn.active .ratio-label {
  color: #007aff;
}

/* ── Actions ─────────────────────────────────────────────────────────── */
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
