<template>
  <Dialog
    header="Nueva reparación"
    v-model:visible="computedIsOpen"
    :style="{ width: '50vw' }"
    :modal="true"
  >
    <div class="card">
      <div class="field">
        <label for="work_order">Orden de trabajo</label>
        <Dropdown
          id="work_order"
          v-model="selectedWorkOrder"
          :options="workOrders"
          optionLabel="work_date"
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
      <div class="field" v-if="repair_type?.code ==='device_change'">
        <label for="asset_type">Dispositivo con fallas</label>
        <SelectButton
          id="asset_type"
          v-model="assetType"
          :options="assetTypes"
          optionLabel="name"
        />
      </div>
      <div class="field" v-if="repair_type?.code ==='device_change' && assetType.name=='Gateway'">
        <label for="asset_type">Nuevo gateway instalado</label>
        <Dropdown
          id="solution"
          v-model="selectedGateway"
          :options="gateways"
          optionLabel="name"
          class="inputfield w-full"
          placeholder="Solución"
        />
      </div>
      <div class="field" v-if="repair_type?.code ==='device_change' && assetType.name=='Nodo GPS'">
        <label for="asset_type">Nuevo nodo instalado</label>
        <Dropdown
          id="solution"
          v-model="selectedGpsNode"
          :options="gpsNodes"
          optionLabel="name"
          class="inputfield w-full"
          placeholder="Solución"
        />
      </div>
      <div class="field" v-if="repair_type?.code ==='device_change' && assetType.name=='Sensor de presión'">
        <label for="asset_type">Nuevo sensor de presión instalado</label>
        <Dropdown
          id="solution"
          v-model="selectedPressureSensor"
          :options="pressureSensors"
          optionLabel="name"
          class="inputfield w-full"
          placeholder="Solución"
        />
      </div>
      <div class="field" v-if="repair_type?.code ==='device_repair'">
        <label for="solution">Solución</label>
        <Dropdown
          id="solution"
          v-model="selectedSolution"
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
          <p class="w-12 text-left font-bold text-blue-500">
            Log
          </p>
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
          <InlineMessage v-if="!!this.log_file" severity="success"
            >Cargado {{ this.log_file.name }}</InlineMessage
          >
        </div>
      </div>
    </div>
    <template #footer>
      <Message v-if="!!error" severity="error" @close="onErrorClose">{{
        error
      }}</Message>
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
</template>

<script>
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";
import Toast from "primevue/toast";
import InlineMessage from "primevue/inlinemessage";
import Message from "primevue/message";
import FileUpload from "primevue/fileupload";
import InputNumber from "primevue/inputnumber";
import SelectButton from "primevue/selectbutton";
import {
  getAssetTypesQuery,
  getRepairTypesQuery,
  createRepairMutation,
  getSolutionTypesQuery,
  getTechniciansGatewaysQuery,
  getTechniciansGpsNodesQuery,
  getTechniciansPressureSensorQuery,
} from "../../../api/apiRequests";

function initialData() {
  return {
    
    repair: null,
    loading: false,
    error: null,
    comments: "",
    creationDate: null,
    repairTypes: [],
    repairType: null,
    assetType: null,
    assetTypes: [],
    log_file: null,
    workOrders: [], //TODO: que solo traiga los que estan en tu stock (si sos tecnico)
    selectedWorkOrder: null,
    pressureSensors: [], //TODO: que solo traiga los que estan en tu stock (si sos tecnico)
    selectedPressureSensor: null,
    gpsNodes: [], //TODO: que solo traiga los que estan en tu stock (si sos tecnico)
    selectedGpsNode: null,
    gateways: [], //TODO: que solo traiga los que estan en tu stock (si sos tecnico)
    selectedGateway: null,
    selectedSolution: null,
    solutionTypes: [] 
  };
}

export default {
  name: "RepairForm",
  props: ["isOpen", "selectedIssue"],
  emits: ["updateIsOpen"],
  components: {
    Textarea,
    InputNumber,
    Checkbox,
    FileUpload,
    InlineMessage,
    Message,
    Toast,
    SelectButton,
  },
  data() {
    return initialData();
  },

  methods: {
    async onSubmit() {
      this.loading = true;
      const user_id = sessionStorage.getItem("id");
      const repairResult = await createRepairMutation(
        //TODO: validar q todos los campso esten completos
        this.creationDate,
        this.led_gtw,
        this.jumper_wifi,
        user_id,
        this.selectedIssue.id,
        this.repairType.id,
        this.comments,
        this.image_file,
        this.log_file,
        this.satellite_power,
        this.gateway_battery_voltage,
        this.lora_power,
        this.gps_node_battery_voltage,
        this.pressure_sensor_signal
      );

      if (repairResult.data.createrepair.id) {
        this.showSuccess();
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
    this.gateways = (await getTechniciansGatewaysQuery()).data.gateways; //todo: error handling
    this.pressureSensors = (await getTechniciansPressureSensorsQuery()).data.pressureSensors; //todo: error handling
    this.gpsNodes = (await getTechniciansGpsNodeQuery()).data.gpsNodes; //todo: error handling

    this.loading = false;
  },
};
</script>

<style scoped>
</style>