<template>
  <div class="mt-6">
  <Card style="width: 25rem; margin: auto auto">
    <template #title>
        Login
    </template>
    <template #content>
    <div class="grid p-fluid mt-2">
      <div class="col-12">
        <div class="p-field">    
        <span class="p-float-label">
          <InputText id="email" type="text" v-model="email" />
          <label for="email">Email</label>
        </span>
      </div>
      </div>
      <div class="col-12 mt-4">
        <div class="p-field p-m-4 p-p-6">    
          <span class="p-float-label">
            <password id="password" toggleMask :feedback="false" v-model="password"/>
            <label for="password">Password</label>
          </span>
        </div>
      </div>
    </div>
    </template>
    <template #footer>
      <Button icon="pi pi-check" label="Login" @click="onSubmit" :loading="loading"/>
    </template>
</Card>
    </div>
</template>

<script>
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import {loginQuery} from '../api/apiRequests';


export default {
  name: 'LoginForm',
  components: {
    InputText,
    Password
  },
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
    async onSubmit(){
      this.loading = true;
      try{
        const result = await loginQuery(this.email, this.password)
        sessionStorage.setItem('token', result.data.authenticate.sessionToken);
        sessionStorage.setItem('name',  result.data.authenticate.item.name);
        this.loading = false;
        this.$router.push('dashboard');
      }
      catch(e) {
        this.loading = false;
      }
      
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
