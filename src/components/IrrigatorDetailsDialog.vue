<template>
<Dialog
    header="Equipo de riego"
    v-model:visible="computedIsOpen"
    :style="{ width: '50vw' }"
  >
    <p class="text-2xl font-semibold">{{ irrigator?.name }}</p>
     <div class="surface-section">
      <ul class="list-none p-0 m-0">
        <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
          <div class="text-500 w-6 md:w-2 font-medium">ID Equipo</div>
          <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ irrigator.integrationID }}</div>
        </li>
        <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
          <div class="text-500 w-6 md:w-2 font-medium">Cliente</div>
          <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ irrigator.field.client.name }}</div>
        </li>
        <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
          <div class="text-500 w-6 md:w-2 font-medium">GTW ID</div>
          <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ irrigator.gateway.integrationId }}</div>
        </li>
        <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
          <div class="text-500 w-6 md:w-2 font-medium">NODO ID</div>
          <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ irrigator.gpsNode.integrationId }}</div>
        </li>
        <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
          <div class="text-500 w-6 md:w-2 font-medium">Modem ID</div>
          <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ irrigator.gateway.satelliteModem.manufacturerId }}</div>
        </li>
        <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
          <div class="text-500 w-6 md:w-2 font-medium">Mapeo</div>
          <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ irrigator.isMapped }}</div>
        </li>
        <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
          <div class="text-500 w-6 md:w-2 font-medium">Campo</div>
          <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ irrigator.field.name }}</div>
        </li>
        <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
          <div class="text-500 w-6 md:w-2 font-medium">Zona</div>
          <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ irrigator.field.zone.name }}</div>
        </li>
        <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
          <div class="text-500 w-6 md:w-2 font-medium">Provincia</div>
          <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ irrigator.field.province.name }}</div>
        </li>
        <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
          <div class="text-500 w-6 md:w-2 font-medium">Ciudad</div>
          <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ irrigator.field.city.name }}</div>
        </li>
      </ul>
    </div> 
  </Dialog>
</template>

<script>
export default {
  name: 'IrrigatorDetails',
  props: ['isOpen', 'irrigator'],
  computed: {
      computedIsOpen: {
          get() {return this.isOpen},
          set(value) {this.$emit('updateIsOpen', value)}

      }
  }
}

</script>

<style scoped>
</style>