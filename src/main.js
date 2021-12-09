import { createApp } from 'vue'
import App from './App.vue'

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

const app = createApp(App).use(router).use(PrimeVue);

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