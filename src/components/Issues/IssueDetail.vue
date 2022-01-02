<template>  
  <div class='fadein animation-duration-1000' v-if="selectedIssue">
    <Panel>
      <template #header>
        <p class="text-lg font-bold text-left w-10">{{ selectedIssue.comment }}</p>
      </template>
      <!-- Lista de atributos -->
      <div class="grid mt-3">
        <div @click="clickIrrigator()" class="col-12 md:col-6 hover:surface-300">
          <div class="flex pointer align-items-center mx-2 w-full">
              <p class="text-left font-bold text-blue-500 mr-3">Equipo de riego</p>
              <div class="grid justify-content-center w-full">
                <div class="col-8">
                  <p class="text-lg">{{ selectedIssue?.irrigator?.name +' - ' + selectedIssue?.irrigator?.integration_id }}</p>
                </div>
                <div class="col-4">
                  <div class="h-full flex align-items-center">
                    <Button icon="pi pi-chevron-right" class="p-button-rounded p-button-primary" />
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div v-if="selectedIssue.TTR"  class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 surface-border surface-hover w-full">
              <p class="w-2 text-left font-bold text-blue-500 mr-3">TTR</p>
              <div class="grid justify-content-center w-full">
                <div class="col-8">
                  <p class="text-lg">{{ selectedIssue.TTR }}</p>
                </div>
                <div class="col-3">
                  <div class="h-full flex align-items-center">
                    <i class="pi pi-history"></i>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div v-if="selectedIssue.downtime" class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 w-full">
              <p class="w-4 text-left font-bold text-blue-500 mr-3">Downtime</p>
                <div class="grid justify-content-center w-full">
                <div class="col-8">
                  <p class="text-lg">{{ selectedIssue.downtime + ' h'}}</p>
                </div>
                <div class="col-3">
                  <div class="h-full flex align-items-center">
                    <i class="pi pi-history"></i>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div v-if="selectedIssue.gateway" class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 w-full">
              <p class="w-4 text-left font-bold text-blue-500 mr-3">Dispositivo</p>

              <div class="flex align-items-center justify-content-evently mx-auto w-full">
                <p class="text-lg w-8">{{ selectedIssue.gateway?.id}}</p>
                <Chip :label="selectedIssue.gateway?.pcbGateway.firmwareVersion.version" class="p-mr-2 p-mb-2 bg-green-500 text-white" />
              </div>
          </div>
        </div>
        <div v-else-if="selectedIssue.gpsNode" class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 surface-border w-full">
              <p class="w-2 text-left font-bold text-blue-500 mr-3">Dispositivo</p>

              <div class="flex align-items-center justify-content-evently mx-auto w-full">
                <p class="text-lg w-8">{{ selectedIssue.gpsNode?.id}}</p>
                <Chip :label="selectedIssue.gpsNode?.pcbNode.firmwareVersion.version" class="p-mr-2 p-mb-2 bg-green-500 text-white" />
              </div>
          </div>
        </div>
        <div v-else-if="selectedIssue.pressureSensor"  class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 w-full">
              <p class="w-2 text-left font-bold text-blue-500 mr-3">Dispositivo</p>    
              <div class="flex align-items-center justify-content-evently mx-auto w-full">
                <p class="text-lg w-8">{{ selectedIssue.pressureSensor?.id}}</p>
                <Chip :label="selectedIssue.pressureSensor?.pressureSensorType?.name" class="p-mr-2 p-mb-2 bg-green-500 text-white" />
              </div>
          </div>
        </div>
        
        <div class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 pr-2 w-full">
            <p class="w-8 text-left font-bold text-blue-500 mr-3">Asignación</p>
            <p class="w-6 text-center">
            <Dropdown
                id="irrigator"
                :filter="true"
                class="inputfield w-full"
                v-model="selectedTechnician"
                :options="technicianOptions"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione un técnico"
              />
            </p>
          </div>
        </div>
      </div>

      <!-- listas -->
      <div class='mx-4 mt-4'>
        <Accordion :multiple="true">
          <AccordionTab header="Diagnóstico">
            <ScrollPanel style="width: 100%; height: 300px">
              <div class="grid">
                <div class="col-12 md:col-6 ">
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 font-medium">Fecha</div>
                    <div  v-if='selectedIssue.diagnostic' class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue.diagnostic.date ?? ''}}</div>
                  </div>
                </div>

                <div class="col-12 md:col-6 ">
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div v-if='selectedIssue.diagnostic && selectedIssue.diagnostic.user' class="col-2 text-500 w-6 md:w-2 font-medium">Usuario</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue?.diagnostic?.user?.name }}</div>
                  </div>
                </div>

                <div class="col-12 md:col-6 ">
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Equipo</div>
                    <div v-if='selectedIssue.irrigator' class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue?.irrigator?.name + ' - ' + selectedIssue?.irrigator?.integration_id }}</div>
                  </div>
                </div>

                <div class="col-12 md:col-6 ">
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Diagnóstico</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue?.diagnostic?.diagnostic_type?.name }}</div>
                  </div>
                </div>

                <div class="col-12 md:col-6 ">
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Dispositivo</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue?.diagnostic?.diagnostic_type?.type?.name  }}</div>
                  </div>
                </div>

                <div v-if='selectedIssue.diagnostic' class="col-12 md:col-6 ">
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Grafana Link</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue.diagnostic.grafana_link }}</div>
                  </div>
                </div>

                <div v-if='selectedIssue?.diagnostic?.diagnostic_type?.angles' class="col-12 md:col-6 ">
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Ángulos</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue?.diagnostic?.angles }}</div>
                  </div>
                </div>

                <div v-if='selectedIssue?.diagnostic?.diagnostic_type?.battery_2to3' class="col-12 md:col-6 ">
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Batería 2 a 3</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue?.diagnostic?.battery_2to3 }}</div>
                  </div>
                </div>

                <div v-if='selectedIssue?.diagnostic?.diagnostic_type?.from_hour' class="col-12 md:col-6 ">
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Hora desde</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue?.diagnostic?.from_hour }}</div>
                  </div>
                </div>
               
                <div class="col-12 md:col-6 " v-if='selectedIssue?.diagnostic?.diagnostic_type?.to_hour'>
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Hora hasta</div>
                    <div  class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue?.diagnostic?.to_hour }}</div>
                  </div>
                </div>

                <div class="col-12 md:col-6 " v-if='selectedIssue?.diagnostic?.diagnostic_type?.gateway_first_data_transmission_date'>
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Fecha primer dato GTW</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue?.diagnostic?.gateway_first_data_transmission_date }}</div>
                  </div>
                </div>
                
                <div class="col-12 md:col-6 " v-if='selectedIssue?.diagnostic?.diagnostic_type?.gateway_satellite_power'>
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Pot sat en LOG de Instalación</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue?.diagnostic?.gateway_satellite_power }}</div>
                  </div>
                </div>
                
                <div class="col-12 md:col-6 " v-if='selectedIssue?.diagnostic?.diagnostic_type?.height_difference_in_meters'>
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Diferencia de altura</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue?.diagnostic?.height_difference_in_meters + " m"}}</div>
                  </div>
                </div>
                
                <div class="col-12 md:col-6 " v-if='selectedIssue?.diagnostic?.diagnostic_type?.lost_packets'>
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Paquetes perdidos</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue?.diagnostic?.lost_packets}}</div>
                  </div>
                </div>
                
                <div class="col-12 md:col-6 " v-if='selectedIssue?.diagnostic?.diagnostic_type?.node_to_gateway_distance_in_meters'>
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Distancia entre NODO y GTW</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue?.diagnostic?.node_to_gateway_distance_in_meters + " m"}}</div>
                  </div>
                </div>
                
                <div class="col-12 md:col-6 " v-if='selectedIssue?.diagnostic?.diagnostic_type?.packet_202_count'>
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Cantidad de paquetes 202</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue?.diagnostic?.packet_202_count }}</div>
                  </div>
                </div>

                <div class="col-12 md:col-6 " v-if='selectedIssue?.diagnostic?.diagnostic_type?.packet_203_count'>
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Cantidad de paquetes 203</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue?.diagnostic?.packet_203_count }}</div>
                  </div>
                </div>

                <div class="col-12 md:col-6 " v-if='selectedIssue?.diagnostic?.diagnostic_type?.positions'>
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Posiciones</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue?.diagnostic?.positions }}</div>
                  </div>
                </div>

                <div class="col-12 md:col-6" v-if='selectedIssue?.diagnostic?.diagnostic_type?.pressure_difference'>
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Diferencia de presión</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue?.diagnostic?.pressure_difference }}</div>
                  </div>
                </div>
              </div>
            </ScrollPanel>
          </AccordionTab>
          <AccordionTab>
            <template #header>
              <div class="flex align-items-start" style="width: 100%">
                <div class="flex align-items-center h-full w-11 my-2 align-start">
                  Pericias
                </div>
                <div class="mt-1">
                  <Button @click="handleOpenInspectionForm" icon="pi pi-plus-circle" class="p-button-raised"/>
                </div>
              </div>
            </template>
            <ScrollPanel style="width: 100%; height: 200px" class="custom">
              <ul>
                <div class="itemList hover:surface-300 m-1" @click="handleClickInspection(item)" v-bind:key='index' v-for="(item, index) in selectedIssue.inspections">
                  <div class="grid mx-5">
                    <div class="col-12 md:col-2 mt-3">
                      <i class="pi pi-calendar" style="fontSize: 1.2rem"></i> {{ item.date }}
                    </div>
                    <div class="col-12 md:col-4 mt-3">
                      <i class="pi pi-comment" style="fontSize: 1.2rem"></i> {{ item.comments }}
                    </div>
                    <div class="col-12 md:col-3 mt-3">
                      <i class="pi pi-user" style="fontSize: 1.2rem"></i> {{ item?.user?.name }}
                    </div>
                    <div class="col-12 md:col-3 mt-2">
                      <Button icon="pi pi-external-link" class="p-button-raised p-button-rounded" style="margin: auto;"></Button>
                    </div>
                  </div>
                  <Divider />
                </div>
              </ul>

            </ScrollPanel>
          </AccordionTab>
          <AccordionTab>
            <template #header>
              <div class="flex align-items-start" style="width: 100%">
                <div class="flex align-items-center h-full w-11 my-2 align-start">
                  Reparaciones
                </div>
                <div class="mt-1">
                  <Button @click="handleOpenInspectionForm" icon="pi pi-plus-circle" class="p-button-raised"/>
                </div>
              </div>
            </template>
          </AccordionTab>
          <AccordionTab>
            <template #header>
              <div class="flex align-items-start" style="width: 100%">
                <div class="flex align-items-center h-full w-11 my-2 align-start">
                  Autopsias
                </div>
                <div class="mt-1">
                  <Button @click="handleOpenInspectionForm" icon="pi pi-plus-circle" class="p-button-raised"/>
                </div>
              </div>
            </template>
          </AccordionTab>
        </Accordion>
      </div>
  </Panel>
  </div>
  <inspection-form :isOpen="showInspectionForm" :selectedIssue="selectedIssue" @updateIsOpen="handleIsOpenInspectionUpdated"></inspection-form>
  <inspection-detail :inspection="selectedInspection" :isOpen="selectedInspection != null" @updateIsOpen="handleIsOpenDetailUpdated"></inspection-detail>
</template>

<script>
import Button from "primevue/button";
import InspectionDetail from "./InspectionDetail.vue";
import InspectionForm from "./InspectionForm.vue";
import { getTechniciansQuery } from "../../api/apiRequests";
export default {
  name: "IssueDetail",
  components: {
    Button,
    InspectionDetail,
    InspectionForm,
  },
  methods: {
    hasDevice: function (value) {
      return (
        typeof value.gateway !== undefined ||
        typeof value.gpsNode !== undefined ||
        typeof value.pressureSensor !== undefined
      );
    },
    handleOpenInspectionForm: function () {
      this.showInspectionForm = true;
    },
    handleClickInspection: function (inspection) {
      this.selectedInspection = inspection;
    },
    handleIsOpenDetailUpdated: function () {
      this.selectedInspection = null;
    },
    handleIsOpenInspectionUpdated: function () {
      this.showInspectionForm = false;
    },
  },
  props: ["selectedIssue", "clickIrrigator", "technicianChange"],
  data() {
    return {
      displayIrrigatorDialog: false,
      selectedTechnician: null,
      selectedInspection: null,
      showInspectionForm: false,
      technicianOptions: [],
    };
  },
  async beforeMount() {
    //todo: error handling
    this.loading = true;
    //populate dropdowns
    const result = await getTechniciansQuery();
    const technicians = result.data.users;
    this.technicianOptions = technicians;

    this.loading = false;
  },
  async beforeUpdate() {
    this.selectedTechnician =
      this?.selectedIssue?.assigned_technician?.id || null;
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

