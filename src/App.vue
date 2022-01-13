<template>
  <Menubar :model="items">
    <template #end>
      <Button
        v-if="isNotOnLoginPage"
        class="p-button-danger"
        label="Salir"
        @click="onLogout"
        icon="pi pi-fw pi-power-off"
      />
    </template>
  </Menubar>
  <ConfirmDialog></ConfirmDialog>
  <Toast></Toast>
  <div class="mx-8">
    <router-view />
  </div>
</template>

<script>
import Menubar from "primevue/menubar";
import { logout } from "./utils/logout";
import ConfirmDialog from "primevue/confirmdialog";
import Toast from "primevue/toast";

export default {
  name: "App",
  components: {
    Menubar,
    ConfirmDialog,
    Toast
  },
  methods: {
    onLogout() {
      logout();
    },
  },
  data() {
    return {
      items: [
        {
          label: "Irrigators",
          icon: "pi pi-fw pi-list",
          command: () => this.$router.push("/"),
        },
        {
          label: "Issues",
          icon: "pi pi-fw pi-hashtag",
          command: () => this.$router.push("/issues"),
        },
        {
          label: "Dashboard",
          icon: "pi pi-fw pi-th-large",
          command: () => this.$router.push("/dashboard"),
        },
        {
          label: "Requests",
          icon: "pi pi-fw pi-briefcase",
          command: () => this.$router.push("/requests"),
        },
      ],
    };
  },
  computed: {
    isNotOnLoginPage() {
      return this.$route.name !== 'Login'
    },
  },
};
</script>

<style>
.p-button-success {
  background: #19dd19 !important;
  border-color: #19dd19 !important;
}

.p-button-success:hover {
  background: #18c518e3 !important;
  border-color: #18c518e3 !important;
}
#body {
  background: linear-gradient(135deg, #6ca3d6, 70%, #073f7b);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-sizing: border-box;
  min-height: 100vh;
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
