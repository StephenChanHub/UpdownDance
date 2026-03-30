import { computed, ref } from 'vue';

const activeView = ref('Explore');
const lastMainView = ref('Explore');
const postMode = ref('create');

const mainViews = ['Explore', 'Short', 'Store', 'Message', 'Me'];

const navigateTab = (view) => {
  if (!mainViews.includes(view)) return;
  activeView.value = view;
  lastMainView.value = view;
};

const openPostCreate = () => {
  postMode.value = 'create';
  activeView.value = 'Post';
};

const openPostDetail = () => {
  activeView.value = 'PostDetail';
};

const openPostEdit = () => {
  postMode.value = 'edit';
  activeView.value = 'Post';
};

const closePostCreate = () => {
  activeView.value = lastMainView.value;
};

const closePostDetail = () => {
  activeView.value = lastMainView.value;
};

const closePostEdit = () => {
  activeView.value = 'PostDetail';
};

const currentNavView = computed(() => {
  return mainViews.includes(activeView.value) ? activeView.value : lastMainView.value;
});

export const useAppViewStore = () => ({
  activeView,
  lastMainView,
  postMode,
  currentNavView,
  navigateTab,
  openPostCreate,
  openPostDetail,
  openPostEdit,
  closePostCreate,
  closePostDetail,
  closePostEdit,
});
