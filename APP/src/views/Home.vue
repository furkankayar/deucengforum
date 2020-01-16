<template>
  <div class="home">
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
import { mdbTbl, mdbTblHead, mdbTblBody, mdbBtn} from 'mdbvue';
import JwPagination from 'jw-vue-pagination';

export default {
  name: 'home',
  components: {
    mdbTbl,
    mdbTblHead,
    mdbTblBody,
    JwPagination,
    mdbBtn
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
      pageItems: []
    }
  },
  methods: {
    onChangePage (pageItems) {
      this.pageItems = pageItems
    },
    createNewTopic () {
      this.$root.$emit('loginRequest')
    }
  }
}
</script>
