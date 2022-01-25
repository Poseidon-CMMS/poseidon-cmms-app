<template>
  <div class="mt-6">
    
      <form id="login-form" @submit.prevent="onSubmit(!v$.$invalid)" class="">
  <Card style="margin: auto auto"
  class="lg:w-4">
    <template #title>
        Login
    </template>
    <template #content>
    <div class="grid p-fluid mt-2">
      
      <div class="col-12">
        <div class="p-field">    
        <span class="p-float-label">
          <InputText id="email" type="text" v-model="email" @keypress="keyPressed"/>
          <label for="email">Email</label>
          <div><small v-if="(v$.email.$invalid && submitted) || v$.email.$pending.$response" class="p-error">{{v$.email.required.$message.replace('Value', 'Email')}}</small></div>

        </span>
      </div>
      </div>
      <div class="col-12 mt-4">
        <div class="p-field p-m-4 p-p-6">    
          <span class="p-float-label">
            <password id="password" toggleMask :feedback="false" v-model="password" @keypress="keyPressed"/>
            <label for="password">Password</label>
            <div><small v-if="(v$.password.$invalid && submitted) || v$.password.$pending.$response" class="p-error">{{v$.password.required.$message.replace('Value', 'Contraseña')}}</small></div>

          </span>
        </div>
      </div>  
      <div class="col-12" v-if="!!error">
        <Message severity="error" @close="onErrorClose">Error de login, revise sus credenciales o el estado del backend</Message>
      </div>
    </div>
    </template>
    <template #footer>
      <Button icon="pi pi-check" label="Login" 
          form="login-form"
          type="submit" :loading="loading"/>
    </template>
</Card>

      </form>
    </div>
</template>

<script>
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Card from 'primevue/card';
import {loginQuery} from '../../api/apiRequests';
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";


export default {
  name: 'LoginForm',
  components: {
    InputText,
    Password,
    Message,
    Card
  },
  props: {
    msg: String
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
        email: {
            required
        },
        password: {
            required
        },
    }
  },
  data() {
      return {
          email:'',
          password:'',
          loading: false,
          error: '',
          submitted: false,
      }
  },
  methods: {
    async onSubmit(isFormValid) {
      this.submitted = true;
      if(!isFormValid) return;
      this.loading = true;
      try{
        const result = await loginQuery(this.email, this.password);
        this.$store.commit('setUser', {...result.data.authenticate.item});
        this.loading = false;
        this.$router.push('/');
      }
      catch(e) {
        this.loading = false;
        this.error = e;
      }
      
    },
    onErrorClose(){
      this.error = ''
    },
    keyPressed(event) {
      if (event.keyCode == 13) {
        this.onSubmit();
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
