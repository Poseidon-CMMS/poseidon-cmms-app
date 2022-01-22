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
import ConfirmationService from 'primevue/confirmationservice';

const optionsPrimeVue =  {
    locale: {
        accept: 'Aceptar',
        reject: 'Rechazar',
        choose: 'Elegir',
        startsWith: 'Comienza con',
        contains: 'Contiene',
        notContains: 'No contiene',
        endsWith: 'Termina con',
        equals: 'Es igual a',
        notEquals: 'No es igual a',
        noFilter: 'Sin filtro',
        lt: 'Menor que',
        lte: 'Menor o igual que',
        gt: 'Mayor que',
        gte: 'Mayor o igual que',
        dateIs: 'La fecha es ',
        dateIsNot: 'La fecha no es',
        dateBefore: 'La fecha es antes de',
        dateAfter: 'La fecha es despues de',
        clear: 'Resetear',
        apply: 'Aplicar',
        matchAll: 'Matchear todos',
        matchAny: 'Matchear alguno',
        addRule: 'Agregar regla',
        removeRule: 'Eliminar regla',
        upload: 'Subir',
        cancel: 'Cancel',
        dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        dayNamesShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sáb"],
        dayNamesMin: ["Do","Lu","Ma","Mi","Ju","Vi","Sa"],
        monthNames: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
        monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        today: 'Hoy',
        weekHeader: 'Semana',
        firstDayOfWeek: 0,
        dateFormat: 'dd/mm/yy',
        weak: 'Débiñ',
        medium: 'Mediano',
        strong: 'Fuerte',
        passwordPrompt: 'Ingrese una contraseña',
        emptyFilterMessage: 'No hay resultados',
        emptyMessage: 'No hay opciones disponibles',
    }};

const app = createApp(App).use(router).use(PrimeVue, optionsPrimeVue).use(ToastService).use(ConfirmationService);

app.component('Dialog', Dialog);
app.component('Dropdown', Dropdown);
app.component('Button', Button);
app.directive('tooltip', Tooltip);

app.mount('#app');