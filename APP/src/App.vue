<template>
  <div id="app" class="flyout">
    <mdb-navbar
      id="main-navbar"
      dark
      position="top"
      color="blue"
      style="z-index: 2050"

    >
      <mdb-navbar-brand to="/" waves class="font-weight-bold">MDB Vue</mdb-navbar-brand>
      <mdb-navbar-toggler>
        <mdb-navbar-nav right>
          <mdb-nav-item exact to="/">
            <strong>Home</strong>
          </mdb-nav-item>
          <mdb-nav-item @click.native="showRegisterModal = false; showLoginModal = true">
            <strong>Login</strong>
          </mdb-nav-item>
          <mdb-nav-item @click.native="showLoginModal = false; showRegisterModal = true">
            <strong>Register</strong>
          </mdb-nav-item>
        </mdb-navbar-nav>
      </mdb-navbar-toggler>
    </mdb-navbar>
    <main :style="{marginTop: '60px'}">
      <mdb-modal centered :show="showLoginModal" @close="showLoginModal = false">
        <mdb-modal-header>
          <mdb-modal-title>Login</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>...</mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn color="primary">Login</mdb-btn>
          <mdb-btn color="secondary" @click.native="showLoginModal = false">Close</mdb-btn>
        </mdb-modal-footer>
      </mdb-modal>
      <mdb-modal centered :show="showRegisterModal" @close="showRegisterModal = false">
        <mdb-modal-header>
          <mdb-modal-title>Register</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>...</mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn color="primary">Register</mdb-btn>
          <mdb-btn color="secondary" @click.native="showRegisterModal = false">Close</mdb-btn>
        </mdb-modal-footer>
      </mdb-modal>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </main>
    <mdb-footer color="blue">
      <p class="footer-copyright mb-0 py-3 text-center">
        &copy; {{new Date().getFullYear()}} Copyright:
        <a
          href="https://mdbootstrap.com/docs/vue/?utm_source=DemoApp&utm_medium=MDBVue"
        >MDBootstrap.com</a>
      </p>
    </mdb-footer>
  </div>
</template>

<script>
import {
  mdbNavbar,
  mdbNavItem,
  mdbNavbarNav,
  mdbNavbarToggler,
  mdbNavbarBrand,
  mdbFooter,
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter,
  mdbBtn,
} from "mdbvue"

export default {
  name: "app",
  data () {
    return {
      showLoginModal: false,
      showRegisterModal: false,
    };
  },
  components: {
    mdbNavbar,
    mdbNavItem,
    mdbNavbarNav,
    mdbNavbarToggler,
    mdbNavbarBrand,
    mdbFooter,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbBtn
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');

.flyout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
}
.active {
  background-color: rgba(255, 255, 255, 0.1);
}
.demo-section {
  padding: 20px 0;
}
.demo-section > section {
  border: 1px solid #e0e0e0;
  padding: 15px;
}
.demo-section > h4 {
  font-weight: bold;
  margin-bottom: 20px;
}
.demo-title {
  color: #9e9e9e;
  font-weight: 700;
  margin-bottom: 0;
  padding-left: 15px;
}
.demo-result-section {
  position: relative;
  margin-top: -20px;
  border: 1px solid #e0e0e0;
  border-top: none;
  padding: 15px;
  padding-top: 50px;
  color: grey;
  background-color: #f8f8f8;
}
.demo-result-section:before {
  display: block;
  content: 'Result:';
  position: absolute;
  left: 0;
  top: 0;
  padding: 5px 15px;
  width: 100%;
  background-color: #e0e0e0;
  font-weight: 400;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease-out;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
