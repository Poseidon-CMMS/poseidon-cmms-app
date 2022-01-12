<template>
  <!-- Dialog -->
  <IrrigatorDetailsDialog :isOpen="displayDialog" :irrigator="selectedIrrigator" @updateIsOpen="handleIsOpenChange"></IrrigatorDetailsDialog>

  <!-- Tabla -->
  <Message v-if="!!error" severity="error" @close="onErrorClose">{{error}}</Message>
  <data-table
    :rowHover="true"
    :loading="loading"
    :value="irrigators"
    v-model:selection="selectedIrrigator"
    selectionMode="single"
    responsiveLayout="scroll"
    @rowSelect="onRowSelect"
  >
    <template #header>
      <p class="text-2xl font-semibold m-0">Equipos de riego</p>
    </template>
    <template #empty> 
      <div class="flex align-items-center border-bottom-1 surface-border surface-overlay w-full">
        <p class="text-2xl w-">Sin datos de equipos.</p>
      </div>
    </template>
    <template #loading> 
      <div class="flex align-items-center border-bottom-1 surface-border surface-overlay w-full">
        <p class="text-2xl w-10">Cargando datos...</p>
      </div>  
    </template>
    <column field="integration_id" header="Id equipo" :sortable="true"></column>
    <column field="name" header="Name" :sortable="true">
      <template #body="{data}">
          <Badge :value="data.hdwIssueCount?data.hdwIssueCount:'OK'" :severity="data.hdwIssueCount?'danger':'success'" class="p-mr-2"></Badge><span class="p-ml-2">{{data.name}}</span>
        </template>
    </column>
    <column field="field.client.name" header="Client" :sortable="true"></column>
    <column field="status" header="Status" :sortable="true"></column>
    <column field="sla" header="SLA" :sortable="true"></column>
    <column field="gateway.integration_id" header="GTW" :sortable="true"></column>
    <column field="gps_node.integration_id" header="Nodo" :sortable="true"></column>
    <column field="pressure_sensor.integration_id" header="Sensor de presión" :sortable="true"></column>
    <column field="gateway.satelliteModem.integration_id" header="Modem" :sortable="true"></column>
    <column field="isMapped" header="Mapeado" :sortable="true"></column>
    <column field="field.zone.name" header="Zone" :sortable="true"></column>
    <column field="field.province.name" header="Provincia" :sortable="true"></column>
    <column field="field.city.name" header="Ciudad" :sortable="true"></column>
    <column field="field.name" header="Campo" :sortable="true"></column>
    <column field="transmission_status" header="Estado de transmisión" :sortable="true">
      <template #body="{data}">
        <span :class="'status-badge status-' + data.transmissionStatus">{{data.transmissionStatus}}</span>
      </template>
    </column>
    <column field="lastTransmissionDate" header="Última Tx" :sortable="true"></column>
    <column
      field="actions"
      header="Actions"
      :sortable="false"
      :exportable="false"
      style="min-width: 10rem"
    >
      <template #body="slotProps">
        <Button
          v-if="slotProps.data.status==='installed'"
          icon="pi pi-chart-line"
          class="
            p-button-sm
            p-button-rounded
            p-button-outlined
            p-button-success
            p-mr-2
          "
          v-tooltip="'Abrir Grafana'"
          style="margin-right: 0.5em"
          @click="openGrafana(slotProps.data)"
        />
        <Button
          v-if="slotProps.data.status==='installed'"
          icon="pi pi-exclamation-triangle"
          class="
            p-button-sm
            p-button-rounded
            p-button-outlined
            p-button-danger
            p-mr-2
          "
          v-tooltip="'Crear Hdw Issue'"
          style="margin-right: 0.5em"
          @click="createHdwIssue(slotProps.data)"
        />
        <Button
          v-if="slotProps.data.status==='no-telemetry'"
          icon="pi pi-user-plus"
          class="
            p-button-sm
            p-button-rounded
            p-button-outlined
            p-button-success
            p-mr-2
          "
          v-tooltip="'Crear solicitud de instalación'"
          style="margin-right: 0.5em"
          @click="createInstallRequest(slotProps.data)"
        />
        <Button
          v-if="slotProps.data.status==='installed'"
          icon="pi pi-user-minus"
          class="
            p-button-sm
            p-button-rounded
            p-button-outlined
            p-button-danger
            p-mr-2
          "
          v-tooltip="'Crear solicitud de desintalación'"
          @click="createUninstallRequest(slotProps.data)"
        />
      </template>
    </column>
  </data-table>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Message from "primevue/message";
import Badge from 'primevue/badge';

import { FilterMatchMode } from "primevue/api";
import IrrigatorDetailsDialog from './IrrigatorDetailsDialog.vue';
import { getIrrigatorsQuery } from '../../api/apiRequests';

export default {
  name: "TableIrrigators",
  components: {
    DataTable,
    Column,
    Message,
    IrrigatorDetailsDialog,
    Badge,
  },
  data() {
    return {
      error: '',
      loading: true,
      displayDialog: false,
      selectedIrrigator: null,
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      irrigators: [
        // {
        //   integrationID: "EQ123",
        //   name: "El aleman",
        //   client: "Humus SRL",
        //   sla: "2",
        //   gtwID: "GTW 231",
        //   nodeID: "Node 124",
        //   modemID: "Modem 1230",
        //   isMapped: true,
        //   zone: "Norte semiarido",
        //   province: "San juan",
        //   city: "City Bell",
        //   field: "El campo 1",
        //   urlGrafana: "http://google.com",
        //   transmissionStatus: 'transmitting',
        //   lastTransmissionDate: '2021-07-10'
        // },
        // {
        //   integrationID: "EQ456",
        //   name: "El zapallo",
        //   client: "Miguel SA",
        //   sla: "2",
        //   gtwID: "GTW 531",
        //   nodeID: "Node 124",
        //   modemID: "Modem asdasdoqw",
        //   isMapped: true,
        //   zone: "Norte semiarido",
        //   province: "Salta",
        //   city: "City Bell",
        //   field: "El campo 2",
        //   urlGrafana: "http://youtube.com",
        //   transmissionStatus: 'error',
        //   lastTransmissionDate: '2021-10-10'
        // },
        // {
        //   integrationID: "EQ789",
        //   name: "Tia Norma",
        //   client: "Lucas SRL",
        //   sla: "1 (48hs)",
        //   gtwID: "GTW 332",
        //   nodeID: "Node 225",
        //   modemID: "SKY238742378432642",
        //   isMapped: true,
        //   zone: "Patagonia",
        //   province: "Chubut",
        //   city: "City Bell",
        //   field: "El campo 1",
        //   urlGrafana: "http://fi.mdp.edu.ar",
        //   transmissionStatus: 'noTelemetry',
        //   lastTransmissionDate: '2021-10-10'
        // },
      ],
    };
  },
  methods: {
    openGrafana(data) {
      window.open(data.urlGrafana, "_blank").focus();
    },
    onRowSelect() {
      this.displayDialog = true;
    },
    handleIsOpenChange(value) {
      this.displayDialog = value;
    },
    createHdwIssue(data) {
      this.$router.push(`/issues/create/${data.id}`)
    },
    createInstallRequest(data) {
      alert('Funcionalidad pendiente!', data);
    },
    createUninstallRequest(data) {
      alert('Funcionalidad pendiente!', data);
    },
  },
  async mounted(){
    try{
    const result = await getIrrigatorsQuery();
    this.irrigators = result.data.irrigators;
    this.loading = false;
    }
    catch(e){
      this.error = e;
      this.irrigators = [];
      this.loading = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .status-badge {
          border-radius: 2px;
          padding: .25em .5rem;
          text-transform: uppercase;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: .3px;
  }
  .status-badge.status-transmitting {
        background-color: #C8E6C9;
        color: #256029;
    }

  .status-badge.status-error{
      background-color: #FFCDD2;
      color: #C63737;
  }

  .status-badge.status-noTelemetry {
      background-color: #B3E5FC;
      color: #23547B;
  }
</style>
