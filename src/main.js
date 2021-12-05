/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import { createApp } from 'vue'
import App from './App.vue'

import { IonicVue } from '@ionic/vue';


import PrimeVue from 'primevue/config';
//Prime components
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';
import Splitter from 'primevue/splitter';
import Panel from 'primevue/panel';
import ScrollPanel from 'primevue/scrollpanel'; 
import Badge from 'primevue/badge'; 
import Accordion from 'primevue/accordion'; 
import AccordionTab from 'primevue/accordiontab'; 
import Dropdown from 'primevue/dropdown'; 
import Chip from 'primevue/chip'; 
import "primevue/resources/themes/saga-blue/theme.css";       //theme
import "primevue/resources/primevue.min.css";                 //core css
import "primeicons/primeicons.css";
import router from './router'
import Tooltip from 'primevue/tooltip';

const app = createApp(App).use(router).use(PrimeVue).use(IonicVue);

app.component('Button', Button);
app.component('Card', Card);
app.component('InputText', InputText);
app.component('Avatar', Avatar);
app.component('Dialog', Dialog);
app.component('Splitter', Splitter);
app.component('ScrollPanel', ScrollPanel);
app.component('Panel', Panel);
app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
app.component('Badge', Badge);
app.component('Dropdown', Dropdown);
app.component('Chip', Chip);

app.directive('tooltip', Tooltip);

app.mount('#app');