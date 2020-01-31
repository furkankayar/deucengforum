<template>
  <div class="home">
    <div class="container-fluid">
      <div class="row h-100">
        <div class="col-md-3"/>
        <div class="col-md-6 text-center">
          <div v-if="success" class="text-center">
            <br/>
            <vue-responsive-image
              :image-url="require('../../public/images/success_tick.png')"
              :image-ratio="16/9"
            ></vue-responsive-image>
            <br/>
            <strong>Activation successful.</strong>
            <br/>
            <span>You can log into your account.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import VueResponsiveImage from 'vue-responsive-image'

export default {
  name: 'validation',
  components: {
    VueResponsiveImage
  },
  data () {
    return {
      success: false
    }
  },
  mounted () {
    this.success = this.$route.params.success
    if (!this.success) {
      this.$router.push('/')
    }
  },
  methods: {

  }
}
</script>
