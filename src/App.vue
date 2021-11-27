<template>
  
  <Menubar :model="items"> 
    <template #end>
        <!-- <div v-if="isLoggedIn()"> -->
          <Button class="p-button-danger" label="Logout" @click='onLogout' icon="pi pi-fw pi-power-off"/>
        <!-- </div> -->
    </template>
  </Menubar>

  <router-view/>
</template>

<script>
  import Menubar from 'primevue/menubar';

export default {
  name: 'App',
  components: {
    Menubar
  },
  beforeMount() {
    if (!sessionStorage.getItem('token')) {
      this.$router.replace('/login')
    } 
  }, 
  beforeUpdate() {
    if (!sessionStorage.getItem('token')) {
      this.$router.replace('/login');
    }
  },
  methods: {
    onLogout() {
      sessionStorage.removeItem('name');
      sessionStorage.removeItem('token');
      this.$router.push('/login')
    }
  },
  data() {
        return {
            items: [
                {
                   label:'Home',
                   icon:'pi pi-fw pi-home',
                   command: () => this.$router.push('/')
                },
                {
                   label:'About',
                   icon:'pi pi-fw pi-power-off',
                   command: () => this.$router.push('/about')
                },
                {
                   label:'Dashboard',
                   icon:'pi pi-fw pi-th-large',
                   command: () => this.$router.push('/dashboard')
                }
             ]
        }
    },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
