<template>
  <div class="container">
    <div class="row">
      <div class="col-md-2"/>
      <div class="col-md-8">
        <div class="card text-center">
          <file-upload :url="'http://localhost:8000/uploads/default.png'"/>
        </div>
      </div>
      <div class="col-md-2"/>
    </div>
  </div>
</template>

<script>
import FileUpload from '../components/FileUpload.vue'

export default {
  name: 'profile',
  components: {
    FileUpload
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
};
</script>
