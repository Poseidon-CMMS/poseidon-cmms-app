import { createStore } from 'vuex'// Create a new store instance.

export const store = createStore({
  state () {
    return {
      user: JSON.parse(sessionStorage.getItem('user')) || null
    }
  },
  mutations: {
    setUser (state, user) {
      state.user = user;
      sessionStorage.setItem('user',JSON.stringify(user));
    }
  }
})