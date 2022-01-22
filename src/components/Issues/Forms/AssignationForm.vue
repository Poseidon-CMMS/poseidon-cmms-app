<template>
  <Dialog
    header="Asignación de técnicos"
    v-model:visible="computedIsOpen"
    class="w-screen lg:w-6"
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
          <div class="col-2">
            <Button
              class="p-button-danger"
              icon="pi pi-trash"
              label="Desasignar"
              @click="onDeleteAssignation"
              :loading="loading"
            />
          </div>
          <div class="col-2 col-offset-6">
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
      <div class="col-12 mt-1" v-if="!!error">
        <Message v-if="!!error" severity="error" @close="onErrorClose">{{
          error
        }}</Message>
      </div>
    </div>
  </Dialog>
</template>

<script>
import { 
  getTechniciansQuery,
  assignHdwIssueMutation,
  clearAssignHdwIssueMutation,
  assignRequestMutation,
  clearAssignRequestMutation
  } from "../../../api/apiRequests";
import Dropdown from "primevue/dropdown";
import Message from "primevue/message";

export default {
  name: "AssignationForm",
  props: ["isOpen", "selectedIssue", "selectedRequest"],
  components: { Dropdown, Message },
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
      if (!this.selectedTechnician) {
        this.error = "Debe seleccionar algún técnico, o seleccione la opción eliminar asignación";
        setTimeout(() => {
          this.error = null;
        }, 5000);
        return;
      }
      if (this.selectedRequest) { //modo asignar request
        await this.assignRequest();
      }  else { //modo asignar hw issue
        await this.assignHdwIssue();
      }
      this.computedIsOpen = false;
    },
    async assignHdwIssue(){
      this.loading = true; //todo control de errores
      await assignHdwIssueMutation(
        this.selectedIssue.id,
        this.selectedTechnician
      );
      this.loading = false;
      const technicianObject = this.technicianOptions.find(t => t.id ===this.selectedTechnician);
      const newIssue = {
        ...this.selectedIssue,
        status: "assigned",
        assigned_technician: technicianObject,
      };
      this.$emit("issueUpdated", newIssue);
    },
    async assignRequest() {
      this.loading = true; //todo control de errores
      const assignedRequestData = await assignRequestMutation(
        this.selectedRequest.id,
        this.selectedTechnician
      );
      this.loading = false;
      const newRequest = assignedRequestData.data.updateinstall_uninstall_request;
      this.$emit("requestUpdated", newRequest);
    },
    onCancelAssignation() {
      this.computedIsOpen = false;
    },
    async onDeleteAssignation() {
      if (this.selectedRequest) { //modo asignar request
        await this.unassignRequest();
      }  else { //modo asignar hw issue
        await this.unassignHdwIssue();
      }
      this.computedIsOpen = false;
      
    },
    async unassignHdwIssue() {
      this.loading = true;
      await clearAssignHdwIssueMutation(this.selectedIssue.id);
      this.loading = false;
      const newIssue = {
        ...this.selectedIssue,
        status: 'in-field'
      };
      delete newIssue.assigned_technician;
      this.$emit("issueUpdated", newIssue);
      this.computedIsOpen = false;
    },
    async unassignRequest() {
      this.loading = true;
      const unassignedRequestData = await clearAssignRequestMutation(this.selectedRequest.id);
      this.loading = false;
      const newRequest =  unassignedRequestData.data.updateinstall_uninstall_request;
      this.$emit("requestUpdated", newRequest);
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
  async beforeUpdate() {
    this.selectedTechnician = this.selectedIssue?.assigned_technician?.id || this.selectedRequest?.assigned_technician?.id || null;
  }
};
</script>

<style scoped>
</style>