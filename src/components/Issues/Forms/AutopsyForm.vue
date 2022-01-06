<template>
  <Dialog
    header="Nueva autopsia"
    v-model:visible="computedIsOpen"
    :style="{ width: '50vw' }"
    :modal="true"
  >
    <div class="card">
       TODO:campos aqui
    </div>
    <template #footer>
      <Message v-if="!!error" severity="error" @close="onErrorClose">
        {{error}}
      </Message>
      <div class="mt-2">
        <Button
          class="p-button-success"
          icon="pi pi-check"
          label="Guardar"
          @click="onSubmit"
          :loading="loading"
        />
        <Button
          class="p-button-secondary"
          icon="pi pi-times"
          label="Cancelar"
          @click="onCancel"
          :loading="loading"
        />
      </div>
    </template>
  </Dialog>
  <Toast position="bottom-right" />
  <work-order-form :isOpen="isWorkOrderFormOpen" @workOrderCreated="handleNewWorkOrder" @updateIsWorkOrderFormOpen="setIsWorkOrderFormOpen"></work-order-form>

</template>

<script>
import Toast from "primevue/toast";
import Message from "primevue/message";
import WorkOrderForm from './WorkOrderForm.vue';

function initialData() {
  return {
    loading: false,
    error: null,
  };
}

export default {
  name: "AutopsyForm",
  props: ["isOpen", "selectedIssue"],
  emits: ["updateIsOpen"],
  components: {
    Message,
    Toast,
    WorkOrderForm
  },
  data() {
    return initialData();
  },

  methods: {
    async onSubmit() {
      this.loading = true;
      //TODO: submit
      this.loading = false;
    },
    resetWindow: function () {
      Object.assign(this.$data, initialData());
    },
    showSuccess() {
      this.$toast.add({
        severity: "success",
        summary: "Autopsia creada correctamente",
        detail: "creacion: " + this.creationDate,
        life: 3000,
      });
    },
    showError() {
      this.$toast.add({
        severity: "error",
        summary: "Error al crear la autopsia",
        detail: "error",
        life: 3000,
      });
    },
    onCancel() {
      this.resetWindow();
      this.computedIsOpen = false;
    },
    logUploadHandler(event) {
      console.log(event);
      this.log_file = event.files[0];
    }
  },
  computed: {
    computedIsOpen: {
      get() {
        return this.isOpen;
      },
      set(value) {
        this.$emit("updateIsOpen", value);
      },
    },
  },
  async beforeMount() {
      //todo: fetching de cosas necesarias
    this.loading = false;
  },
};
</script>

<style scoped>
</style>