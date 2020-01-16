<template>
  <div class="home">
    <div class="row">
      <div class="col-md-2"/>
      <div class="col-md-8">
        <div class="question-card card mb-4">
          <div class="card-header forum-card-img-30 d-flex justify-content-between">
            <p class="pt-2 mb-0">
              <img src="https://secure.gravatar.com/avatar/62c9c125499e280d7f96a75e939f3046?s=96&amp;d=mm&amp;r=g" alt="" class="rounded-circle mr-2">
              <strong><a href="https://mdbootstrap.com/profile/?id=35406" target="_blank">fredemagi</a></strong>
              asked 2 years ago
            </p>
            <div>
              <a href="#" type="button" class="btn btn-outline-dark-green btn-sm px-2 waves-effect show_login">
                <span class="value">1</span>
                <i class="far fa-thumbs-up ml-1"></i>
              </a>
              <a href="#" type="button" class="btn btn-outline-danger btn-sm px-2 waves-effect show_login">
                <span class="value">0</span>
                <i class="far fa-thumbs-down ml-1"></i>
              </a>
            </div>
          </div>
          <!--Card content-->
          <div class="card-body">
            Does mdboostrap support or supply any forum template like this support forum?                                                                    <hr>
            <!-- Comments -->
            <div class="comment-card ml-5">                                                                                                                                                                                                  <!-- Single comment -->
              <small class="comment-item text-muted">
                <p class="mb-2">
                <strong><a href="https://mdbootstrap.com/profile/?id=72880" target="_blank">myusername</a></strong>
                commented 5 months ago                                                                                                    </p>
                <p>My test comment is here </p>
              </small>
              <hr>
              <small class="comment-item text-muted">
                <p class="mb-2">
                <strong><a href="https://mdbootstrap.com/profile/?id=83707" target="_blank">Anderson Eichler</a></strong>
                commented 2 months ago                                                                                                    </p>
                <p>sdasdadsaaaaaaaaaaaa</p>
              </small>
              <div>
                <form class="px-1 mt-4">

                <!-- Comment -->
                <div class="form-group">
                  <label for="replyFormComment">Your comment</label>
                  <textarea class="form-control" id="replyFormComment" rows="5"></textarea>
                </div>

                <div class="text-center mt-4">
                  <mdb-btn color="primary" size="md">Post</mdb-btn>
                  <mdb-btn color="secondary" size="md">Post Anonymous</mdb-btn>
                </div>

                </form>

              </div>
            </div>
          </div>
        </div>
        <!--<section>
          <mdb-card-header class="border-0 font-weight-bold d-flex justify-content-between">
            <p class="mr-4 mb-0">About the author</p>
            <ul class="list-unstyled list-inline mb-0">
              <li class="list-inline-item"><a href="" class="mr-3"><mdb-icon icon="envelope" class="mr-1" />Send message</a></li>
              <li class="list-inline-item"><a href="" class="mr-3"><mdb-icon icon="user" class="mr-1" />See profile</a></li>
              <li class="list-inline-item"><a href="" class="mr-3"><mdb-icon icon="rss" class="mr-1" />Follow</a></li>
            </ul>
          </mdb-card-header>
          <mdb-media class="mt-4 px-1">
            <img class="card-img-100 d-flex z-depth-1 mr-3" src="https://mdbootstrap.com/img/Photos/Avatars/img%20(8).jpg" alt="Generic placeholder image">
            <mdb-media-body>
              <h5 class="font-weight-bold mt-0">
                <a href="">Danny Newman</a>
              </h5>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod consectetur accusamus velit nostrum et magnam.
            </mdb-media-body>
          </mdb-media>
        </section>-->
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

export default {
  name: 'post',
  components: {
    mdbBtn,
  }
}
</script>
