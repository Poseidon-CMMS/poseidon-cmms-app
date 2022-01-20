<template>
    <Dialog v-model:visible="computedisOpen" header="Reparación" class="w-8">
      <ScrollPanel style="height: 300px">
        <div class="grid surface-200">
          <div v-if='repair.date' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div div class="col-10 text-500 font-medium hidden md:inline-flex">Fecha</div>
              <div div class="col-2 text-500">
                <i class="pi pi-calendar" style="fontSize: 2rem"></i>
              </div>
              <div class="col-12 text-900">
                  {{ dateFormatter(repair.date) }}
              </div>
            </div>
          </div>
          <div v-if='repair.user && repair.user.name' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Usuario</div>
              <div div class="col-2 text-500">
                <i class="pi pi-user" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ repair.user.name }}</div>
            </div>
          </div>
          <div v-if='repair?.repair_type.name' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Tipo de reparación</div>
              <div div class="col-2 text-500">
                <i class="pi pi-file" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">
                  {{ repair?.repair_type.name + ' | ' + 
                    (repair?.repair_type?.value === 'device_change' ? 
                    repair?.replaced_asset_type?.name : 
                    repair?.solution_type?.name) }}</div>
            </div>
          </div>
          <div v-if='repair?.new_gateway' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Nuevo gateway</div>
              <div div class="col-2 text-500">
                <i class="pi pi-briefcase" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ repair?.new_gateway.integration_id }}</div>
            </div>
          </div>
          <div v-if='repair?.new_gps_node' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Nuevo nodo</div>
              <div div class="col-2 text-500">
                <i class="pi pi-briefcase" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ repair?.new_gps_node.integration_id }}</div>
            </div>
          </div>
          <div v-if='repair?.new_pressure_sensor' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Nuevo sensor de presión</div>
              <div div class="col-2 text-500">
                <i class="pi pi-briefcase" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ repair?.new_pressure_sensor.integration_id }}</div>
            </div>
          </div>
          <div v-if='repair?.log' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Log</div>
              <div div class="col-2 text-500">
                <i class="pi pi-file" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">
                {{ repair?.log.filename }}
                <Button icon="pi pi-download" class="p-button-rounded p-button-success" @click="handleLogDownload" /></div>
            </div>
          </div>
          <div class="col-12 pl-5">
            <div v-if='repair.comments' class="grid py-3 px-1 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium">Comentarios</div>
              <div div class="col-2 text-500 flex justify-content-center">
                <i class="pi pi-comments" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ repair.comments }}</div>
            </div>
          </div>
        </div>
      </ScrollPanel>
    </Dialog>
</template>

<script>
import ScrollPanel from 'primevue/scrollpanel';
import {dateFormatter} from "../../../utils/dateFormatter";
import {imageUrlGenerator} from "../../../utils/imageUrlGenerator";
import Button from "primevue/button";

export default {
  name: 'RepairDetail',
  props: ['repair', 'isOpen'],
  methods: {
    dateFormatter,
    imageUrlGenerator,
    handleLogDownload() {
      window.open(imageUrlGenerator(this.repair.log.url))
    },
  },
  components: {
    ScrollPanel,
    Button,
  },
  computed: {
      computedisOpen: {
          get() {return this.isOpen},
          set(value) {this.$emit('updateIsOpen', value)}

      }
  }
}
</script>

<style scoped>
</style>
