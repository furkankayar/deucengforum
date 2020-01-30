<template>
  <div class="container">
    <div class="row">
      <div class="col-md-2"/>
      <div class="col-md-8">
        <div class="question-card card mb-4">
          <div class="card-header forum-card-img-30 d-flex justify-content-between">
            <p class="pt-2 mb-0">
              <img src="https://secure.gravatar.com/avatar/62c9c125499e280d7f96a75e939f3046?s=96&amp;d=mm&amp;r=g" alt="" class="rounded-circle mr-2">
              <strong><a :href="this.user_id !== '' ? '/user/' + this.user_id : '#'">{{ this.username }}</a></strong>
              {{ printDate(this.date) }}
            </p>
            <div>
              <a v-on:click="votePost('1')" type="button" class="btn btn-outline-dark-green btn-sm px-2 waves-effect show_login">
                <span class="value">{{ this.positive_vote }}</span>
                <i class="far fa-thumbs-up ml-1"></i>
              </a>
              <a v-on:click="votePost('-1')" type="button" class="btn btn-outline-danger btn-sm px-2 waves-effect show_login">
                <span class="value">{{ this.negative_vote }}</span>
                <i class="far fa-thumbs-down ml-1"></i>
              </a>
            </div>
          </div>
          <!--Card content-->
          <div class="card-body">
            {{ this.content }}
            <hr>
            <!-- Comments -->
            <div class="comment-card ml-5">                                                                                                                                                                                                  <!-- Single comment -->
              <small v-for="(comment, i) in comments" v-bind:key="i" class="comment-item text-muted">
                <p class="mb-2">
                  <strong><a :href="comment.user_id ? '/user/' + comment.user_id : '#'">{{ comment.username ? comment.username : 'Anonymous' }}</a></strong>
                  {{ printDate(comment)}}
                </p>
                <p>{{ comment.content }}</p>
                <hr>
              </small>
              <div>
                <div class="px-1 mt-4">

                <!-- Comment -->
                <div class="form-group">
                  <label for="replyFormComment">Your comment</label>
                  <textarea v-model="commentText"
                            v-on:input="commentTyped"
                            v-on:focusin="counterVisible = true"
                            v-on:focusout="counterVisible = false "
                            class="form-control"
                            id="replyFormComment"
                            rows="5"
                            maxlength="350">
                  </textarea>
                  <small v-if="counterVisible" class="text-muted mb-2 float-right">{{ this.commentText.trim().length + '/350' }}</small>
                  <br/>
                </div>
                <div class="text-center">
                  <mdb-btn :disabled="this.disableButton || this.disableAll" v-on:click="commentAuthenticated()" v-if="isAuthenticated" color="primary" size="md">Comment</mdb-btn>
                  <mdb-btn :disabled="this.disableButton || this.disableAll" v-on:click="commentAnonymous()" color="secondary" size="md">Comment Anonymous</mdb-btn>
                </div>

              </div>

              </div>
            </div>
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
import { mdbBtn } from 'mdbvue';
import api from '../api';

export default {
  name: 'post',
  components: {
    mdbBtn,
  },
  data () {
    return {
      post_id: '',
      isAuthenticated: false,
      user_id: '',
      username: '',
      content: '',
      date: {},
      positive_vote: '',
      negative_vote: '',
      comments: [],
      commentText: '',
      commentError: '',
      disableButton: true,
      disableAll: false,
      counterVisible: false
    }
  },
  mounted () {
    let data
    let id = this.$route.params.id
    if (this.$route.params.data !== undefined || this.$route.params.data !== null) {
      data = this.$route.params.data
    }
    this.post_id = id
    this.user_id = data.user_id ? data.user_id : ''
    this.username = data.username ? data.username : ''
    this.content = data.content ? data.content : ''
    this.date.published_days_ago = data.published_days_ago ? data.published_days_ago : 0
    this.date.published_hours_ago = data.published_hours_ago ? data.published_hours_ago : 0
    this.date.published_minutes_ago = data.published_minutes_ago ? data.published_minutes_ago : 0
    this.date.published_seconds_ago = data.published_seconds_ago ? data.published_seconds_ago : 0
    this.positive_vote = data.positive_vote ? data.positive_vote : ''
    this.negative_vote = data.negative_vote ? data.negative_vote : ''

    if (id !== undefined || id !== null) {

      api.get_comments_of_post({
        postId: id
      })
        .then(res => {
          if (res.data.code === 200 && res.data.error === false) {
            this.comments = res.data.body
          }
          else {
            this.comments = []
          }
        })
        .catch(err => {
          if (err) {
            this.comments = []
          }
        })
    }

    api.check_authentication({
    })
      .then(res => {
        if (res.data.error === false){
          this.isAuthenticated = true
        }
        else {
          this.isAuthenticated = false
        }
      })
      .catch(err => {
        if (err) {
          this.isAuthenticated = false
        }
      })

    api.view_post({
      postId: id
    })
      .then(res => {
        if (res){
          console.log('Post view confirmed')
        }
      })
      .catch(err => {
        if (err) {
          console.log('Unauthorized')
        }
      })
  },
  methods: {
    printDate (item) {
      if (item.published_days_ago !== 0) {
        return item.published_days_ago + ' day' + (item.published_days_ago > 1 ? 's' : '') + ' ago'
      }
      else if (item.published_hours_ago !== 0) {
        return item.published_hours_ago + ' hour' + (item.published_hours_ago > 1 ? 's' : '') + ' ago'
      }
      else if (item.published_minutes_ago !== 0) {
        return item.published_minutes_ago + ' minute' + (item.published_minutes_ago > 1 ? 's' : '') + ' ago'
      }
      else {
        return item.published_seconds_ago + ' second' + (item.published_seconds_ago > 1 ? 's' : '') + ' ago'
      }
    },
    commentTyped () {

      if (this.commentText.trim().length > 0 && this.commentText.trim().length <= 350) {
        this.disableButton = false
      }
      else {
        this.disableButton = true
      }
    },
    commentAnonymous () {
      this.disableAll = true
      api.new_comment_anonymous({
        comment: this.commentText.trim(),
        postId: this.post_id
      })
        .then(res => {
          if (res.data.error === false) {
            this.$router.go(0)
          }
          else{
            console.log('Error occured while comment being created')
          }
          this.disableAll = false
        })
        .catch(err => {
          if (err) {
            console.log('Error occured while comment being created')
          }
          this.disableAll = false
        })
    },
    commentAuthenticated () {
      this.disableAll = true
      api.new_comment_authenticated({
        comment: this.commentText.trim(),
        postId: this.post_id
      })
        .then(res => {
          if (res.data.error === false) {
            this.$router.go(0)
          }
          else{
            console.log('Error occured while comment being created')
          }
          this.disableAll = false
        })
        .catch(err => {
          if (err) {
            console.log('Error occured while comment being created')
          }
          this.disableAll = false
        })
    },
    votePost (value) {
      api.vote_post({
        vote: value,
        postId: this.post_id
      })
        .then(res => {
          if (res.data.error === false) {
            api.get_post({
              postId: this.post_id
            })
              .then(res => {
                if (res.data.error === false) {
                  this.positive_vote = res.data.body.positive_vote
                  this.negative_vote = res.data.body.negative_vote
                }
              })
              .catch(err => {
                if (err) {
                  console.log('Error')
                }
              })
          }
        })
        .catch(err => {
          if (err) {
            this.$root.$emit('loginRequest')
          }
        })
    }
  }
}
</script>
