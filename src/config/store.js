import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: null
    },
    mutations: {
        setUser(state, user) {
            state.user = user
            if(user) {
                axios.defaults.headers.common['Authorization'] = `bearer ${user.token}`
                if(user.data_prova) {
                    state.user.isFaculdade = true
                } else {
                    state.user.isFaculdade = false
                }
            } else {
                delete axios.defaults.headers.common['Authorization']
            }
        },
    }
})