<template>
  <div class="container">
    <div class="row">
      <div class="col-md-2"/>
      <div class="col-md-8">
        <div id="step-0" class="card text-center mb-4 tour step-0" title="" data-index="0" data-original-title="Welcome">
          <div class="mt-4">
            <img src="https://secure.gravatar.com/avatar/beeb7be077709846903bb8a71d272b47?s=96&amp;d=mm&amp;r=g" class="rounded-circle z-depth-1" style="width: 70px;">
          </div>
          <div id="step-3" class="card-body tour step-3" title="" data-index="3" data-original-title="3. Profile card">
            <h5 class="card-title font-weight-bold">
              <p class="text-primary">arooly</p>
            </h5>
            <p>
              <small class="text-muted">Last activity: 8 years ago</small>
            </p>
            <hr>
            <p class="badge unique-color" data-toggle="modal" data-target="#followersModal">0 Likes</p>
            <p class="badge unique-color-dark" data-toggle="modal" data-target="#followingModal">0 Dislikes</p>
            <p id="step-4" class="badge mdb-color tour step-4" title="" data-index="4" data-original-title="4. Prestige counter">27<i class="fa fa-diamond mx-1"></i>Views</p>
          </div>
        </div>
        <div class="card mb-4">
          <div class="card-header text-center">arooly's top rated posts</div>
          <div class="card-body py-2">
            <ul class="list-group list-group-flush">
              <li class="list-group-item px-0">
                <span class="badge badge-info badge-pill pull-left mr-2">
                  0<i class="fas fa-thumbs-up ml-1"></i></span>
                  <a href="/support/jquery/i-purchased-mdb-pro-recently-and-i-cant-use-the-lightbox-properly">I purchased MDB Pro recently and i cant use the lightbox properly</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="card mb-4">
          <div class="card-header text-center">arooly's last comments</div>
          <div class="card-body py-2">
            <ul class="list-group list-group-flush">
              <li class="list-group-item px-0">
                <a href="/support/jquery/i-purchased-mdb-pro-recently-and-i-cant-use-the-lightbox-properly">I purchased MDB Pro recently and i cant use the lightbox properly</a>
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
  name: 'user',
  components: {
    //  mdbBtn,
  },
  data () {
    return {
    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>
