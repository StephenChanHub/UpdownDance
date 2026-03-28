<template>
  <view class="add-btn-floating-wrapper">
    <view class="glass-island add-btn">
      <text class="add-icon">+</text>
    </view>
  </view>
</template>

<script setup>
</script>

<style scoped>
.add-btn-floating-wrapper {
  position: fixed;
  top: calc(70% + env(safe-area-inset-top));
  right: 30px;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

}

.glass-island {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(30px) saturate(150%);
  -webkit-backdrop-filter: blur(30px) saturate(150%);
  border-radius: 35px;
  border: 0px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 20px 36px rgba(0, 0, 0, 0.14),
    0 6px 14px rgba(0, 0, 0, 0.1),
    0 1px 0 rgba(255, 255, 255, 0.5) inset;
  display: flex;
  align-items: center;
  transition: transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.18s cubic-bezier(0.2, 0.8, 0.2, 1),
    background 0.25s ease;
  pointer-events: auto;
  will-change: transform, box-shadow;
}

.add-btn {
  width: 46px;
  height: 46px;
  justify-content: center;
  cursor: pointer;
}

.add-icon {
  font-size: 24px;
  font-weight: 300;
  color: #007AFF;
}

.add-btn:hover {
  transform: translateY(-1px) scale(1.08);
  box-shadow:
    0 24px 40px rgba(0, 0, 0, 0.16),
    0 10px 18px rgba(0, 0, 0, 0.12),
    0 1px 0 rgba(255, 255, 255, 0.56) inset;
}

.add-btn:active {
  transform: translateY(1px) scale(0.96);
  box-shadow:
    0 10px 18px rgba(0, 0, 0, 0.14),
    0 3px 8px rgba(0, 0, 0, 0.1),
    0 1px 0 rgba(255, 255, 255, 0.45) inset;
}

.add-btn:active .add-icon {
  transform: scale(0.94);
}

.add-icon {
  transition: transform 0.14s ease;
}

@media (max-width: 420px) {
  .add-btn-floating-wrapper {
    top: calc(14px + env(safe-area-inset-top));
    right: 18px;
  }
}
</style>
