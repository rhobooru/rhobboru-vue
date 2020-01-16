import Vue from 'vue'
import {Vue2Storage} from 'vue2-storage'

Vue.use(Vue2Storage, {
  prefix: 'app_',
  driver: 'local',
  ttl: 1000 * 60 * 60 * 24 * 7 // 7 days
})