<template>
    <view class="postcard-shell" :class="`ratio-${safeRatio}`" @click="handleOpen">
        <view class="media-layer">
            <image v-if="firstImage" class="media-image" :src="firstImage" mode="aspectFill" />
            <view v-else class="media-placeholder">
                <text class="media-icon">🖼️</text>
                <text class="media-label">I M A G E</text>
            </view>
            <!-- multi-image badge -->
            <view v-if="imageCount > 1" class="multi-badge">
                <text class="multi-badge-text">1/{{ imageCount }}</text>
            </view>
        </view>

        <view class="content-overlay">
            <text class="username-text">@{{ post.username || 'anonymous' }}</text>
            <text class="content-text">{{ previewContent }}</text>
        </view>
    </view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    post: { type: Object, required: true },
});

const emit = defineEmits(['open']);

const VALID_RATIOS = ['9:16', '16:9', '1:1'];

const safeRatio = computed(() => {
    const r = props.post.ratio || '9:16';
    return VALID_RATIOS.includes(r) ? r.replace(':', '-') : '9-16';
});

const firstImage = computed(() => {
    const p = props.post;
    return p.images?.[0] || p.image || '';
});

const imageCount = computed(() => {
    const p = props.post;
    return p.images?.length || (p.image ? 1 : 0);
});

const previewContent = computed(() =>
    ((props.post.content || '').trim()).slice(0, 20)
);

const handleOpen = () => emit('open', props.post.id);
</script>

<style scoped>
.postcard-shell {
    position: relative;
    width: 100%;
    background: #ffffff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.postcard-shell:active {
    transform: scale(0.97);
}

/* ── Aspect ratios ───────────────────────────────────────────────────── */
.ratio-9-16 {
    aspect-ratio: 9 / 16;
}

.ratio-1-1 {
    aspect-ratio: 1 / 1;
}

/* 16:9 is full-width — handled by Explore layout, keep square-ish fallback */
.ratio-16-9 {
    aspect-ratio: 16 / 9;
}

/* ── Media ───────────────────────────────────────────────────────────── */
.media-layer {
    position: absolute;
    inset: 0;
    background: #1c1c1e;
}

.media-image {
    width: 100%;
    height: 100%;
    display: block;
}

.media-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #c7c7cc;
}

.media-icon {
    font-size: 38px;
    margin-bottom: 8px;
}

.media-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.24em;
}

/* ── Multi-image badge ───────────────────────────────────────────────── */
.multi-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border-radius: 999px;
    padding: 2px 8px;
}

.multi-badge-text {
    font-size: 11px;
    font-weight: 600;
    color: #fff;
}

/* ── Content overlay ─────────────────────────────────────────────────── */
.content-overlay {
    position: absolute;
    inset: auto 0 0 0;
    padding: 12px 14px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.58) 100%);
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.username-text {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
}

.content-text {
    font-size: 16px;
    line-height: 1.35;
    color: rgba(255, 255, 255, 0.9);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
