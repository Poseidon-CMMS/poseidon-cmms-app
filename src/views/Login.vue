<template>
  <div class="about">
    <h1>This is an login page</h1>
    <login-form />
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';

export default {
  name: 'Login',
  components: {
    LoginForm
  }
}
</script>
