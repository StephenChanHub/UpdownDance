<template>
    <view class="main-postcard-shell" @click="handleOpen">
        <view class="media-layer">
            <image v-if="post.image" class="media-image" :src="post.image" mode="aspectFill" />
            <view v-else class="media-placeholder">
                <text class="media-icon">🖼️</text>
                <text class="media-label">I M A G E</text>
            </view>
        </view>

        <view class="content-overlay">
            <text class="username-text">@{{ post.username || '用户名' }}</text>
            <text class="content-text">{{ previewContent }}</text>
        </view>
    </view>
</template>

<script setup>
const props = defineProps({
    post: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['open']);
const post = props.post;

const previewContent = ((post.content || '').trim() || '').slice(0, 10);

const handleOpen = () => {
    emit('open', post.id);
};
</script>

<style scoped>
.main-postcard-shell {
    position: relative;
    width: 100%;
    aspect-ratio: 0.74;
    background: #ffffff;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.main-postcard-shell:active {
    transform: scale(0.97);
}

.media-layer {
    position: absolute;
    inset: 0;
    background: #f2f2f7;
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

.content-overlay {
    position: absolute;
    inset: auto 0 0 0;
    padding: 14px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(18, 18, 22, 0.55) 100%);
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.username-text {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
}

.content-text {
    font-size: 13px;
    line-height: 1.35;
    color: rgba(255, 255, 255, 0.92);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
