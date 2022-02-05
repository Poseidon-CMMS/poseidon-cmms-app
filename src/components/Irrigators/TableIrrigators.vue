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
          <Badge :value="data.hdw_issueCount?data.hdw_issueCount:'OK'" :severity="data.hdw_issueCount?'danger':'success'" class="p-mr-2"></Badge><span class="p-ml-2">{{data.name}}</span>
        </template>
    </column>
    <column field="field.client.name" header="Client" :sortable="true"></column>
    <column field="status" header="Status" :sortable="true"></column>
    <column field="sla" header="SLA" :sortable="true"></column>
    <!-- <column field="gateway.integration_id" header="GTW" :sortable="true"></column>
    <column field="gps_node.integration_id" header="Nodo" :sortable="true"></column>
    <column field="pressure_sensor.integration_id" header="Sensor de presión" :sortable="true"></column> -->
    <!-- <column field="gateway.satellite_modem.integration_id" header="Modem" :sortable="true"></column> -->
    <column field="enabled" header="Mapeado" :sortable="true"></column>
    <column field="field.zone.name" header="Zone" :sortable="true"></column>
    <column field="field.city.province.name" header="Provincia" :sortable="true"></column>
    <column field="field.city.name" header="Ciudad" :sortable="true"></column>
    <column field="field.name" header="Campo" :sortable="true"></column>
    <column field="transmission_status" header="Estado de transmisión" :sortable="true">
      <template #body="{data}">
        <span v-if="data.status=='installed'" :class="'status-badge status-' + (data.hdw_issueCount?'error':'transmitting')">{{data.hdw_issueCount?'Error':'Transmitting'}}</span>
      </template>
    </column>
    <!-- <column field="lastTransmissionDate" header="Última Tx" :sortable="true"></column> -->
    <column
      field="actions"
      header="Actions"
      :sortable="false"
      :exportable="false"
      style="min-width: 13rem"
    >
      <template #body="slotProps">
        <Button
          class="p-button-sm
            p-button-rounded
            p-button-info
            mr-1"
          icon="pi pi-map"
          @click="handleOpenMap(slotProps.data)"
        />
        <Button
          v-if="slotProps.data.status==='installed'"
          icon="pi pi-chart-line"
          class="
            p-button-sm
            p-button-rounded
            p-button-outlined
            p-button-info
            p-mr-1
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
            p-button-warning
            p-mr-1
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
            p-mr-1
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
            p-button-danger
            p-mr-1
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
import { getIrrigatorsQuery, createInstallUninstallRequestMutation } from '../../api/apiRequests';

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
      irrigators: [],
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
    confirmDialog(message, toastMessage, onAccept) {
          this.$confirm.require({
                message: message,
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: async () => {
                    await onAccept();
                },
                reject: () => {
                    this.$toast.add({severity:'warn', summary:'Cancelada', detail:'Acción cancelada', life: 3000});
                }
            });
        },
    createInstallRequest(irrigator) {
      this.confirmDialog(
        `¿Desea crear una solicitud de instalación para el equipo ${irrigator.integration_id}?`,
        `Solicitud de instalación creada para el ${irrigator.integration_id}`,
        () => this.onRequestInstallCreation(irrigator));
    },
    async onRequestInstallCreation(irrigator) {
      this.loading = true;
      await this.createRequest(irrigator, 'install');
      this.loading = false;
    },
    createUninstallRequest(irrigator) {
      this.confirmDialog(
        `¿Desea crear una solicitud de desinstalación para el equipo ${irrigator.integration_id}?`,
        `Solicitud de desinstalación creada para el ${irrigator.integration_id}`,
        () => this.onRequestUninstallCreation(irrigator));
    },
    async onRequestUninstallCreation(irrigator) {
      this.loading = true;
      await this.createRequest(irrigator, 'uninstall');
      this.loading = false;
    },
    async createRequest(irrigator, type) {
        const result = await createInstallUninstallRequestMutation(new Date(), irrigator.id, type);

        const createdRequest = result.data.createinstall_uninstall_request;

        if (createdRequest.id) {
          this.$toast.add(
            {
              severity:'success',
              summary:'Solicitud creada',
              detail: `Se creó una solicitud de ${type === 'install' ? 'instalación' : 'desinstalación' } para el equipo ${createdRequest.irrigator.integration_id}`,
              life: 3000
            });
          this.$router.push('/requests');
        }
        else {
          this.$toast.add({severity:'error', summary:'Fallo al crear la solicitud', detail: `Ocurrió un error al crear una solicitud para el equipo ${createdRequest.irrigator.integration_id}`, life: 3000});
        }
    },
    handleOpenMap(irrigator){
      const {lat, long} = irrigator;
      const link = `http://www.google.com/maps/place/${lat},${long}`;
      window.open(link, '_blank');
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
