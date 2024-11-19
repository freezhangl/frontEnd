import Vue from 'vue'
import Vuex from 'vuex'
import StoreMap from './store.config'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: StoreMap
})

export default store
