<template>
    <Dialog v-model:visible="computedisOpen" header="Inspection">
      <ScrollPanel style="width: 100%; height: 200px">
        <div class="grid">
          <div class="col-6">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div div class="col-12 text-500 font-medium">Fecha</div>
              <div  v-if='inspection.date' class="col-12 text-900">{{ inspection.date ?? ''}}</div>
            </div>
          </div>
          <div class="col-6">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div v-if='inspection.user && inspection.user.name' class="col-12 text-500 font-medium">Usuario</div>
              <div class="text-900 col-12">{{ inspection.user.name }}</div>
            </div>
          </div>
          <div class="col-12">
            <div class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div v-if='inspection.comments' class="col-12 text-500 font-medium">Comentarios</div>
              <div class="text-900 col-12">{{ inspection.comments }}</div>
            </div>
          </div>
        </div>
      </ScrollPanel>
    </Dialog>
</template>

<script>

export default {
  name: 'InspectionDetail',
  props: ['inspection', 'isOpen'],
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
