<template>
  <Dialog
    header="Nueva pericia"
    v-model:visible="computedIsOpen"
    class="w-screen lg:w-6"
    :modal="true"
  >
    <div class="card">
      <form id="inspection-form" @submit.prevent="onSubmit(!v$.$invalid)" class="p-fluid">
      <div class="field">
        <label for="date">Fecha: </label>
        <Calendar
          :show-icon="true"
          v-model="date"
          :showTime="true"
          :showSeconds="true"
          dateFormat="yy-mm-dd"
          class="inputfield ml-2"
        />
        <div><small v-if="(v$.date.$invalid && submitted) || v$.date.$pending.$response" class="p-error">{{v$.date.required.$message.replace('Value', 'Fecha de pericia')}}</small></div>
      </div>
      <div class="field">
        <label for="assetType">Dispositivo con fallas</label>
        <Dropdown
          v-model="assetType"
          :options="assetTypes"
          optionLabel="name"
          class="inputfield w-full"
          placeholder="Dispositivo con fallas"
        />
        <div><small v-if="(v$.assetType.$invalid && submitted) || v$.assetType.$pending.$response" class="p-error">{{v$.assetType.required.$message.replace('Value', 'Dispositivo con fallas')}}</small></div>
      </div>
      <div class="field">
        <label for="inspectionType">Tipo de pericia</label>
        <Dropdown
          v-model="inspectionType"
          :options="inspectionTypes"
          optionLabel="name"
          :filter="true"
          class="inputfield w-full"
          placeholder="Tipo de pericia"
        />
        <div><small v-if="(v$.inspectionType.$invalid && submitted) || v$.inspectionType.$pending.$response" class="p-error">{{v$.inspectionType.required.$message.replace('Value', 'Tipo de pericia')}}</small></div>

      </div>
      <div class="field" v-if="inspectionType?.pot_sat">
        <label for="pot_sat">Potencia satelital</label>
        <InputNumber
          id="pot_sat"
          v-model="pot_sat"
          mode="decimal"
          :minFractionDigits="2"
          class="inputfield w-full"
        />
      </div>
      <div class="field" v-if="inspectionType?.gateway_battery_voltage">
        <label for="gateway_battery_voltage"
          >Tensión de batería del gateway</label
        >
        <InputNumber
          id="gateway_battery_voltage"
          v-model="gateway_battery_voltage"
          mode="decimal"
          :minFractionDigits="2"
          class="inputfield w-full"
        />
      </div>
      <div class="field" v-if="inspectionType?.gps_node_battery_voltage">
        <label for="gps_node_battery_voltage"
          >Tensión de batería del nodo GPS</label
        >
        <InputNumber
          id="gps_node_battery_voltage"
          v-model="gps_node_battery_voltage"
          mode="decimal"
          :minFractionDigits="2"
          class="inputfield w-full"
        />
      </div>
      <div class="field" v-if="inspectionType?.lora_power">
        <label for="lora_power">Potencia LoRa</label>
        <InputNumber
          id="lora_power"
          v-model="lora_power"
          mode="decimal"
          :minFractionDigits="2"
          class="inputfield w-full"
        />
      </div>
      <div class="field" v-if="inspectionType?.pressure_sensor_signal">
        <label for="pressure_sensor_signal">Señal sensor de presión</label>
        <InputNumber
          id="pressure_sensor_signal"
          v-model="pressure_sensor_signal"
          mode="decimal"
          :minFractionDigits="2"
          class="inputfield w-full"
        />
      </div>
      <div class="field">
        <label for="comments">Comentarios</label>
        <Textarea
          id="comments"
          placeholder="Observaciones acerca de la pericia"
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
          <p class="text-left font-bold text-blue-500">Imagen</p>
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
            name="image_upload"
            :customUpload="true"
            @uploader="imageUploadHandler"
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
          <InlineMessage v-if="!!this.image_file" severity="success"
            >Cargado {{ this.image_file.name }}</InlineMessage
          >
        </div>
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
            Log del dispositivo
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
      </form>
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
          form="inspection-form"
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
</template>

<script>
import Textarea from "primevue/textarea";
import Calendar from 'primevue/calendar';
import InlineMessage from "primevue/inlinemessage";
import Message from "primevue/message";
import FileUpload from "primevue/fileupload";
import InputNumber from "primevue/inputnumber";
import {
  getAssetTypesQuery,
  getInspectionTypesQuery,
  createInspectionMutation,
} from "../../../api/apiRequests";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

function initialData() {
  return {
    inspection: null,
    loading: false,
    error: null,
    comments: "",
    date: null,
    inspectionTypes: [],
    inspectionType: null,
    assetType: null,
    log_file: null,
    image_file: null,
    pot_sat: null,
    gateway_battery_voltage: null,
    gps_node_battery_voltage: null,
    lora_power: null,
    pressure_sensor_signal: null,
    submitted: false,
  };
}

export default {
  name: "InspectionForm",
  props: ["isOpen", "selectedIssue"],
  emits: ["updateIsOpen", "issueUpdated"],
  components: {
    Textarea,
    InputNumber,
    FileUpload,
    InlineMessage,
    Message,
    Calendar,
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
        date: {
            required
        },
        assetType: {
            required
        },
        inspectionType: {
            required
        },
    }
  },
  data() {
    return initialData();
  },

  methods: {
    async onSubmit(isFormValid) {
      this.submitted = true;
      if(!isFormValid) return;
      this.loading = true;
      const technician_id = this.selectedIssue.assigned_technician.id;
      const inspectionResult = await createInspectionMutation(
        //TODO: validar q todos los campso esten completos
        this.date,
        technician_id,
        this.selectedIssue.id,
        this.inspectionType.id,
        this.comments,
        this.image_file,
        this.log_file,
        this.satellite_power,
        this.gateway_battery_voltage,
        this.lora_power,
        this.gps_node_battery_voltage,
        this.pressure_sensor_signal
      );
      const newInspection = inspectionResult.data.createinspection;
      if (newInspection.id) {
        this.showSuccess();
        const newIssue = {
          ...this.selectedIssue, 
          inspection: this.selectedIssue.inspection? [...this.selectedIssue.inspection, newInspection]: [newInspection]
        }
        this.$emit("issueUpdated", newIssue);
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
        summary: "Pericia creada correctamente",
        detail: "creacion: " + this.date,
        life: 3000,
      });
    },
    showError() {
      this.$toast.add({
        severity: "error",
        summary: "Error al crear la pericia",
        detail: "error",
        life: 3000,
      });
    },
    onCancel() {
      this.resetWindow();
      this.computedIsOpen = false;
    },
    imageUploadHandler(event) {
      this.image_file = event.files[0];
    },
    logUploadHandler(event) {
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
    this.inspectionTypes = (
      await getInspectionTypesQuery()
    ).data.inspectionTypes; //todo: error handling
    this.loading = false;
  },
};
</script>

<style scoped>
</style>