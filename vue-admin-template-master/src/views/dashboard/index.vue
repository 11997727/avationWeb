<template>
  <div class="dashboard-container">
    <div class="dashboard-text" align="center">当前时间：{{ time | dateformat('YYYY-MM-DD HH:mm:ss') }}</div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  // computed: {
  //   ...mapGetters([
  //     'name'
  //   ])
  // }
  data() {
    return {
      time: '',
      timer: ''
    }
  },
  created() {
    this.timer = setInterval(() => {
      this.init()
    }, 1000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    init() {
      this.$http.post(this.$url + 'admin/time').then((res) => {
        this.time = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
