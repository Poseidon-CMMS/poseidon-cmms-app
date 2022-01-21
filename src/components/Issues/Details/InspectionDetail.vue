<template>
    <Dialog v-model:visible="computedisOpen" header="Pericia" class="w-8">
      <ScrollPanel style="height: 300px">
        <div class="grid surface-200">
          <div v-if='inspection.date' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div div class="col-10 text-500 font-medium hidden md:inline-flex">Fecha</div>
              <div div class="col-2 text-500">
                <i class="pi pi-calendar" style="fontSize: 2rem"></i>
              </div>
              <div class="col-12 text-900">
                {{ dateFormatter(inspection.date) }}
              </div>
            </div>
          </div>
          <div v-if='inspection.user && inspection.user.name' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Usuario</div>
              <div div class="col-2 text-500">
                <i class="pi pi-user" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ inspection.user.name }}</div>
            </div>
          </div>
          <div v-if='inspection?.inspection_type.name' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Tipo de pericia</div>
              <div div class="col-2 text-500">
                <i class="pi pi-file" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ inspection?.inspection_type.name }}</div>
            </div>
          </div>
          <div v-if='inspection.inspection_type?.gateway_battery_voltage' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div div class="col-10 text-500 font-medium hidden md:inline-flex">Tensión de bateria gateway</div>
              <div div class="col-2 text-500">
                <i class="pi pi-bolt" style="fontSize: 2rem"></i>
              </div>
              <div class="col-12 text-900">{{ inspection.gateway_battery_voltage }}</div>
            </div>
          </div>
          <div v-if='inspection.inspection_type?.gps_node_battery_voltage' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Tensión de batería nodo</div>
              <div div class="col-2 text-500">
                <i class="pi pi-bolt" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ inspection.gps_node_battery_voltage }}</div>
            </div>
          </div>
          <div v-if='inspection.inspection_type?.lora_power' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Potencia señal LoRa</div>
              <div div class="col-2 text-500">
                <i class="pi pi-circle-fill" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ inspection.lora_power }}</div>
            </div>
          </div>
          <div v-if='inspection.inspection_type.pot_sat' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Potencia Satelital</div>
              <div div class="col-2 text-500">
                <i class="pi pi-circle-fill" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ inspection.pot_sat }}</div>
            </div>
          </div>
          <div v-if='inspection.inspection_type.pressure_sensor_signal' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Señal del sensor de presión</div>
              <div div class="col-2 text-500">
                <i class="pi pi-circle-fill" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ inspection.pressure_sensor_signal }}</div>
            </div>
          </div>
          <div v-if='inspection?.log' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Log</div>
              <div div class="col-2 text-500">
                <i class="pi pi-file" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">
                {{ inspection?.log.filename }}
                <Button icon="pi pi-download" class="p-button-rounded p-button-success" @click="urlDownloader(this.inspection.log.url)" />
              </div>
            </div>
          </div>
          <div class="col-12 pl-5">
            <div v-if='inspection.comments' class="grid py-3 px-1 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium">Comentarios</div>
              <div div class="col-2 text-500 flex justify-content-center">
                <i class="pi pi-comments" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ inspection.comments }}</div>
            </div>
          </div>
        </div>
      </ScrollPanel>
    </Dialog>
</template>

<script>
import ScrollPanel from "primevue/scrollpanel";
import {dateFormatter} from "../../../utils/dateFormatter";
import {urlDownloader} from "../../../utils/urlDownloader";

export default {
  name: 'InspectionDetail',
  props: ['inspection', 'isOpen'],
  methods: {
    dateFormatter,
    urlDownloader
  },
  components: {
    ScrollPanel,
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
