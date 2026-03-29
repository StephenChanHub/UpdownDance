<template>
  <view class="island-wrapper center">
    <view class="glass-island search-bar" :class="{ 'is-focused': isSearchFocused }">
      <input :value="modelValue" type="text" placeholder="search" @focus="isSearchFocused = true"
        @blur="isSearchFocused = false" @input="handleInput" />
      <image class="search-icon" :src="searchIcon" mode="aspectFit" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import searchIcon from '../../public/img/search.png';

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);
const isSearchFocused = ref(false);

const handleInput = (event) => {
  emit('update:modelValue', event.detail.value);
};
</script>

<style scoped>
.island-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
}

.island-wrapper.center {
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  max-width: calc(100% - 100px);
}

.glass-island {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px) saturate(150%);
  -webkit-backdrop-filter: blur(5px) saturate(150%);
  border-radius: 35px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  pointer-events: auto;
}

.search-bar {
  width: 120px;
  max-width: 100%;
  box-sizing: border-box;
  padding: 8px 18px;
  justify-content: flex-start;
  transition: width 0.45s cubic-bezier(0.19, 1, 0.22, 1),
    min-width 0.45s cubic-bezier(0.19, 1, 0.22, 1),
    box-shadow 0.45s cubic-bezier(0.19, 1, 0.22, 1),
    background 0.45s ease;
}

.search-bar.is-focused {
  width: min(300px, calc(100vw - 120px));
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 45px rgba(0, 122, 255, 0.2);
}

.search-bar input {
  background: transparent;
  border: none;
  outline: none;
  margin-left: 10px;
  flex: 1;
  min-width: 0;
  font-size: 15px;
}

.search-bar .search-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: block;
  opacity: 0.88;
}

@media (max-width: 420px) {
  .island-wrapper.center {
    right: 16px;
    max-width: calc(100% - 88px);
  }

  .search-bar {
    width: 160px;
    padding: 8px 14px;
  }

  .search-bar.is-focused {
    width: min(280px, calc(100vw - 96px));
  }
}
</style>
