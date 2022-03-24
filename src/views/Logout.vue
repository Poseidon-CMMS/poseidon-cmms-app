<template>
  <div></div>
</template>

<script>
export default {
  name: 'Logout',
  components: {
  },
  beforeCreate() {
    this.$store.commit('setUser',null);
    this.$router.push("/login");
  },
}
</script>
