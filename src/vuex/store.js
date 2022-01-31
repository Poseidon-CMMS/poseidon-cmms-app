import { createStore } from 'vuex'// Create a new store instance.

export const store = createStore({
  state () {
    return {
      user: JSON.parse(localStorage.getItem('user')) || null
    }
  },
  mutations: {
    setUser (state, user) {
      state.user = user;
      localStorage.setItem('user',JSON.stringify(user));
    }
  }
})