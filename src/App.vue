<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/*每个页面公共css */
page {
  background-color: #F2F2F7;
}

/* 让布局更可预期：避免某些端下 padding/width 叠加 */
view {
  box-sizing: border-box;
}
</style>
