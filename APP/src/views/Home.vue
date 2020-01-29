<template>
  <div class="home">
      <mdb-modal centered :show="showPostModal" @close="showPostModal = false; postFormError = ''; postFormSuccess = ''">
        <mdb-modal-header class="text-center">
          <mdb-modal-title tag="h4" bold class="w-100">New Post</mdb-modal-title>
        </mdb-modal-header>
      <mdb-modal-body class="mx-3 grey-text">
        <div class="text-danger text-center">{{ this.postFormError }}</div>
        <div class="text-success text-center">{{ this.postFormSuccess }}</div>
        <form id="postForm" class="needs-validation" novalidate>
          <mdb-input v-model="topic" label="Topic" type="text"></mdb-input>
          <mdb-input v-model="content" label="Content" type="textarea" :rows="7"></mdb-input>
        </form>
      </mdb-modal-body>
      <mdb-modal-footer center>
        <mdb-btn @click.native="checkPostForm" gradient="aqua">Send Post</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <div class="container-fluid">
    <div class="row">
      <div class="col-md-3"/>
      <div class="col-md-6">
        <div class="card-body">
          <div class="text-right">
            <mdbBtn gradient="blue" icon="plus" size="sm" mdbWavesEffect @click.native="createNewTopic">New Topic</mdbBtn>
          </div>
          <div class="table-responsive">
            <mdb-tbl hover :pagination = "true">
              <!--Table head-->
              <mdb-tbl-head>
                <tr>
                  <th class="text-left">Topic</th>
                  <th class="text-center">Views</th>
                  <th class="text-center">Answers</th>
                </tr>
              </mdb-tbl-head>
              <!--Table head-->
              <!--Table body-->
              <mdb-tbl-body>
                <tr v-for="(item, index) in pageItems" v-bind:key="index">
                  <td class="text-left">
                    <a v-on:click="redirect(item.post_id)" class="font-weight-bold blue-text">{{ item.topic }}</a>
                    <div>
                      <strong>{{ item.author }}</strong>
                      <span>{{ printDate(item) }}</span>
                    </div>
                  </td>
                  <td class="text-center">{{ item.view }}</td>
                  <td class="text-center">{{ item.answer }}</td>
                </tr>
              </mdb-tbl-body>
              <!--Table body-->
            </mdb-tbl>
          </div>
          <div class="card-footer pb-0 pt-3 text-center">
            <jw-pagination :items="items" @changePage="onChangePage"></jw-pagination>
        </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import NavbarPage from '@/components/NavbarPage.vue'
import {
  mdbTbl,
  mdbTblHead,
  mdbTblBody,
  mdbBtn,
  mdbInput,
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter
} from 'mdbvue';
import JwPagination from 'jw-vue-pagination';
import api from '../api';

export default {
  name: 'home',
  components: {
    mdbTbl,
    mdbTblHead,
    mdbTblBody,
    JwPagination,
    mdbBtn,
    mdbInput,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter
  },
  data () {
    return {
      items: [
      ],
      pageItems: [],
      content: '',
      topic: '',
      showPostModal: false,
      postFormError: '',
      postFormSuccess: ''
    }
  },
  mounted () {
    api.get_posts({})
      .then(res => {
        if (res.data.error === false) {
          this.items = res.data.body
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    onChangePage (pageItems) {
      this.pageItems = pageItems
    },
    createNewTopic () {
      api.check_authentication({
      })
        .then(res => {
          if (res.data.error === false && res.data.body === "success") {
            this.showPostModal = true
          }
        })
        .catch(err => {
          if (err) {
            this.$root.$emit('loginRequest')
          }
        })
    },
    checkPostForm () {
      this.topic = this.topic.trim()
      this.content = this.content.trim()

      if(this.topic.length === 0 || this.content.length === 0) {
        this.postFormError = 'Empty topic and content are not allowed!'
        return
      }

      api.new_post({
        topic: this.topic,
        content: this.content
      })
        .then(res => {
          if (res.data.error === false) {
            this.postFormError = ''
            this.topic = ''
            this.content = ''
            this.$router.push('/post/' + res.data.body.post_id)
          }
        })
        .catch(err => {
          if (err) {
            this.postFormError = 'An error occured, try again.'
          }
        })
    },
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
      else if (item.published_seconds_ago !== 0) {
        return item.published_seconds_ago + ' second' + (item.published_seconds_ago > 1 ? 's' : '') + ' ago'
      }
    },
    redirect (post_id) {
      this.$router.push('/post/' + post_id)
    }
  }
}
</script>
