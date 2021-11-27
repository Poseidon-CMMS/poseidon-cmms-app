<template>
  <div class="grid mt-3 mb-5">
    <div class="col">
      <metric-card 
        titleCard="Issues no asignados"
        color="bg-yellow-400"
        contentCard="23"
        comments="hoy"
        colorComments="2 nuevos"
        icon="pi pi-exclamation-circle"
      />
    </div>
    <div class="col">
      <metric-card 
        titleCard="Sin diagnóstico"
        color="bg-green-400"
        contentCard="11"
        comments="de hoy"
        colorComments="1 equipo"
        icon="pi pi-question-circle"
      />
    </div>
    <div class="col">
      <metric-card 
        titleCard="Autopsia"
        color="bg-purple-400"
        contentCard="2"
        comments="de la última autopsia"
        colorComments="2 meses"
        icon="pi pi-hashtag"
      />
    </div>  
  </div>
  <table-irrigators />
</template>

<script>
import MetricCard from '../components/MetricCard.vue';
import { FilterMatchMode } from 'primevue/api';

import TableIrrigators from '../components/TableIrrigators.vue'; 
export default {
  name: 'Dashboard',
  components: {
    MetricCard,
    TableIrrigators
  },
  data() {
    return {
      filters: {
         'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
         },
      products: [
        {
            integrationID:'EQ123', 
            name: 'El aleman',
            client: 'Humus SRL',
            sla: '2',
            gtwID: 'GTW 231',
            nodeID: 'Node 124',
            modemID: 'Modem 1230',
            isMapped: true,
            zone: 'Norte semiarido',
            province: 'San juan',
            city: 'City Bell',
            field: 'El campo 1',
            urlGrafana: 'http://google.com'
        }, 
        {
            integrationID:'EQ456',
            name: 'El zapallo',
            client: 'Miguel SA',
            sla: '2',
            gtwID: 'GTW 531',
            nodeID: 'Node 124',
            modemID: 'Modem asdasdoqw',
            isMapped: true,
            zone: 'Norte semiarido',
            province: 'Salta',
            city: 'City Bell',
            field: 'El campo 2',
            urlGrafana: 'http://youtube.com'
        },
        {
            integrationID:'EQ789',
            name: 'Tia Norma',
            client: 'Lucas SRL',
            sla: '1 (48hs)',
            gtwID: 'GTW 332',
            nodeID: 'Node 225',
            modemID: 'SKY238742378432642',
            isMapped: true,
            zone: 'Patagonia',
            province: 'Chubut',
            city: 'City Bell',
            field: 'El campo 1',
            urlGrafana: 'http://fi.mdp.edu.ar'
        }
    ]
    }
  },
  methods: {
    openGrafana(data){
      console.log(data);
      window.open(data.urlGrafana, '_blank').focus();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
