<template>
    <view class="main-postcard-shell">

        <view class="media-layer">
            <view class="media-placeholder">
                <text class="media-icon">🖼️</text>
                <text class="media-label">V E D I O / I M A G E</text>
            </view>
        </view>

        <view class="user-layer-overlay">
            <view class="user-glass-card">
                <view class="avatar-box"></view>
                <text class="username-text">Username</text>
            </view>
        </view>

    </view>
</template>

<style scoped>
/* --- 1. 主容器层 (Base Layer) --- */
.main-postcard-shell {
    position: relative;
    /* 为内部绝对定位提供基准 */
    width: 100%;
    aspect-ratio: 1 / 1;
    /* 极简主卡片通常使用 1:1 或 4:5 */
    background: #FFFFFF;
    border-radius: 24px;
    /* iOS 风格大圆角 */
    overflow: hidden;
    /* 确保内部层级不超出圆角 */

    /* 悬浮效果：与 PostCard 一致 */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

/* 点击反馈效果 */
.main-postcard-shell:active {
    transform: scale(0.97);
}

/* --- 2. 媒体层 (Middle Layer) --- */
.media-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    /* 处于底层 */
    background-color: #F2F2F7;
    /* iOS 系统灰色占位 */
}

.media-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #C7C7CC;
}

.media-icon {
    font-size: 40px;
    margin-bottom: 8px;
}

.media-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
}

.media-icon,
.media-label,
.username-text {
    display: block;
}

/* --- 3. 用户层 (Top Layer) --- */
.user-layer-overlay {
    position: absolute;
    inset: 0;
    /* 撑满容器，但内部内容通过 flex 或定位控制 */
    z-index: 2;
    /* 处于顶层 */
    padding: 16px;
    display: flex;
    align-items: flex-end;
    /* 用户信息靠底部显示 */
    pointer-events: none;
    /* 确保点击能穿透到主容器触发缩放 */
}

/* 用户信息的极简悬浮玻璃卡片 */
.user-glass-card {
    pointer-events: auto;
    /* 恢复用户卡片的可点击性 */
    display: flex;
    align-items: center;
    padding: 2px;
}

.avatar-box {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #E5E5EA;
    margin-right: 8px;
}

.username-text {
    font-size: 13px;
    font-weight: 600;
    color: #1C1C1E;
}
</style>