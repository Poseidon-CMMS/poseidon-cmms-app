<template>
  <Dialog
    header="Nueva orden de trabajo"
    v-model:visible="computedIsOpen"
    :style="{ width: '50vw' }"
    :modal="true"
  >
    <div class="card">
      <div class="field">
        <label for="creationDate">Fecha</label>
        <Calendar
            id="creationDate"
            :show-icon="true"
            v-model="creationDate"
            dateFormat="yy-mm-dd"
            class="inputfield w-full"
            />
      </div>

      <div class="field">
        <label for="pot_sat">Kilómetros</label>
        <InputNumber
          id="pot_sat"
          v-model="distance_in_kilometers"
          mode="decimal"
          :minFractionDigits="2"
          class="inputfield w-full"
        />
      </div>

      <div class="field">
        <label for="comments">Descripción</label>
        <Textarea
          id="comments"
          placeholder="Observaciones acerca de la órden de trabajo"
          v-model="comments"
          :autoResize="true"
          class="inputfield w-full"
          rows="2"
          cols="70"
        />
      </div>
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
</template>

<script>
import Textarea from "primevue/textarea";
import Calendar from "primevue/calendar";
import Message from "primevue/message";
import InputNumber from "primevue/inputnumber";
import {
  createWorkOrderMutation,
} from "../../../api/apiRequests";

function initialData() {
  return {
    loading: false,
    error: null,
    comments: "",
    creationDate: null,
    distance_in_kilometers: null,
  };
}

export default {
  name: "WorkOrderForm",
  props: ["isOpen", "selectedIssue"],
  emits: ["updateIsWorkOrderFormOpen", "workOrderCreated"],
  components: {
    Textarea,
    Message,
    InputNumber,
    Calendar
  },
  data() {
    return initialData();
  },

  methods: {
    async onSubmit() {
      this.loading = true;
      const technician_id = this.selectedIssue.assigned_technician.id;
      const workOrderResult = await createWorkOrderMutation(
        //TODO: validar q todos los campso esten completos
        this.creationDate,
        this.distance_in_kilometers,
        this.comments,
        technician_id,
      );

      if (workOrderResult?.data?.creatework_order?.id) {
        this.showSuccess();
        this.$emit("workOrderCreated", workOrderResult.data.creatework_order);
        this.computedIsOpen = false;
        this.resetWindow();
      } else {
        this.showError();
      }
      this.loading = false;
    },
    resetWindow: function () {
      Object.assign(this.$data, initialData());
    },
    showSuccess() {
      this.$toast.add({
        severity: "success",
        summary: "Orden de trabajo creada correctamente",
        detail: "creacion: " + this.creationDate,
        life: 3000,
      });
    },
    showError() {
      this.$toast.add({
        severity: "error",
        summary: "Error al crear la orden de trabajo",
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
    },
  },
  computed: {
    computedIsOpen: {
      get() {
        return this.isOpen;
      },
      set(value) {
         this.$emit("updateIsWorkOrderFormOpen",value);
      },
    },
  },
  beforeMount() {
    this.loading = false;
  },
};
</script>

<style scoped>
</style>