<template>
  <div class="mt-5">
    <stock-movements-table />
  </div>
</template>

<script>
import StockMovementsTable from '../components/StockMovements/StockMovementsTable.vue'; 

export default {
  name: 'Dashboard',
  components: {
    StockMovementsTable
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
