<template>
  <div id="app" class="flyout">
    <mdb-navbar
      id="main-navbar"
      dark
      position="top"
      color="blue-gradient"
      style="z-index: 2050"
    >
      <mdb-navbar-brand to="/" waves class="font-weight-bold">DEUCENG</mdb-navbar-brand>
      <mdb-navbar-toggler>
        <mdb-navbar-nav left>
          <mdb-nav-item exact to="/">
            <strong>Posts</strong>
          </mdb-nav-item>
          <mdb-nav-item v-if="loggedIn == false" @click.native="showRegisterModal = false; showLoginModal = true">
            <strong>Login</strong>
          </mdb-nav-item>
          <mdb-nav-item v-if="loggedIn == false" @click.native="showLoginModal = false; showRegisterModal = true">
            <strong>Register</strong>
          </mdb-nav-item>
          <mdb-nav-item v-if="loggedIn == true" @click.native="logout()">
            <strong>Logout</strong>
          </mdb-nav-item>
        </mdb-navbar-nav>
        <mdb-navbar-nav right>
          <mdb-dropdown tag="li" class="nav-item">
            <mdb-dropdown-toggle slot="toggle" tag="a" navLink waves-fixed>
              <strong>
                <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-2.jpg" class="rounded-circle z-depth-0 md-avatar" alt="avatar image"/>
              </strong>
            </mdb-dropdown-toggle>
            <mdb-dropdown-menu mdb-dropdown-right>
              <mdb-dropdown-item>Action</mdb-dropdown-item>
              <mdb-dropdown-item>Another action</mdb-dropdown-item>
              <mdb-dropdown-item>Something else here</mdb-dropdown-item>
            </mdb-dropdown-menu>
          </mdb-dropdown>
        </mdb-navbar-nav>

      </mdb-navbar-toggler>
    </mdb-navbar>
    <main :style="{marginTop: '80px'}">
      <mdb-modal centered :show="showLoginModal" @close="showLoginModal = false; loginFormError = ''">
        <mdb-modal-header class="text-center">
          <mdb-modal-title tag="h4" bold class="w-100">Sign in</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body class="mx-3 grey-text">
          <div class="text-danger text-center">{{ this.loginFormError }}</div>
          <form id="loginForm" class="needs-validation" novalidate>
            <mdb-input label="Your username" v-model="username" icon="user" class="mb-5"/>
            <mdb-input label="Your password" v-model="password" icon="lock" type="password"/>
          </form>
        </mdb-modal-body>
        <mdb-modal-footer center>
          <mdb-btn @click.native="checkLoginForm">Login</mdb-btn>
        </mdb-modal-footer>
      </mdb-modal>
        <mdb-modal centered :show="showRegisterModal" @close="showRegisterModal = false; registrationFormError = ''; registrationFormSuccess = ''">
        <mdb-modal-header class="text-center">
          <mdb-modal-title tag="h4" bold class="w-100">Sign up</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body class="mx-3 grey-text">
          <div class="text-danger text-center">{{ this.registrationFormError }}</div>
          <div class="text-success text-center">{{ this.registrationFormSuccess }}</div>
          <form id="registerForm" class="needs-validation" novalidate>
            <mdb-input minLength="3" label="Your username" v-model="username" icon="user" class="mb-5"/>
            <mdb-input label="Your email" v-model="email" icon="envelope" type="email" class="mb-5"/>
            <mdb-input label="Your password" v-model="password" icon="lock" type="password"/>
          </form>
        </mdb-modal-body>
        <mdb-modal-footer center>
          <mdb-btn @click.native="checkRegisterForm" color="deep-orange">Sign Up</mdb-btn>
        </mdb-modal-footer>
      </mdb-modal>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </main>
    <mdb-footer color="blue-gradient">
      <p class="footer-copyright mb-0 py-3 text-center"><strong>
        &copy; {{new Date().getFullYear()}} FK</strong>
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
  mdbInput,
  mdbDropdown,
  mdbDropdownItem,
  mdbDropdownMenu,
  mdbDropdownToggle,
} from "mdbvue"

import api from "./api"
import VueCookie from "vue-cookie"

export default {
  name: "app",
  data () {
    return {
      showLoginModal: false,
      showRegisterModal: false,
      loggedIn: false,
      username: '',
      email: '',
      password: '',
      registrationFormError: '',
      registrationFormSuccess: '',
      loginFormError: '',
      re: /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]*$/,
      mailRe: /^\S+\.\S+@ceng.deu.edu.tr\b$/,
      passRe: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{6,50}$/,

    };
  },
  mounted () {
    this.$root.$on('loginRequest', () => {
      this.showLoginModal = true
    })

    api.check_authentication({
    })
      .then(res => {
        if (res.data.error === false){
          this.loggedIn = true
        }
        else {
          this.loggedIn = false
        }
      })
      .catch(err => {
        if (err) {
          this.loggedIn = false
        }
      })
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
    mdbBtn,
    mdbInput,
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle,
  },
  methods: {
    checkLoginForm () {
      if (this.username.length < 6 || this.username.length > 15 || this.password.length < 6 || this.password.length > 50) {
        this.loginFormError = 'Invalid username or password!'
        return
      }

      api.login({
        username: this.username,
        password: this.password
      })
        .then(res => {
          if(res.data.error === true && res.data.body === 'not_active'){
            this.loginFormError = 'Activation email sent, please activate your account.'
          }
          else {
            this.loggedIn = true
            this.loginFormError = ''
            this.registrationFormError = ''
            this.registrationFormSuccess = ''
            this.showLoginModal = false
            this.showRegisterModal = false
            this.username = ''
            this.password = ''
            this.email = ''
            VueCookie.set('access_token', res.data.access_token, 1)
            this.$router.go(0)
          }
        })
        .catch(err => {
          if (err) {
            this.loginFormError = 'Invalid username or password!'
          }
        })
    },
    checkRegisterForm () {
      if (this.username.length < 6 || this.username.length > 15) {
        this.registrationFormError = 'Username should be between 6-15 characters!'
        return
      }
      else if (!this.re.test(this.username)) {
        this.registrationFormError = 'Username contains invalid characters!'
        return
      }

      api.check_username({
        username: this.username
      })
        .then(res => {
          if (res.data.error === true) {
            this.registrationFormError = 'Username is already in use!'
          }
          else {
            if (!this.mailRe.test(this.email) || this.email.length >= 100) {
              this.registrationFormError = 'Email pattern should be name.surname@ceng.deu.edu.tr!'
              return
            }

            api.check_email({
              email: this.email
            })
              .then(res => {
                if (res.data.error === true) {
                  this.registrationFormError = 'Email address is already registered!'
                }
                else {
                  if (!this.passRe.test(this.password)) {
                    this.registrationFormError = 'Password should minimum 6 characters, at least one letter and one number!'
                    return
                  }
                  api.register({
                    username: this.username,
                    email: this.email,
                    password: this.password
                  })
                    .then(res => {
                      if (res.data.error === false) {
                        this.username = ''
                        this.email = ''
                        this.password = ''
                        this.registrationFormError = ''
                        this.registrationFormSuccess = 'Registration successful!'
                      }
                    })
                    .catch(err => {
                      if (err) {
                        this.registrationFormError = 'Registration failed!'
                      }
                    })
                }
              })
              .catch(err => {
                if (err) {
                  this.registrationFormError = 'Registration failed!'
                }
              })
          }
        })
        .catch(err => {
          if (err) {
            this.registrationFormError = 'Registration failed!'
          }
        })
    },
    logout () {
      VueCookie.delete('access_token')
      this.$router.go(0)
    }
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

.md-avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
}
.md-avatar.size-1 {
  width: 40px;
  height: 40px;
}
.md-avatar.size-2 {
  width: 70px;
  height: 70px;
}
.md-avatar.size-3 {
  width: 90px;
  height: 90px;
}
.md-avatar.size-4 {
  width: 110px;
  height: 110px;
}

.navbar .dropdown-menu {
  position: relative!important;
}
</style>
