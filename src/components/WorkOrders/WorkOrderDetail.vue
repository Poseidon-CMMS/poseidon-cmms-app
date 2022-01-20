<template>
    <Dialog v-model:visible="computedisOpen" header="Orden de trabajo" class="w-8">
      <ScrollPanel style="height: 300px">
        <div class="grid surface-200">
          <div v-if='workOrder.work_date' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div div class="col-10 text-500 font-medium hidden md:inline-flex">Fecha</div>
              <div div class="col-2 text-500">
                <i class="pi pi-calendar" style="fontSize: 2rem"></i>
              </div>
              <div class="col-12 text-900">
                  {{ dateFormatter(workOrder.work_date, false) }}
              </div>
            </div>
          </div>
          <div v-if='workOrder.km_traveled' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Kilómetros recorridos</div>
              <div div class="col-2 text-500">
                <i class="pi pi-map" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ workOrder.km_traveled }}</div>
            </div>
          </div>
          <div v-if='workOrder?.technician' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Técnico</div>
              <div div class="col-2 text-500">
                <i class="pi pi-user" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">
                  {{ workOrder?.technician.name }}</div>
            </div>
          </div>
          <div class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Reparaciones</div>
              <div div class="col-2 text-500">
                <i :class="'pi pi-circle-'+ (workOrder?.repairCount == 0 ? 'off' : 'on')" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">
                  {{ workOrder?.repairCount }}</div>
            </div>
          </div>
          <div class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Instalaciones/Desinstalaciones</div>
              <div div class="col-2 text-500">
                <i :class="'pi pi-circle-' + (workOrder?.install_uninstall_requestCount == 0 ? 'off' : 'on')" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">
                  {{ workOrder?.install_uninstall_requestCount }}</div>
            </div>
          </div>
          <div class="col-12 pl-5">
            <div v-if='workOrder.comments' class="grid py-3 px-1 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium">Comentarios</div>
              <div div class="col-2 text-500 flex justify-content-center">
                <i class="pi pi-comments" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ workOrder.comments }}</div>
            </div>
          </div>
        </div>
      </ScrollPanel>
    </Dialog>
</template>

<script>
import ScrollPanel from 'primevue/scrollpanel';
import {dateFormatter} from '../../utils/dateFormatter';

export default {
  name: 'WorkOrderDetail',
  props: ['isOpen', 'workOrder'],
  components: {
    ScrollPanel,
  },
  methods: {
    dateFormatter
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
