<template>
    <Dialog v-model:visible="computedisOpen" header="Inspection" class="w-8">
      <ScrollPanel style="height: 300px">
        <div class="grid surface-200">
          <div class="col-6 pl-5">
            <div v-if='inspection.date' class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div div class="col-10 text-500 font-medium hidden md:inline-flex">Fecha</div>
              <div div class="col-2 text-500">
                <i class="pi pi-calendar" style="fontSize: 2rem"></i>
              </div>
              <div class="col-12 text-900">{{ inspection.date }}</div>
            </div>
          </div>
          <div class="col-6 pl-5">
            <div v-if='inspection.user && inspection.user.name' class="grid align-items-center py-3 px-2 border-top-1 surface-border">
              <div class="col-10 text-500 font-medium hidden md:inline-flex">Usuario</div>
              <div div class="col-2 text-500">
                <i class="pi pi-user" style="fontSize: 2rem"></i>
              </div>
              <div class="text-900 col-12">{{ inspection.user.name }}</div>
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
