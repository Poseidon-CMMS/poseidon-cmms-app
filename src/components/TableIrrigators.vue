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
      <p class="text-2xl font-semibold">Equipos de riego</p>
    </template>
    <template #empty> 
      <div class="flex align-items-center border-bottom-1 surface-border surface-overlay w-full">
        <p class="text-2xl w-">Empty data.</p>
      </div>
    </template>
    <template #loading> 
      <div class="flex align-items-center border-bottom-1 surface-border surface-overlay w-full">
        <p class="text-2xl w-10">Loading data...</p>
      </div>  
    </template>
    <column field="integrationID" header="Id Equipo" :sortable="true"></column>
    <column field="name" header="Name" :sortable="true"></column>
    <column field="field.client.name" header="Client" :sortable="true"></column>
    <column field="status" header="Status" :sortable="true"></column>
    <column field="sla" header="SLA" :sortable="true"></column>
    <column field="gateway.integrationId" header="GTW ID" :sortable="true"></column>
    <column field="gpsNode.integrationId" header="Node ID" :sortable="true"></column>
    <column field="pressureSensor.manufacturerId" header="Pressure Sensor ID" :sortable="true"></column>
    <column field="gateway.satelliteModem.manufacturerId" header="Modem ID" :sortable="true"></column>
    <column field="isMapped" header="Mapped" :sortable="true"></column>
    <column field="field.zone.name" header="Zone" :sortable="true"></column>
    <column field="field.province.name" header="Province" :sortable="true"></column>
    <column field="field.city.name" header="City" :sortable="true"></column>
    <column field="field.name" header="Field" :sortable="true"></column>
    <column field="transmissionStatus" header="Transmission Status" :sortable="true">
      <template #body="{data}">
        <span :class="'status-badge status-' + data.transmissionStatus">{{data.transmissionStatus}}</span>
      </template>
    </column>
    <column field="lastTransmissionDate" header="Last Tx" :sortable="true"></column>
    <column
      field="actions"
      header="Actions"
      :sortable="false"
      :exportable="false"
      style="min-width: 8rem"
    >
      <template #body="slotProps">
        <Button
          icon="pi pi-chart-line"
          class="
            p-button-sm
            p-button-rounded
            p-button-outlined
            p-button-success
            p-mr-2
          "
          v-tooltip="'Open Grafana'"
          @click="openGrafana(slotProps.data)"
        />
      </template>
    </column>
  </data-table>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Message from "primevue/message";
import { FilterMatchMode } from "primevue/api";
import IrrigatorDetailsDialog from './IrrigatorDetailsDialog.vue';
import { getIrrigatorsQuery } from '../api/apiRequests';

export default {
  name: "TableIrrigators",
  components: {
    DataTable,
    Column,
    IrrigatorDetailsDialog,
    Message
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
    }
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
