<template>
  <div class='fadein animation-duration-1000'>
    <Panel>
      <template #header>
        <p class="text-lg font-bold text-left w-10">{{ selectedRequest?.irrigator?.integration_id + ' ' + selectedRequest?.irrigator?.name + ' | ' + (selectedRequest?.request_type === 'install'? 'Instalación' : selectedRequest?.request_type === 'uninstall'? 'Desinstalación' : selectedRequest?.request_type) }}</p>
      </template>
      <!-- Lista de atributos -->
      <div class="grid mt-3">
        <div @click="clickIrrigator()" class="col-12 md:col-6 hover:surface-300">
          <div class="flex pointer align-items-center mx-2 w-full">
              <p class="text-left font-bold text-blue-500 mr-3">Equipo de riego</p>
              <div class="grid justify-content-center w-full">
                <div class="col-8">
                  <p class="text-lg">{{ selectedRequest?.irrigator?.name +' - ' + selectedRequest?.irrigator?.integration_id }}</p>
                </div>
                <div class="col-4">
                  <div class="h-full flex align-items-center">
                    <Button icon="pi pi-chevron-right" class="p-button-rounded p-button-primary" />
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 w-full">
              <p class="w-4 text-left font-bold text-blue-500 mr-3">Estado de la solicitud</p>
                <div class="grid justify-content-center w-full">
                <div class="col-8">
                  <p class="text-lg">{{
                        selectedRequest?.status === "open"? "Abierta": 
                        selectedRequest?.status === "assigned"? "Asignada": 
                        selectedRequest?.status === "done"? "Hecha": 
                        selectedRequest?.status === "completed"? "Completeada": 
                        selectedRequest?.status
                      }}</p>
                </div>
                <div class="col-3">
                  <div class="h-full flex align-items-center">
                    <i class="pi pi-history"></i>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 w-full">
              <p class="w-4 text-left font-bold text-blue-500 mr-3">Tipo de solicitud</p>
                <div class="grid justify-content-center w-full">
                <div class="col-8">
                  <p class="text-lg">{{
                        selectedRequest?.request_type === "install"? "Solicitud de instalación": 
                        selectedRequest?.request_type === "uninstall"? "Solicitud de desinstalación": 
                        selectedRequest?.request_type
                      }}</p>
                </div>
                <div class="col-3">
                  <div class="h-full flex align-items-center">
                    <i class="pi pi-history"></i>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <!-- Timestamps -->
        <div class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 w-full">
              <p class="w-4 text-left font-bold text-blue-500 mr-3">Fecha de creación</p>
                <div class="grid justify-content-center w-full">
                <div class="col-8">
                  <p class="text-lg">{{
                         dateFormatter(selectedRequest?.creation_date) 
                      }}</p>
                </div>
                <div class="col-3">
                  <div class="h-full flex align-items-center">
                    <i class="pi pi-history"></i>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 w-full">
              <p class="w-4 text-left font-bold text-blue-500 mr-3">Fecha de ejecución</p>
                <div class="grid justify-content-center w-full">
                <div class="col-8">
                  <p class="text-lg">{{
                         selectedRequest?.completion_date? dateFormatter(selectedRequest?.completion_date) : "N/A"
                      }}</p>
                </div>
                <div class="col-3">
                  <div class="h-full flex align-items-center">
                    <i class="pi pi-history"></i>
                  </div>
                </div>
              </div>
          </div>
        </div><div class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 w-full">
              <p class="w-4 text-left font-bold text-blue-500 mr-3">Fecha de cierre de la solicitud</p>
                <div class="grid justify-content-center w-full">
                <div class="col-8">
                  <p class="text-lg">{{
                         selectedRequest?.closed_date? dateFormatter(selectedRequest?.closed_date) : "N/A"
                      }}</p>
                </div>
                <div class="col-3">
                  <div class="h-full flex align-items-center">
                    <i class="pi pi-history"></i>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div v-if="selectedRequest?.gateway" class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 w-full">
              <p class="w-4 text-left font-bold text-blue-500 mr-3">Gateway instalado</p>

              <div class="flex align-items-center justify-content-evently mx-auto w-full">
                <p class="text-lg w-8">{{ selectedRequest?.gateway?.integration_id}}</p>
                <Chip :label="selectedRequest?.gateway?.pcbGateway.firmwareVersion.version" class="p-mr-2 p-mb-2 bg-green-500 text-white" />
              </div>
          </div>
        </div>
        <div v-if="selectedRequest?.gpsNode" class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 surface-border w-full">
              <p class="w-2 text-left font-bold text-blue-500 mr-3">Nodo GPS instalado</p>

              <div class="flex align-items-center justify-content-evently mx-auto w-full">
                <p class="text-lg w-8">{{ selectedRequest?.gpsNode?.integration_id}}</p>
                <Chip :label="selectedRequest?.gpsNode?.pcbNode.firmwareVersion.version" class="p-mr-2 p-mb-2 bg-green-500 text-white" />
              </div>
          </div>
        </div>
        <div v-if="selectedRequest?.pressureSensor"  class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 w-full">
              <p class="w-2 text-left font-bold text-blue-500 mr-3">Sensor de Presión instalado</p>    
              <div class="flex align-items-center justify-content-evently mx-auto w-full">
                <p class="text-lg w-8">{{ selectedRequest?.pressureSensor?.integration_id}}</p>
                <Chip :label="selectedRequest?.pressureSensor?.pressureSensorType?.name" class="p-mr-2 p-mb-2 bg-green-500 text-white" />
              </div>
          </div>
        </div>
        
        <div class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 pr-2 w-full">
            <p class="w-8 text-left font-bold text-blue-500 mr-3">Asignación</p>
            <p class="w-6 text-center">
              {{selectedRequest?.assigned_technician? selectedRequest?.assigned_technician.name : 'Ningún técnico asignado'}}
            <Button class="mr-1 p-button-warning" icon="pi pi-user" @click="handleTechnicianEdit" />
            </p>
          </div>
        </div>
        <div @click="() => alert('aca falta algo todo')" class="col-12 md:col-6 hover:surface-300">
          <div class="flex pointer align-items-center mx-2 w-full">
              <p class="text-left font-bold text-blue-500 mr-3">Órden de trabajo</p>
              <div class="grid justify-content-center w-full">
                <div class="col-8">
                  <p class="text-lg">{{ selectedRequest?.work_order?.work_date +' - ' + selectedRequest?.work_order?.comment }}</p>
                </div>
                <div class="col-4">
                  <div class="h-full flex align-items-center">
                    <Button icon="pi pi-chevron-right" class="p-button-rounded p-button-primary" />
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
  </Panel>
  </div>
</template>

<script>
import Chip from "primevue/chip";
import Panel from "primevue/panel";

import { dateFormatter } from "../../utils/dateFormatter";

export default {
  name: "RequestDetail",
  components: {
    Chip,
    Panel,
  },
  methods: {
    dateFormatter,
    hasDevice: function (value) {
      return (
        typeof value.gateway !== undefined ||
        typeof value.gpsNode !== undefined ||
        typeof value.pressureSensor !== undefined
      );
    },
    handleTechnicianEdit: function () {
      this.$emit("openAssignationDialog", true);
    },
  },
  props: ["selectedRequest", "clickIrrigator"],
  emits: ["openAssignationDialog"],
  data() {
    return {
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped>
.pointer {
  cursor: pointer;
}

.itemList {
  border: #135ba1;
}

.custom .p-scrollpanel-wrapper {
  border-right: 9px solid #f4f4f4;
}

.custom .p-scrollpanel-bar {
  background-color: #1976d2;
  opacity: 1;
  transition: background-color 0.3s;
}

.custom .p-scrollpanel-bar:hover {
  background-color: #135ba1;
}
</style>

