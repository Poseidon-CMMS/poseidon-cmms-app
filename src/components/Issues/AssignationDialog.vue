<template>
  <Dialog
    header="Asignación de técnicos"
    v-model:visible="computedIsOpen"
    :style="{ width: '50vw' }"
    :modal="true"
  >
    <div class="grid">
      <div class="col-4 col-offset-2">
        <p class="text-lg line-height-2">Técnico:</p>
      </div>
      <div class="col-4">
        <Dropdown
          :filter="true"
          class="inputfield w-full"
          v-model="selectedTechnician"
          :options="technicianOptions"
          optionLabel="name"
          optionValue="id"
          placeholder="Seleccione un técnico"
        />
      </div>
      <div class="col-12 mt-2">
        <div class="grid">
          <div class="col-2 col-offset-8">
            <Button
              class="p-button-success"
              icon="pi pi-check"
              label="Guardar"
              @click="onSubmitAssignation"
              :loading="loading"
            />
          </div>
          <div class="col-2">
            <Button
              class="p-button-secondary"
              icon="pi pi-times"
              label="Cancelar"
              @click="onCancelAssignation"
              :loading="loading"
            />
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script>
// import { ref } from 'vue'
import { getTechniciansQuery } from "../../api/apiRequests";
import Dropdown from "primevue/dropdown";

export default {
  name: "AssignationDialog",
  props: ["isOpen", "selectedIssue"],
  components: { Dropdown },
  data() {
    return {
      selectedTechnician: null,
      loading: false,
      error: null,
      technicianOptions: [],
    };
  },
  methods: {
    async onSubmitAssignation() {
      if(!this.selectedTechnician){
        this.error = "Debe seleccionar algún técnico";
        setTimeout(() => {this.error=null}, 2000);
        return;
      }

      this.loading = true;
      //todo: enviar al servidor
      setTimeout(() => {
        this.loading = false;
        const newIssue = {...this.selectedIssue, status: 'assigned', technician: this.selectedTechnician};
        this.$emit("issueUpdated", newIssue);
      }, 750);
    },
    onCancelAssignation() {
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
    this.loading = true;
    //populate dropdowns
    const result = await getTechniciansQuery();
    const technicians = result.data.users;
    this.technicianOptions = technicians.map((tec) => ({
      name: tec.name,
      id: tec.id,
    }));

    this.loading = false;
  },
};
</script>

<style scoped>
</style>