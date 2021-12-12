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
              <p class="text-left font-bold text-blue-500 mr-3">Irrigator</p>
              <div class="grid justify-content-center w-full">
                <div class="col-8">
                  <p class="text-lg">{{ selectedIssue.irrigator.name }}</p>
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
        <div class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 surface-border w-full">
              <p class="w-4 text-left font-bold text-blue-500 mr-3">Device type</p>
              <p class="text-lg w-10">{{ selectedIssue.assetType.name }}</p>
          </div>
        </div>
        <div v-if="selectedIssue.gateway" class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 w-full">
              <p class="w-4 text-left font-bold text-blue-500 mr-3">Device</p>

              <div class="flex align-items-center justify-content-evently mx-auto w-full">
                <p class="text-lg w-8">{{ selectedIssue.gateway?.id}}</p>
                <Chip :label="selectedIssue.gateway?.pcbGateway.firmwareVersion.version" class="p-mr-2 p-mb-2 bg-green-500 text-white" />
              </div>
          </div>
        </div>
        <div v-else-if="selectedIssue.gpsNode" class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 surface-border w-full">
              <p class="w-2 text-left font-bold text-blue-500 mr-3">Device</p>

              <div class="flex align-items-center justify-content-evently mx-auto w-full">
                <p class="text-lg w-8">{{ selectedIssue.gpsNode?.id}}</p>
                <Chip :label="selectedIssue.gpsNode?.pcbNode.firmwareVersion.version" class="p-mr-2 p-mb-2 bg-green-500 text-white" />
              </div>
          </div>
        </div>
        <div v-else-if="selectedIssue.pressureSensor"  class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 w-full">
              <p class="w-2 text-left font-bold text-blue-500 mr-3">Device</p>    
              <div class="flex align-items-center justify-content-evently mx-auto w-full">
                <p class="text-lg w-8">{{ selectedIssue.pressureSensor?.id}}</p>
                <Chip :label="selectedIssue.pressureSensor?.pressureSensorType.name" class="p-mr-2 p-mb-2 bg-green-500 text-white" />
              </div>
          </div>
        </div>
        
        <div class="col-12 md:col-6 hover:surface-300">
          <div class="flex align-items-center mx-2 pr-2 w-full">
            <p class="w-8 text-left font-bold text-blue-500 mr-3">Assignation</p>
            <p class="w-6 text-center">
            <Dropdown
                id="irrigator"
                :filter="true"
                class="inputfield w-full"
                v-model="selectedTechnician"
                :options="technicians"
                optionLabel="name"
                optionValue="id"
                placeholder="Select a technician"
              />
            </p>
          </div>
        </div>
      </div>

      <!-- listas -->
      <div class='mx-4 mt-4'>
        <Accordion :multiple="true">
          <AccordionTab header="Diagnostic">
            <ScrollPanel style="width: 100%; height: 200px">
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
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue.diagnostic.user.name }}</div>
                  </div>
                </div>
                <div class="col-12 md:col-6 ">
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Equipo</div>
                    <div v-if='selectedIssue.irrigator' class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue.irrigator.name }}</div>
                  </div>
                </div>
                <div class="col-12 md:col-6 ">
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Diagnóstico</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue.diagnostic.diagnostic_type.name }}</div>
                  </div>
                </div>
                <div class="col-12 md:col-6 ">
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Device</div>
                    <div v-if='selectedIssue.assetType' class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue.assetType.name }}</div>
                  </div>
                </div>
                <div class="col-12 md:col-6 ">
                  <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
                    <div class="col-2 text-500 w-6 md:w-2 font-medium">Grafana Link</div>
                    <div v-if='selectedIssue.diagnostic' class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ selectedIssue.diagnostic.grafana_link }}</div>
                  </div>
                </div>
              </div>
            </ScrollPanel>
          </AccordionTab>
          <AccordionTab header="Inspections" >
            <ScrollPanel style="width: 100%; height: 150px" class="custom">
              <ul>
                <div class="itemList hover:surface-300 m-1" v-bind:key='index' v-for="(item, index) in selectedIssue.inspections">
                  <div class="grid">
                    <div class="col-12 md:col-4">
                      <i class="pi pi-calendar" style="fontSize: 1.2rem"></i> {{ item.date }}
                    </div>
                    <div class="col-12 md:col-4">
                      {{ item.comments }}
                    </div>
                    <div class="col-12 md:col-4">
                      <i class="pi pi-user" style="fontSize: 1.2rem"></i> {{ item.user.name }}
                    </div>
                  </div>
                  <Divider />
                </div>
              </ul>

            </ScrollPanel>
          </AccordionTab>
          <AccordionTab header="Repairs">
            Content
          </AccordionTab>
        </Accordion>
      </div>
  </Panel>
  </div>
</template>

<script>
import Button from 'primevue/button';

export default {
  name: 'IssueDetail',
  components: {
    Button,
  },
  methods: {
    hasDevice: function(value) {
      console.log(value);
      return ( typeof value.gateway !== undefined || typeof value.gpsNode !== undefined ||typeof value.pressureSensor !== undefined );
    },
  },
  props: ['selectedIssue', 'clickIrrigator', 'technicianChange'],
  data() {
    return {
      displayIrrigatorDialog: false,
      selectedTechnician: null,
      technicians: [
            {name: 'Juan Perez', id: 1},
            {name: 'Fernando Navarro', id: 2},
            {name: 'Mauricio Lima', id: 3},
            {name: 'Hola', id: 4},
            {name: 'Chau', id: 5},
            {name: 'Probando', id: 6},
            {name: 'Iñaki', id: 7},
            {name: 'Zunda', id: 8},
            {name: 'Test', id: 9},
      ],
    }
  }
}
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
    transition: background-color .3s;
}

.custom .p-scrollpanel-bar:hover {
    background-color: #135ba1;
}
</style>

