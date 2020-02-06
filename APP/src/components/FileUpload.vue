<template>
  <div class="file">
    <div>
      <div class="file-upload-form">
        <label for="file">
          <img class="rounded-circle" :src="this.url"/>
        </label>
        <input id="file" type="file" ref="file" @change="previewImage" accept="image/*">
      </div>
      <div class="image-preview" v-if="imageData.length > 0" >
          <img class="preview" :src="imageData">
      </div>
    </div>
  </div>
  <!--
  <form @submit.prevent="onSubmit" enctype="multipart/form-data">
    <input type='file' onchange="readURL(this);" />
    <img id="blah" src="http://placehold.it/180" alt="your image" />
  </form>
  <div class="fields">
    <label>Upload File</label><br/>
    <input
      type="file"
      ref="file"
      @change="onSelect"
    />
  </div>
  <div class="fields">
    <button>Submit</button>
  </div>
  <div class="message">
    <h5>{{ message }}</h5>
  </div>-->
</template>

<script>
import api from '../api.js'

export default {
  name: 'FileUpload',
  data () {
    return {
      file: '',
      message: '',
      imageData: '',
    }
  },
  props: ['url'],
  mounted () {
  },
  methods: {
    onSubmit () {
      let formData = new FormData()
      formData.append('file', this.file)
      api.upload_profile_image(formData)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    previewImage (event) {
      this.file = this.$refs.file.files[0]
      // Reference to the DOM input element
      var input = event.target;
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        var reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          this.imageData = e.target.result;
        }
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0]);
      }
    }
  }
};
</script>

<style>
.file-upload-form>input {
  display:none;
}

.file-upload-form img{
  width: 80px;
  cursor: pointer;
}

.file-upload-form, .image-preview {
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    padding: 20px;
}
img.preview {
    width: 200px;
    background-color: white;
    padding: 5px;
}
</style>
