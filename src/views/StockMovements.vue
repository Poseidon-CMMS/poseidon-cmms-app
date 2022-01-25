<template>
  <div class="grid mt-5">
    <div class="col-12 flex flex-row justify-content-between flex-wrap">
        <Button label="Nuevo" icon="pi pi-plus" class="p-button-success align-self-center mt-2" @click="setIsCreationFormOpen(true)" />
    </div>
    <div class="col-12">
      <stock-movements-table />
    </div>
  </div>
  <stock-movement-form :isOpen="!!isCreationFormOpen" @updateIsOpen="setIsCreationFormOpen" />
</template>

<script>
import StockMovementsTable from '../components/StockMovements/StockMovementsTable.vue'; 
import StockMovementForm  from '../components/StockMovements/StockMovementForm.vue'; 

export default {
  name: 'Dashboard',
  components: {
    StockMovementsTable,
    StockMovementForm,
  },
  data(){
      return {
          isCreationFormOpen: false,
          
      }
  },
  methods: {
      setIsCreationFormOpen(val){
        this.isCreationFormOpen = val;
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
