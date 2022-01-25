import { createStore } from 'vuex'// Create a new store instance.

export const store = createStore({
  state () {
    return {
      user: null
    }
  },
  mutations: {
    setUser (state, user) {
      state.user = user;
    }
  }
})