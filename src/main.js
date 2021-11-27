import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';
import "primevue/resources/themes/saga-blue/theme.css";       //theme
import "primevue/resources/primevue.min.css";                 //core css
import "primeicons/primeicons.css";
import router from './router'

const app = createApp(App).use(router);

app.use(PrimeVue);

app.component('Button', Button);
app.component('Card', Card);
app.component('InputText', InputText);
app.component('Avatar', Avatar);
app.component('Dialog', Dialog);

app.mount('#app');