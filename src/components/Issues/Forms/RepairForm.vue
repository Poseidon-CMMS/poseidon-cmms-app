<template>
  <Dialog
    header="Nueva reparación"
    v-model:visible="computedIsOpen"
    :style="{ width: '50vw' }"
    :modal="true"
  >
    <div class="card">
      <div class="field">
        <div class="flex justify-content-around flex-wrap card-container">
          <div class="flex align-items-center w-11 justify-content-start">
            <label for="work_order">Orden de trabajo</label>
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
          id="work_order"
          v-model="selectedWorkOrder"
          :options="workOrders"
          :optionLabel="
            (work_order) => {
              const date = work_order.work_date;
              const dateObject = new Date(date);
              return `${dateObject.getFullYear()}/${
                dateObject.getMonth() + 1
              }/${dateObject.getDate()} | ${work_order.comment}`;
            }
          "
          class="inputfield w-full"
          placeholder="Orden de trabajo"
        />
      </div>
      <div class="field">
        <label for="creationDate">Fecha de reparación en campo</label>
        <Calendar
          id="creationDate"
          :show-icon="true"
          v-model="creationDate"
          dateFormat="yy-mm-dd"
          :showTime="true"
          :showSeconds="true"
          class="inputfield w-full"
        />
      </div>
      <div class="field">
        <label for="repair_type">Tipo de reparación</label>
        <Dropdown
          id="repair_type"
          v-model="repairType"
          :options="repairTypes"
          optionLabel="name"
          :filter="true"
          class="inputfield w-full"
          placeholder="Tipo de reparación"
        />
      </div>
      <div class="field" v-if="repairType?.value == 'device_change'">
        <label for="asset_type">Dispositivo con fallas</label>
        <SelectButton
          id="asset_type"
          v-model="assetType"
          :options="assetTypes"
          optionLabel="name"
        />
      </div>
      <div
        class="field"
        v-if="
          repairType?.value === 'device_change' && assetType?.name == 'Gateway'
        "
      >
        <label for="asset_type">Nuevo gateway instalado</label>
        <Dropdown
          id="solution"
          v-model="selectedGateway"
          :options="gateways"
          optionLabel="integration_id"
          class="inputfield w-full"
          placeholder="Gateway"
        />
      </div>
      <div
        class="field"
        v-if="
          repairType?.value === 'device_change' && assetType?.name == 'Nodo GPS'
        "
      >
        <label for="asset_type">Nuevo nodo instalado</label>
        <Dropdown
          id="solution"
          v-model="selectedGpsNode"
          :options="gpsNodes"
          optionLabel="integration_id"
          class="inputfield w-full"
          placeholder="Nodo"
        />
      </div>
      <div
        class="field"
        v-if="
          repairType?.value === 'device_change' &&
          assetType?.name == 'Sensor de Presión'
        "
      >
        <label for="asset_type">Nuevo sensor de presión instalado</label>
        <Dropdown
          id="solution"
          v-model="selectedPressureSensor"
          :options="pressureSensors"
          optionLabel="integration_id"
          class="inputfield w-full"
          placeholder="Sensor de presión"
        />
      </div>
      <div class="field" v-if="repairType?.value == 'device_repair'">
        <label for="solution">Solución</label>
        <Dropdown
          id="solution"
          v-model="selectedSolutionType"
          :options="solutionTypes"
          optionLabel="name"
          class="inputfield w-full"
          placeholder="Solución"
        />
      </div>
      <div class="field">
        <label for="comments">Comentarios</label>
        <Textarea
          id="comments"
          placeholder="Observaciones acerca de la reparación"
          v-model="comments"
          :autoResize="true"
          class="inputfield w-full"
          rows="2"
          cols="70"
        />
      </div>
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
  <work-order-form
    :isOpen="isWorkOrderFormOpen"
    @workOrderCreated="handleNewWorkOrder"
    @updateIsWorkOrderFormOpen="setIsWorkOrderFormOpen"
  ></work-order-form>
</template>

<script>
import Textarea from "primevue/textarea";
import InlineMessage from "primevue/inlinemessage";
import Calendar from "primevue/calendar";
import Message from "primevue/message";
import FileUpload from "primevue/fileupload";
import SelectButton from "primevue/selectbutton";
import WorkOrderForm from "./WorkOrderForm.vue";
import {
  getAssetTypesQuery,
  getRepairTypesQuery,
  createRepairMutation,
  getSolutionTypesQuery,
  getWorkOrdersQuery,
  getTechniciansGatewaysQuery,
  getTechniciansGpsNodesQuery,
  getTechniciansPressureSensorsQuery,
} from "../../../api/apiRequests";

function initialData(avoidDeletingDropdowns = false) {
  let initialData = {
    repair: null,
    loading: false,
    error: null,
    comments: "",
    creationDate: null,
    repairType: null,
    assetType: null,
    log_file: null,
    selectedWorkOrder: null,
    selectedPressureSensor: null,
    selectedGpsNode: null,
    selectedGateway: null,
    selectedSolutionType: null,
    isWorkOrderFormOpen: false,
  };
  if (!avoidDeletingDropdowns)
    initialData = {
      ...initialData,
      repairTypes: [],
      assetTypes: [],
      workOrders: [],
      pressureSensors: [],
      gpsNodes: [],
      gateways: [],
      solutionTypes: [],
    };
  return initialData;
}

export default {
  name: "RepairForm",
  props: ["isOpen", "selectedIssue"],
  emits: ["updateIsOpen", "issueUpdated"],
  components: {
    Textarea,
    FileUpload,
    InlineMessage,
    Message,
    SelectButton,
    WorkOrderForm,
    Calendar,
  },
  data() {
    return initialData();
  },

  methods: {
    async onSubmit() {
      try {
        this.loading = true;
        const repairResult = await createRepairMutation(
          //TODO: validar q todos los campso esten completos
          this.creationDate,
          this.selectedIssue.id,
          this.repairType.id,
          this.assetType?.id,
          this.selectedGateway?.id,
          this.selectedGpsNode?.id,
          this.selectedPressureSensor?.id,
          this.selectedWorkOrder?.id,
          this.comments,
          this.log_file,
          this.selectedSolutionType?.id
        );

        if (repairResult.data.createrepair.id) {
          this.showSuccess();
          const newIssue = {
            ...this.selectedIssue,
            status: "repaired",
            repair: this.selectedIssue?.repair
              ? [...this.selectedIssue.repair, repairResult.data.createrepair]
              : [repairResult.data.createrepair],
          };
          this.$emit("issueUpdated", newIssue);
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
        summary: "Reparación creada correctamente",
        detail: "creacion: " + this.creationDate,
        life: 3000,
      });
    },
    showError() {
      this.$toast.add({
        severity: "error",
        summary: "Error al crear la reparación",
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
  async beforeMount() {
    this.assetTypes = (await getAssetTypesQuery()).data.assetTypes;
    this.repairTypes = (await getRepairTypesQuery()).data.repairTypes; //todo: error handling
    this.solutionTypes = (await getSolutionTypesQuery()).data.solutionTypes; //todo: error handling
    const user_id = sessionStorage.getItem("id");
    this.workOrders = (await getWorkOrdersQuery(user_id)).data.workOrders; //todo: error handling
    this.gateways = (await getTechniciansGatewaysQuery()).data.gateways; //todo: error handling y traer solo las del tecnico
    this.pressureSensors = (
      await getTechniciansPressureSensorsQuery()
    ).data.pressureSensors; //todo: error handling y traer solo las del tecnico
    this.gpsNodes = (await getTechniciansGpsNodesQuery()).data.gpsNodes; //todo: error handling y traer solo las del tecnico

    this.loading = false;
  },
};
</script>

<style scoped>
</style>