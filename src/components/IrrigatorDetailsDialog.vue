<template>
<Dialog
    header="Equipo de riego"
    v-model:visible="computedIsOpen"
    :style="{ width: '50vw' }"
  >
    <p class="text-2xl font-semibold">{{ irrigator?.name }}</p>
    <template #footer>
      <Button
        label="No"
        icon="pi pi-times"
        @click="closeBasic"
        class="p-button-text"
      />
      <Button label="Yes" icon="pi pi-check" @click="closeBasic" autofocus />
    </template>
  </Dialog>
</template>

<script>
export default {
  name: 'IrrigatorDetails',
  props: ['isOpen', 'irrigator'],
  computed: {
      computedIsOpen: {
          get() {return this.isOpen},
          set(value) {this.$emit('aaaa', value)}

      }
  }
}

</script>

<style scoped>
</style>