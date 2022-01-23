<template>
  <Dialog
    header="Solicitud de desinstalación"
    v-model:visible="computedIsOpen"
    class="w-screen lg:w-6"
    :modal="true"
  >
    <div class="card">
      <form id="uninstall-request-form" @submit.prevent="onSubmit(!v$.$invalid)" class="p-fluid">
      <div class="field">
        <div class="flex justify-content-around flex-nowrap card-container">
          <div class="flex align-items-center w-11 justify-content-start">
            <label for="selectedWorkOrder">Orden de trabajo</label>
          </div>
          <div class="flex">
            <Button
              class="p-button-sm"
              icon="pi pi-plus"
              @click="setIsWorkOrderFormOpen(true)"
            ></Button>
          </div>
        </div>
        <Dropdown
          id="selectedWorkOrder"
          v-model="selectedWorkOrder"
          :options="workOrders"
          :optionLabel="(work_order) => `${dateFormatter(work_order?.work_date, false)}`"
          class="inputfield"
          placeholder="Orden de trabajo"
        />
        <small v-if="(v$.selectedWorkOrder.$invalid && submitted) || v$.selectedWorkOrder.$pending.$response" class="p-error">{{v$.selectedWorkOrder.required.$message.replace('Value', 'Orden de trabajo')}}</small>
      </div>
      <div class="field">
        <label for="completionDate">Fecha de desinstalación en el equipo: </label>
        <Calendar
          id="completionDate"
          :show-icon="true"
          v-model="completionDate"
          dateFormat="yy-mm-dd"
          :showTime="true"
          :showSeconds="true"
          class="inputfield ml-2"
        />
        <div><small v-if="(v$.completionDate.$invalid && submitted) || v$.completionDate.$pending.$response" class="p-error">{{v$.completionDate.required.$message.replace('Value', 'Fecha de desinstalacion')}}</small></div>

      </div>
      </form>
    </div>
    <template #footer>
      <Message v-if="!!error" severity="error" @close="onErrorClose">
        {{ error }}
      </Message>
      <div class="mt-2">
        <Button
          class="p-button-success"
          icon="pi pi-check"
          label="Guardar"
          form="uninstall-request-form"
          type="submit"
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
  <work-order-form
    :isOpen="isWorkOrderFormOpen"
    :technician="selectedRequest?.assigned_technician"
    @workOrderCreated="handleNewWorkOrder"
    @updateIsWorkOrderFormOpen="setIsWorkOrderFormOpen"
  ></work-order-form>
</template>

<script>
import Calendar from "primevue/calendar";
import Message from "primevue/message";
import WorkOrderForm from "../WorkOrders/WorkOrderForm.vue";
import {
  getWorkOrdersQuery,
  doUninstallRequestMutation
} from "../../api/apiRequests";
import { dateFormatter } from "../../utils/dateFormatter.js";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

function initialData(avoidDeletingDropdowns = false) {
  let initialData = {
    loading: false,
    error: null,
    completionDate: null,
    selectedWorkOrder: null,
    isWorkOrderFormOpen: false,
    submitted: false,
  };
  if (!avoidDeletingDropdowns)
    initialData = {
      ...initialData,
      workOrders: [],
    };
  return initialData;
}

export default {
name: "UninstallRequestForm",
  props: ["isOpen", "selectedRequest"],
  emits: ["updateIsOpen", "requestUpdated"],
  components: {
    Message,
    WorkOrderForm,
    Calendar,
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
        completionDate: {
            required
        },
        selectedWorkOrder: {
            required
        },
    }
  },
  data() {
    return initialData();
  },

  methods: {
    dateFormatter,
    async onSubmit(isFormValid) {
      this.submitted = true;
      if(!isFormValid) return;
      try {
        this.loading = true;
        const requestResult = await doUninstallRequestMutation(
          this.completionDate,
          this.selectedRequest.id,
          this.selectedWorkOrder?.id,
        );


        if (requestResult.data.updateinstall_uninstall_request.id) {
          this.showSuccess();
          const newRequest = {
            ...this.selectedRequest,
            ...requestResult.data.updateinstall_uninstall_request,
          };
          this.$emit("requestUpdated", newRequest);
          this.computedIsOpen = false;
          this.resetWindow();
        } else {
          this.showError();
        }
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.error = e;
      }
    },
    resetWindow: function () {
      Object.assign(this.$data, initialData(true));
    },
    showSuccess() {
      this.$toast.add({
        severity: "success",
        summary: "Solicitud de desinstalación actualizada correctamente",
        detail: "Fecha de trabajo realizado: " + dateFormatter(this.completionDate, false),
        life: 3000,
      });
    },
    showError() {
      this.$toast.add({
        severity: "error",
        summary: "Error al subir los datos",
        detail: "error",
        life: 3000,
      });
    },
    onCancel() {
      this.resetWindow();
      this.computedIsOpen = false;
    },
    setIsWorkOrderFormOpen(val) {
      this.isWorkOrderFormOpen = val;
    },
    handleNewWorkOrder(newWorkOrder) {
      this.workOrders = [...this.workOrders, newWorkOrder];
    },
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
  async beforeUpdate() {
    const user_id = this.selectedRequest?.assigned_technician?.id;
    if(user_id){
      this.workOrders = (await getWorkOrdersQuery(user_id)).data.workOrders; //todo: error handling
    }

    this.loading = false;
  },
};
</script>

<style scoped>
</style>