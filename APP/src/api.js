'use strict'

import VueCookie from 'vue-cookie'
import axios from 'axios'
import qs from 'qs'

axios.defaults.baseURL = 'http://localhost:8000'

export default {
  async execute (method, resource, body) {
    return axios({
      method: method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${VueCookie.get('access_token')}`
      },
      url: resource,
      data: qs.stringify(body)
    })
  },
  login (data) {
    data.grant_type = 'password'
    data.client_id = 'null'
    data.client_secret = 'null'
    return this.execute('post', '/authentication/login', data)
  },
  register (data) {
    return this.execute('put', '/user/register', data)
  },
  check_email (data) {
    return this.execute('post', '/user/check_email', data)
  },
  check_username (data) {
    return this.execute('post', '/user/check_username', data)
  },
  check_authentication (data) {
    return this.execute('post', '/authentication/check_authentication', data)
  },
  new_post (data) {
    return this.execute('put', '/post/new_post', data)
  }
}
