<template>
  <div class="grid mt-5">
    <div class="col-12 flex flex-row justify-content-between flex-wrap">
      <Button
        label="Nuevo"
        icon="pi pi-plus"
        class="p-button-success align-self-center mt-2"
        @click="setIsCreationFormOpen(true)"
      />
    </div>
    <div class="col-12">
      <stock-movements-table :stockMovements="stockMovements" :loading="loading" />
    </div>
  </div>
  <stock-movement-form
    :isOpen="!!isCreationFormOpen"
    @updateIsOpen="setIsCreationFormOpen"
    @stockMovementUpdated="handleStockMovementUpdated"
  />
</template>

<script>
import StockMovementsTable from "../components/StockMovements/StockMovementsTable.vue";
import StockMovementForm from "../components/StockMovements/StockMovementForm.vue";
import { getStockMovementsQuery } from "../api/apiRequests";

export default {
  name: "Dashboard",
  components: {
    StockMovementsTable,
    StockMovementForm,
  },
  data() {
    return {
      loading: true,
      isCreationFormOpen: false,
      stockMovements: [],
    };
  },
  methods: {
    setIsCreationFormOpen(val) {
      this.isCreationFormOpen = val;
    },
    handleStockMovementUpdated(newStockMovement) {
      this.stockMovements.push(newStockMovement);
    },
  },
  async mounted() {
    try {
      const result = await getStockMovementsQuery();
      this.stockMovements = result.data.stockMovements;
      this.loading = false;
    } catch (e) {
      this.error = e;
      this.stockMovements = [];
      this.loading = false;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
