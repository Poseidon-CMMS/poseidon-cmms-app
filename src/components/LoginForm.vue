<template>
  <Card style="width: 25rem; margin: auto auto">
    <template #title>
        Login
    </template>
    <template #content>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
        quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
    </template>
    <template #footer>
      <Button icon="pi pi-check" label="Login" @click="onSubmit" :loading="loading"/>
        <Button icon="pi pi-times" label="Cancel" class="p-button-secondary" style="margin-left: .5em" :loading="loading"/>
    </template>
</Card>
</template>

<script>
export default {
  name: 'LoginForm',
  props: {
    msg: String
  },
  data() {
      return {
          email:'',
          password:'',
          loading: false
      }
  },
  methods: {
    onSubmit(){
      this.loading = true;
      console.log(this.email);
      console.log('aaaaa');
      setTimeout(() => { //simula login
        this.loading = false;
        this.$router.push('dashboard');
      }, 2000);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
