<template>
  <Dialog
    header="Assignation"
    :visible="isOpen"
    :style="{ width: '50vw' }"
    :modal="true"
  >
    <div class="grid">
      <div class="col-4 col-offset-2">
        <p class="text-lg line-height-2">Technician:</p>
      </div>
      <div class="col-4">
       <Autocomplete v-model="selectedTechnician" :suggestions="technicianOptions" @complete="searchTechnician" :dropdown="true" field="name" force-selection>
          <template #item="slotProps">
            <div class="p-ml-2">{{slotProps.item.name}}</div>
          </template>
        </Autocomplete>
      </div>
      <div class="col-12 mt-2">
        <div class="grid">
          <div class="col-2 col-offset-8">
            <Button class="p-button-success" icon="pi pi-check" label="Submit" @click="onSubmitAsignation" :loading="loading"/>
          </div>
          <div class="col-2">
            <Button class="p-button-secondary" icon="pi pi-times" label="Cancel" @click="onCancelAsignation" :loading="loading"/>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script>
// import { ref } from 'vue'
import {
  getIrrigatorsQuery,
} from "../api/apiRequests";

export default {
  name: "AssignationDialog",
  props: ["isOpen", "selectedIssueId"],
  data() {
    return {
      selectedTechnician: null,
      loading: false,
      error: null,
      technicianOptions: [],
    };
  },
  methods: {
    async onSubmitAsignation() {
      this.loading = true;
      
      setTimeout(() => {
          this.loading = false;
        }, 750);
    },
    onCancelAsignation() {
      this.computedIsOpen = false;
    },
  },
  computed: {
    computedIsOpen: {
      get() {
        return this.isOpen;
      },
      set(value) {
        this.$emit("updateIsOpenAssignation", value);
      },
    },
  },
  async beforeMount() {
    //todo: error han dling
    this.selectedTecnician = this.selectedTechnician || null;
    this.loading = false;

    //populate dropdowns
    const result = await getIrrigatorsQuery();
    const technicians = result.data.irrigators;
    this.technicianOptions = technicians.map((tec) => ({
      name: tec.integrationID,
      id: tec.id,
    }));

    this.loading = false;
  },
};
</script>

<style scoped>
</style>