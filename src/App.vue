<template>
  <Menubar :model="items">
    <template #end>
      <div class="flex w-8">
        <div class="flex-1 flex align-items-center justify-content-center mx-6 my-0">
          <p class="text-xl font-semibold text-white text-right" style="width: 20vw">
            POSEIDON CMMS
          </p>
        </div>
        <div class="flex-1 flex align-items-center justify-content-center">
          <Button
            v-if="isNotOnLoginPage"
            class="p-button-danger"
            label="Salir"
            @click="onLogout"
            icon="pi pi-fw pi-power-off"
          />
        </div>
      </div>
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
    Toast,
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
          label: "Dashboard",
          icon: "pi pi-fw pi-th-large",
          command: () => this.$router.push("/dashboard"),
        },
        {
          label: "Irrigators",
          icon: "pi pi-fw pi-mobile",
          command: () => this.$router.push("/"),
        },
        {
          label: "Issues",
          icon: "pi pi-fw pi-exclamation-triangle",
          command: () => this.$router.push("/issues"),
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
      return this.$route.name !== "Login";
    },
  },
};
</script>

<style>
.p-menubar {
  background: #384444 !important;
  border-color: #384444 !important;
}

.p-menuitem {
  font-size: 20px !important;
  color: #ffffff !important;
}

.p-menuitem-text {
  color: #ffffff !important;
}

.p-menuitem-icon {
  color: #ffffff !important;
}

.p-button-warning {
  background: #ffdf2be3 !important;
  color: #070707 !important;
  border-color: #ffdf2be3 !important;
}

.p-button-success {
  background: #107510e3 !important;
  border-color: #107510e3 !important;
}

.p-button-warning:hover {
  background: #ffd900e3 !important;
  border-color: #ffd900e3 !important;
}

.p-button-success:hover {
  background: #149b14e3 !important;
  border-color: #149b14e3 !important;
}

.p-menuitem-link:hover {
  background: #48a4da !important;
}

#body {
  background: linear-gradient(135deg, #7b99b4, 70%, #666f75);
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
