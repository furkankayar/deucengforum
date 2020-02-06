<template>
  <div class="container">
    <div class="row">
      <div class="col-md-2"/>
      <div class="col-md-8">
        <div id="step-0" class="card text-center mb-4 tour step-0" title="" data-index="0" data-original-title="Welcome">
          <div class="mt-4">
            <img :src="this.profile_image" class="profile_image z-depth-2">
          </div>
          <div id="step-3" class="card-body tour step-3" title="" data-index="3" data-original-title="3. Profile card">
            <h5 class="card-title font-weight-bold">
              <p class="text-primary">{{ this.username }}</p>
            </h5>
            <p>
              <small class="text-muted">Last activity: {{ printDate() }}</small>
            </p>
            <hr>
            <p class="badge unique-color" data-toggle="modal" data-target="#followersModal">{{ this.likes }} Likes</p>
            <p class="badge unique-color-dark" data-toggle="modal" data-target="#followingModal">{{ this.dislikes }} Dislikes</p>
            <p id="step-4" class="badge mdb-color tour step-4" title="" data-index="4" data-original-title="4. Prestige counter">{{ this.total_view }}<i class="fa fa-diamond mx-1"></i>Views</p>
          </div>
        </div>
        <div class="card mb-4">
          <div class="card-header text-center">{{ this.username }}'s top rated posts</div>
          <div class="card-body py-2">
            <ul class="list-group list-group-flush">
              <li v-for="(post,i) in this.top_posts" :key="i" class="list-group-item px-0">
                <span class="badge badge-info badge-pill pull-left mr-2">
                  {{ post.total_like }}<i class="fas fa-thumbs-up ml-1"></i>
                </span>
                <a :href="'/post/' + post.post_id">{{ post.topic }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-2"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import NavbarPage from '@/components/NavbarPage.vue'
//  import { mdbBtn } from 'mdbvue';
//  import api from '../api';

export default {
  name: 'user_page',
  components: {
    //  mdbBtn,
  },
  data () {
    return {
      username: '',
      profile_image: '',
      days_ago: '',
      hours_ago: '',
      minutes_ago: '',
      seconds_ago: '',
      top_posts: [],
      likes: '',
      dislikes: '',
      total_view: ''
    }
  },
  mounted () {

    if(this.$route.params.body === undefined || this.$route.params.body === null){
      this.$router.push('/')
    }

    this.username = this.$route.params.body.username
    this.profile_image = this.$route.params.body.profile_image
    this.days_ago = this.$route.params.body.last_activity.days_ago
    this.hours_ago = this.$route.params.body.last_activity.hours_ago
    this.minutes_ago = this.$route.params.body.last_activity.minutes_ago
    this.seconds_ago = this.$route.params.body.last_activity.seconds_ago
    this.top_posts = this.$route.params.body.top_posts
    this.likes = this.$route.params.body.likes.likes
    this.dislikes = this.$route.params.body.likes.dislikes
    this.total_view = this.$route.params.body.total_view.total_view
  },
  methods: {
    printDate () {
      if (this.days_ago !== 0) {
        return this.days_ago + ' day' + (this.days_ago > 1 ? 's' : '') + ' ago'
      }
      else if (this.hours_ago !== 0) {
        return this.hours_ago + ' hour' + (this.hours_ago > 1 ? 's' : '') + ' ago'
      }
      else if (this.minutes_ago !== 0) {
        return this.minutes_ago + ' minute' + (this.minutes_ago > 1 ? 's' : '') + ' ago'
      }
      else {
        return this.seconds_ago + ' second' + (this.seconds_ago > 1 ? 's' : '') + ' ago'
      }
    }
  }
}
</script>

<style>
.profile_image {
  vertical-align: middle;
  border-radius: 50%;
  width: 100px;
  height: 100px;
}
</style>
