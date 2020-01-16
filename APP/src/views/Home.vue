<template>
  <div class="home">
      <mdb-modal centered :show="showPostModal" @close="showPostModal = false; postFormError = ''; postFormSuccess = ''">
        <mdb-modal-header class="text-center">
          <mdb-modal-title tag="h4" bold class="w-100">New Post</mdb-modal-title>
        </mdb-modal-header>
      <mdb-modal-body class="mx-3 grey-text">
        <div class="text-danger text-center">{{ this.postFormError }}</div>
        <div class="text-success text-center">{{ this.postFormSuccess }}</div>
        <form id="postForm" class="needs-validation" novalidate @submit="checkPostForm">
          <mdb-input v-model="topic" label="Topic" type="text"></mdb-input>
          <mdb-input v-model="content" label="Content" type="textarea" :rows="7"></mdb-input>
        </form>
      </mdb-modal-body>
      <mdb-modal-footer center>
        <mdb-btn form="postForm" gradient="aqua">Send Post</mdb-btn>
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
                  <th>Views</th>
                  <th>Answers</th>
                  <th>Votes</th>
                </tr>
              </mdb-tbl-head>
              <!--Table head-->
              <!--Table body-->
              <mdb-tbl-body>
                <tr v-for="(item, index) in pageItems" v-bind:key="index">
                  <td class="text-left">
                    <a href="https://mdbootstrap.com/support/jquery/webpack-error-cant-resolve-chart-js/" class="font-weight-bold blue-text">{{ item.topic }}</a>
                    <div>
                      <strong>{{ item.author }}</strong>
                      <span>{{ item.published }}</span>
                    </div>
                  </td>
                  <td>{{ item.view }}</td>
                  <td>{{ item.answer }}</td>
                  <td>{{ item.vote }}</td>
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
        { topic: 'jdhgfjdhjghfdkjghsjkgfshdkgjfhskfhgskjdhgkshdkgjfshdgksdhgfkd', author: 'furkan', published: 'dün', view: 0, answer: 0, vote: 0},
        { topic: 'test', author: 'furkan', published: 'dün', view: 0, answer: 0, vote: 0},
        { topic: 'test', author: 'furkan', published: 'dün', view: 0, answer: 0, vote: 0},
        { topic: 'test', author: 'furkan', published: 'dün', view: 0, answer: 0, vote: 0},
        { topic: 'test', author: 'furkan', published: 'dün', view: 0, answer: 0, vote: 0},
        { topic: 'test', author: 'furkan', published: 'dün', view: 0, answer: 0, vote: 0},
        { topic: 'test', author: 'furkan', published: 'dün', view: 0, answer: 0, vote: 0},
      ],
      pageItems: [],
      content: '',
      topic: '',
      showPostModal: false,
      postFormError: '',
      postFormSuccess: ''
    }
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
            this.postFormSuccess = 'Successful'
            this.postFormError = ''
            this.topic = ''
            this.content = ''
          }
        })
        .catch(err => {
          if (err) {
            this.postFormError = 'An error occured, try again.'
          }
        })
    }
  }
}
</script>
