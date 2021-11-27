<template>
  
  <Menubar :model="items" />
  <router-view/>
</template>

<script>
  import Menubar from 'primevue/menubar';


export default {
  name: 'App',
  components: {
    Menubar
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
                },
                 {
                   label:'Logout',
                   icon:'pi pi-fw pi-power-off',
                   command: () => this.$router.push('/login')
                }
             ]
        }
    }
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
