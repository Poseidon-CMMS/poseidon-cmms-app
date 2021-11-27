<template>
  <!-- Dialog -->
  <Dialog header="Equipo de riego" v-model:visible="displayDialog" :style="{width: '50vw'}">
     <p class="text-2xl font-semibold"> {{selectedIrrigator.name}}</p>   
    <template #footer>
      <Button label="No" icon="pi pi-times" @click="closeBasic" class="p-button-text"/>
      <Button label="Yes" icon="pi pi-check" @click="closeBasic" autofocus />
    </template>
  </Dialog>

  <!-- Tabla -->
  <data-table :rowHover="true" 
    :value="products" 
    v-model:selection="selectedIrrigator" 
    selectionMode="single" 
    responsiveLayout="scroll"
    @rowSelect="onRowSelect"
  >
    <template #header>
        <p class="text-2xl font-semibold">Equipos de riego</p>
    </template>
    <template #empty>
      No hay equipos encontrados.
    </template>
    <template #loading>
      Cargando datos de equipos.
    </template>
    <column field="integrationID" header="Id Equipo" :sortable="true"></column>
    <column field="name" header="Name" :sortable="true"></column>
    <column field="client" header="Client" :sortable="true"></column>
    <column field="sla" header="SLA" :sortable="true"></column>
    <column field="gtwID" header="GTW ID" :sortable="true"></column>
    <column field="nodeID" header="Node ID" :sortable="true"></column>
    <column field="modemID" header="Modem ID" :sortable="true"></column>
    <column field="isMapped" header="Mapped" :sortable="true"></column>
    <column field="zone" header="Zone" :sortable="true"></column>
    <column field="province" header="Province" :sortable="true"></column>
    <column field="city" header="City" :sortable="true"></column>
    <column field="field" header="Field" :sortable="true"></column>
    <column field="actions" header="Actions" :sortable="false" :exportable="false" style="min-width:8rem">
    <template #body="slotProps">
        <Button icon="pi pi-chart-line" class="p-button-sm p-button-rounded p-button-outlined p-button-success p-mr-2" @click="openGrafana(slotProps.data)" />
    </template>
    </column>
  </data-table>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from 'primevue/api';

export default {
  name: 'TableIrrigators',
  components: {
    DataTable,
    Column,
  },
  data() {
    return {
      displayDialog: false,
      selectedIrrigator: null,
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
    },
    onRowSelect(event) {
        this.displayDialog = true;
        console.log(event.data.integrationID);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
