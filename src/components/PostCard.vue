<!-- <template>
    <view class="ios-post-card">
        <view class="post-header">
            <view class="user-avatar-placeholder">
                <text class="avatar-label">AVATAR</text>
            </view>
            <view class="user-meta">
                <view class="user-name-placeholder">
                    <text class="name-label">User Name</text>
                </view>
                <text class="post-subtitle">2 hours ago</text>
            </view>
        </view>

        <view class="post-media-container">
            <view class="media-placeholder">
                <text class="media-icon">🎬</text>
                <text class="media-label">V E D I O / i m a g e</text>
            </view>
        </view>

        <view class="post-actions">
            <view class="action-group left">
                <view class="action-item-wrapper" @click="handleAction('like')">
                    <view class="icon-placeholder plain">
                        ♥
                    </view>
                    <text class="action-count">1.2k</text>
                </view>

                <view class="action-item-wrapper" @click="handleAction('message')">
                    <view class="icon-placeholder plain">
                        💬
                    </view>
                    <text class="action-count">482</text>
                </view>
            </view>

            <view class="action-group right">
                <view class="action-item-wrapper share" @click="handleAction('share')">
                    <view class="icon-placeholder plain">
                        ✈
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
// 这里将来可以接收 props，例如 user avatar, video source, counts 等
const handleAction = (type) => {
    console.log(`Action clicked: ${type}`);
    // 这里处理点赞、跳转评论、调用分享逻辑
};
</script>

<style scoped>
/* 全局基础设置：适配之前设置的 iOS 背景色 */
.ios-post-card {
    background: #FFFFFF;
    width: 100%;
    max-width: 500px;
    /* 限制最大宽度，在网页端更好看 */
    margin: 20px auto;
    border-radius: 20px;
    /* iOS System Large Radius */
    padding: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    /* iOS 轻微悬浮阴影 */
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
    box-sizing: border-box;
}

/* 物理反馈：点击整张卡片缩小 */
.ios-post-card:active {
    transform: scale(0.98);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

/* --- 1. 用户信息区域样式 --- */
.post-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.user-avatar-placeholder {
    width: 44px;
    /* iOS 标准触控大小 */
    height: 44px;
    border-radius: 50%;
    background: #F2F2F7;
    /* iOS System Gray 6 */
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.avatar-label {
    font-size: 8px;
    color: #8E8E93;
    font-weight: 600;
}

.user-meta {
    margin-left: 12px;
    display: flex;
    flex-direction: column;
}

.user-name-placeholder {
    background: white;
    /* iOS System Gray 5 */
    border-radius: 4px;
    padding: 2px 1px;
    margin-bottom: 2px;
    width: fit-content;
}

.name-label {

    font-size: 14px;
    color: #1C1C1E;
    font-weight: 600;
}

.post-subtitle {
    font-size: 11px;
    color: #8E8E93;
}


/* --- 2. 媒体内容区域样式 --- */
.post-media-container {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    /* 内层元素圆角稍小 */
    overflow: hidden;
    margin-bottom: 0px;
    background: #F2F2F7;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
}

.media-placeholder {
    width: 100%;
    /* 预设一个高度，例如 4:3 比例，你可以根据需要调整 */
    aspect-ratio: 1 / 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #8E8E93;
}

.media-icon {
    font-size: 32px;
    margin-bottom: 8px;
}

.media-label {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1px;
}


/* --- 3. 交互按钮区域样式 --- */
.post-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;
}

.action-group {
    display: flex;
    align-items: center;
    gap: 20px;
    /* 按钮间距 */
}

.action-item-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: opacity 0.2s;
}

/* 按钮点击反馈：变透明 */
.action-item-wrapper:active {
    opacity: 0.6;
}

.icon-placeholder.plain {
    font-size: 20px;
    /* 图标大小 */
    color: #3A3A3C;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-count {
    margin-left: 6px;
    font-size: 13px;
    color: #8E8E93;
    font-weight: 500;
}

/* 分享按钮：可以添加特殊的 iOS 蓝色响应 */
.action-item-wrapper.share:hover .icon-placeholder {
    color: #007AFF;
    /* iOS Blue */
}
</style> -->