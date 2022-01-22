<template>
  <form id="request-form" @submit.prevent="onSubmit(!v$.$invalid)" class="p-fluid">
  <Dialog
    header="Instalación"
    v-model:visible="computedIsOpen"
    class="w-screen lg:w-6"
    :modal="true"
  >
    <div class="card">
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
          class="inputfield lg:w-full"
          placeholder="Orden de trabajo"
        />
        <small v-if="(v$.selectedWorkOrder.$invalid && submitted) || v$.selectedWorkOrder.$pending.$response" class="p-error">{{v$.selectedWorkOrder.required.$message.replace('Value', 'Orden de trabajo')}}</small>
      </div>
      <div class="field">
        <label for="completionDate">Fecha de instalación en el equipo: </label>
        <Calendar
          id="completionDate"
          :show-icon="true"
          v-model="completionDate"
          dateFormat="yy-mm-dd"
          :showTime="true"
          :showSeconds="true"
          class="inputfield ml-2"
        />
        <div><small v-if="(v$.completionDate.$invalid && submitted) || v$.completionDate.$pending.$response" class="p-error">{{v$.completionDate.required.$message.replace('Value', 'Fecha de instalacion')}}</small></div>
      </div>
      <div
        class="field"
      >
        <label for="selectedGateway">Nuevo gateway instalado</label>
        <Dropdown
          id="selectedGateway"
          v-model="selectedGateway"
          :options="gateways"
          optionLabel="integration_id"
          class="inputfield w-full"
          placeholder="Gateway"
        />
        <small v-if="(v$.selectedGateway.$invalid && submitted) || v$.selectedGateway.$pending.$response" class="p-error">{{v$.selectedGateway.required.$message.replace('Value', 'Gateway')}}</small>
      </div>
      <div
        class="field"
      >
        <label for="selectedGpsNode">Nuevo nodo instalado</label>
        <Dropdown
          id="selectedGpsNode"
          v-model="selectedGpsNode"
          :options="gpsNodes"
          optionLabel="integration_id"
          class="inputfield w-full"
          placeholder="Nodo"
        />
        <small v-if="(v$.selectedGpsNode.$invalid && submitted) || v$.selectedGpsNode.$pending.$response" class="p-error">{{v$.selectedGpsNode.required.$message.replace('Value', 'Nodo GPS')}}</small>
      </div>
      <div
        class="field"
      >
        <label for="selectedPressureSensor">Nuevo sensor de presión instalado</label>
        <Dropdown
          id="selectedPressureSensor"
          v-model="selectedPressureSensor"
          :options="pressureSensors"
          optionLabel="integration_id"
          class="inputfield w-full"
          placeholder="Sensor de presión"
        />
        <small v-if="(v$.selectedPressureSensor.$invalid && submitted) || v$.selectedPressureSensor.$pending.$response" class="p-error">{{v$.selectedPressureSensor.required.$message.replace('Value', 'Sensor de presión')}}</small>
      </div>
      <!-- gtw img -->
      <div class="field flex">
        <div
          class="
            flex-1 flex
            align-items-center
            justify-content-center
            font-bold
            text-white
            m-2
            px-5
            py-3
            border-round
          "
        >
          <p class="w-12 text-left font-bold text-blue-500">Foto del Gateway instalado</p>
        </div>
        <div
          class="
            flex-none flex
            align-items-center
            justify-content-center
            font-bold
            text-white
            m-2
            px-5
            py-3
            border-round
          "
        >
          <FileUpload
            name="gtw_upload"
            :customUpload="true"
            @uploader="(event) => {this.gtw_image = event.files[0];}"
            mode="basic"
            accept="image/*"
            :auto="true"
          />
        </div>
        <div
          class="
            flex-1 flex
            align-items-center
            justify-content-center
            font-bold
            text-white
            m-2
            px-5
            py-3
            border-round
          "
        >
          <InlineMessage v-if="!!this.gtw_image" severity="success">
            Cargado {{ this.gtw_image.name }}
          </InlineMessage>
        </div>
      </div>
      <!-- gps node img -->
      <div class="field flex">
        <div
          class="
            flex-1 flex
            align-items-center
            justify-content-center
            font-bold
            text-white
            m-2
            px-5
            py-3
            border-round
          "
        >
          <p class="w-12 text-left font-bold text-blue-500">Foto del Nodo GPS</p>
        </div>
        <div
          class="
            flex-none flex
            align-items-center
            justify-content-center
            font-bold
            text-white
            m-2
            px-5
            py-3
            border-round
          "
        >
          <FileUpload
            name="gps_node_upload"
            :customUpload="true"
            @uploader="(event) => {this.gps_node_image = event.files[0];}"
            mode="basic"
            accept="image/*"
            :auto="true"
          />
        </div>
        <div
          class="
            flex-1 flex
            align-items-center
            justify-content-center
            font-bold
            text-white
            m-2
            px-5
            py-3
            border-round
          "
        >
          <InlineMessage v-if="!!this.gps_node_image" severity="success">
            Cargado {{ this.gps_node_image.name }}
          </InlineMessage>
        </div>
      </div>
      <!-- pressure sensor img -->
      <div class="field flex">
        <div
          class="
            flex-1 flex
            align-items-center
            justify-content-center
            font-bold
            text-white
            m-2
            px-5
            py-3
            border-round
          "
        >
          <p class="w-12 text-left font-bold text-blue-500">Foto del sensor de presión</p>
        </div>
        <div
          class="
            flex-none flex
            align-items-center
            justify-content-center
            font-bold
            text-white
            m-2
            px-5
            py-3
            border-round
          "
        >
          <FileUpload
            name="gps_node_upload"
            :customUpload="true"
            @uploader="(event) => {this.pressure_sensor_image = event.files[0];}"
            mode="basic"
            accept="image/*"
            :auto="true"
          />
        </div>
        <div
          class="
            flex-1 flex
            align-items-center
            justify-content-center
            font-bold
            text-white
            m-2
            px-5
            py-3
            border-round
          "
        >
          <InlineMessage v-if="!!this.pressure_sensor_image" severity="success">
            Cargado {{ this.pressure_sensor_image.name }}
          </InlineMessage>
        </div>
      </div>
      <!-- log -->
      <div class="field flex">
        <div
          class="
            flex-1 flex
            align-items-center
            justify-content-center
            font-bold
            text-white
            m-2
            px-5
            py-3
            border-round
          "
        >
          <p class="w-12 text-left font-bold text-blue-500">Log</p>
        </div>
        <div
          class="
            flex-none flex
            align-items-center
            justify-content-center
            font-bold
            text-white
            m-2
            px-5
            py-3
            border-round
          "
        >
          <FileUpload
            name="log_upload"
            :customUpload="true"
            @uploader="logUploadHandler"
            mode="basic"
            :auto="true"
          />
        </div>
        <div
          class="
            flex-1 flex
            align-items-center
            justify-content-center
            font-bold
            text-white
            m-2
            px-5
            py-3
            border-round
          "
        >
          <InlineMessage v-if="!!this.log_file" severity="success">
            Cargado {{ this.log_file.name }}
          </InlineMessage>
        </div>
      </div>
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
          form="request-form"
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
  </form>
  <work-order-form
    :isOpen="isWorkOrderFormOpen"
    :technician="selectedRequest?.assigned_technician"
    @workOrderCreated="handleNewWorkOrder"
    @updateIsWorkOrderFormOpen="setIsWorkOrderFormOpen"
  ></work-order-form>
</template>

<script>
import InlineMessage from "primevue/inlinemessage";
import Calendar from "primevue/calendar";
import Message from "primevue/message";
import FileUpload from "primevue/fileupload";
import WorkOrderForm from "../WorkOrders/WorkOrderForm.vue";
import {
  getWorkOrdersQuery,
  getTechniciansGatewaysQuery,
  getTechniciansGpsNodesQuery,
  getTechniciansPressureSensorsQuery,
  doInstallRequestMutation
} from "../../api/apiRequests";
import { dateFormatter } from "../../utils/dateFormatter.js";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

function initialData(avoidDeletingDropdowns = false) {
  let initialData = {
    loading: false,
    error: null,
    completionDate: null,
    gtw_image: null,
    gps_node_image: null,
    pressure_sensor_image: null,
    log_file: null,
    selectedWorkOrder: null,
    selectedPressureSensor: null,
    selectedGpsNode: null,
    selectedGateway: null,
    isWorkOrderFormOpen: false,
    submitted: false
  };
  if (!avoidDeletingDropdowns)
    initialData = {
      ...initialData,
      workOrders: [],
      pressureSensors: [],
      gpsNodes: [],
      gateways: [],
    };
  return initialData;
}

export default {
  name: "InstallRequestForm",
  props: ["isOpen", "selectedRequest"],
  emits: ["updateIsOpen", "requestUpdated"],
  components: {
    FileUpload,
    InlineMessage,
    Message,
    WorkOrderForm,
    Calendar,
  },
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return initialData();
  },
  validations() {
      return {
          completionDate: {
              required
          },
          selectedWorkOrder: {
              required
          },
          selectedGateway: {
              required
          },
          selectedGpsNode: {
              required
          },
          selectedPressureSensor: {
              required
          },
      }
    },
  methods: {
    dateFormatter,
    async onSubmit(isFormValid) {
      this.submitted = true;
      console.log('ISFORMVALID ES ', isFormValid);
      if(!isFormValid) return;
      try {
        this.loading = true;
        const requestResult = await doInstallRequestMutation(
          this.completionDate,
          this.selectedRequest.id,
          this.selectedGateway?.id,
          this.selectedGpsNode?.id,
          this.selectedPressureSensor?.id,
          this.selectedWorkOrder?.id,
          this.log_file,
          this.gtw_image,
          this.gps_node_image,
          this.pressure_sensor_image,
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
        summary: "Solicitud de instalación actualizada correctamente",
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
    logUploadHandler(event) {
      this.log_file = event.files[0];
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
      this.gateways = (await getTechniciansGatewaysQuery()).data.gateways; //todo: error handling y traer solo las del tecnico
      this.pressureSensors = (
        await getTechniciansPressureSensorsQuery()
      ).data.pressureSensors; //todo: error handling y traer solo las del tecnico
      this.gpsNodes = (await getTechniciansGpsNodesQuery()).data.gpsNodes; //todo: error handling y traer solo las del tecnico
    }
    

    this.loading = false;
  },
};
</script>

<style scoped>
</style>