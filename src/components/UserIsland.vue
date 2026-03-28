<template>
  <view class="island-wrapper left">
    <view class="glass-island avatar-btn">
      <text>User</text>
    </view>
  </view>
</template>

<script setup>
</script>

<style scoped>
.island-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
}

.island-wrapper.left {
  left: 30px;
}

.glass-island {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(30px) saturate(150%);
  -webkit-backdrop-filter: blur(30px) saturate(150%);
  border-radius: 35px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  pointer-events: auto;
}

.avatar-btn {
  width: 46px;
  height: 46px;
  justify-content: center;
  cursor: pointer;
}

.avatar-btn text {
  font-size: 10px;
  font-weight: 600;
}

.avatar-btn:hover {
  transform: scale(1.08);
}
</style>
