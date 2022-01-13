<template>
    <Dialog v-model:visible="computedisOpen" header="Autopsia" class="w-8">
      <ScrollPanel style="height: 300px">
        <div class="grid surface-200">
          <div v-if='autopsy.date' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div div class="col-10 text-500 font-medium hidden md:inline-flex">Fecha</div>
              <div div class="col-2 text-500">
                <i class="pi pi-calendar" style="fontSize: 2rem"></i>
              </div>
              <div class="col-12 text-900">
                  {{ dateFormatter(autopsy.date) }}
              </div>
            </div>
          </div>
          <div v-if='autopsy.user && autopsy.user.name' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Usuario</div>
              <div div class="col-2 text-500">
                <i class="pi pi-user" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ autopsy.user.name }}</div>
            </div>
          </div>
          <div v-if='autopsy?.autopsy_type.name' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Tipo de autopsia</div>
              <div div class="col-2 text-500">
                <i class="pi pi-file" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">
                  {{ autopsy?.autopsy_type?.name }}</div>
            </div>
          </div>
          <div v-if='autopsy?.self_diagnostic_file' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Log autodiagnóstico</div>
              <div div class="col-2 text-500">
                <i class="pi pi-file" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ autopsy?.self_diagnostic_file.filename }}</div>
            </div>
          </div>
          <div v-if='autopsy?.pressure_log' class="col-6 pl-5">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Log de presión</div>
              <div div class="col-2 text-500">
                <i class="pi pi-file" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ autopsy?.pressure_log.filename }}</div>
            </div>
          </div>
          <div class="col-12 pl-5">
            <div v-if='autopsy.comments' class="grid py-3 px-1 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium">Comentarios</div>
              <div div class="col-2 text-500 flex justify-content-center">
                <i class="pi pi-comments" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ autopsy.comments }}</div>
            </div>
          </div>
        </div>
      </ScrollPanel>
    </Dialog>
</template>

<script>
import ScrollPanel from 'primevue/scrollpanel';
import {dateFormatter} from '../../../utils/dateFormatter';

export default {
  name: 'AutopsyDetail',
  props: ['autopsy', 'isOpen'],
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
