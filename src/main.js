import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config';
//Prime components
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown'; 
import "primevue/resources/themes/saga-blue/theme.css";       //theme
import "primevue/resources/primevue.min.css";                 //core css
import "primeicons/primeicons.css";
import router from './router'
import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice';


const app = createApp(App).use(router).use(PrimeVue).use(ToastService);

app.component('Dialog', Dialog);
app.component('Dropdown', Dropdown);
app.component('Button', Button);
app.directive('tooltip', Tooltip);

app.mount('#app');