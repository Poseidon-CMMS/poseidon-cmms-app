<template>
  <Dialog
    header="Creación de Hardware Issue"
    v-model:visible="computedIsOpen"
    class="w-screen lg:w-6"
    :modal="true"
  >
    <div class="card">
      <form id="hardware-issue-creation-form" @submit.prevent="onSubmit(!v$.$invalid)" class="p-fluid">
      <div class="field">
        <label for="diagnosticDate">Fecha de comienzo de la falla: </label>
        <Calendar
          class="inputfield ml-2"
          id="diagnosticDate"
          v-model="diagnosticDate"
          :showIcon="true"
          :showTime="true"
          :showSeconds="true"
        />
        <div><small v-if="(v$.diagnosticDate.$invalid && submitted) || v$.diagnosticDate.$pending.$response" class="p-error">{{v$.diagnosticDate.required.$message.replace('Value', 'Fecha de diagnóstico')}}</small></div>

      </div>
      <div class="field">
        <label for="selectedIrrigator">Equipo de riego</label>
        <Dropdown
          id="selectedIrrigator"
          :filter="true"
          class="inputfield w-full"
          v-model="selectedIrrigator"
          :options="irrigatorOptions"
          optionLabel="name"
          optionValue="code"
          placeholder="Select an Irrigator"
        />
          <div><small v-if="(v$.selectedIrrigator.$invalid && submitted) || v$.selectedIrrigator.$pending.$response" class="p-error">{{v$.selectedIrrigator.required.$message.replace('Value', 'Equipo de riego')}}</small></div>

      </div>
      <div class="field">
        <label for="selectedDiagnosticType">Tipo de Diagnóstico</label>
        <Dropdown
          id="selectedDiagnosticType"
          :filter="true"
          class="inputfield w-full"
          v-model="selectedDiagnosticType"
          :options="diagnosticTypes"
          optionLabel="name"
          placeholder="Seleccione un tipo de diagnóstico"
        />
        <div><small v-if="(v$.selectedDiagnosticType.$invalid && submitted) || v$.selectedDiagnosticType.$pending.$response" class="p-error">{{v$.selectedDiagnosticType.required.$message.replace('Value', 'Fecha de desinstalacion')}}</small></div>

      </div>

      <div class="field" v-if="selectedDiagnosticType?.gateway_satellite_power">
        <label for="gateway_satellite_power"
          >Potencia en LOG de Instalación</label
        >
        <InputNumber
          id="gateway_satellite_power"
          v-model="gateway_satellite_power"
          mode="decimal"
          :minFractionDigits="2"
          class="inputfield w-full"
        />
      </div>

      <div class="field" v-if="selectedDiagnosticType?.angles">
        <label for="angles">Ángulos</label>
        <InputText
          id="angles"
          v-model="angles"
          type="text"
          class="inputfield w-full"
        />
      </div>

      <div class="field" v-if="selectedDiagnosticType?.packet_202_count">
        <label for="packet_202_count">Cantidad de paquetes 202</label>
        <InputNumber
          id="packet_202_count"
          v-model="packet_202_count"
          class="inputfield w-full"
        />
      </div>
      <div class="field" v-if="selectedDiagnosticType?.positions">
        <label for="positions">Posiciones</label>
        <SelectButton
          v-model="positions"
          :options="positionOptions"
          optionLabel="name"
        />
      </div>

      <div class="field" v-if="selectedDiagnosticType?.lost_packets">
        <label for="lost_packets">Paquetes perdidos</label>
        <InputNumber
          id="lost_packets"
          v-model="lost_packets"
          class="inputfield w-full"
        />
      </div>

      <div
        class="field"
        v-if="selectedDiagnosticType?.node_to_gateway_distance_in_meters"
      >
        <label for="node_to_gateway_distance_in_meters"
          >Distancia entre nodo y gateway en metros</label
        >
        <InputNumber
          id="node_to_gateway_distance_in_meters"
          v-model="node_to_gateway_distance_in_meters"
          mode="decimal"
          :minFractionDigits="2"
          class="inputfield w-full"
        />
      </div>

      <div
        class="field"
        v-if="selectedDiagnosticType?.gateway_first_data_transmission_date"
      >
        <label for="gateway_first_data_transmission_date"
          >Fecha de primer transmisión del gateway: </label
        >
        <Calendar
          class="inputfield ml-2"
          id="gateway_first_data_transmission_date"
          v-model="gateway_first_data_transmission_date"
          :showTime="true"
          :showSeconds="true"
          :showIcon="true"
        />
      </div>

      <div
        class="field"
        v-if="selectedDiagnosticType?.height_difference_in_meters"
      >
        <label for="height_difference_in_meters"
          >Diferencia de altura en metros</label
        >
        <InputNumber
          id="height_difference_in_meters"
          v-model="height_difference_in_meters"
          mode="decimal"
          :minFractionDigits="2"
          class="inputfield w-full"
        />
      </div>

      <div class="field" v-if="selectedDiagnosticType?.from_hour">
        <label for="from_hour">Hora de inicio de la falla: </label>
        <Calendar
          id="from_hour"
          class="inputfield ml-2"
          v-model="from_hour"
          :timeOnly="true"
          hourFormat="24"
        />
      </div>

      <div class="field" v-if="selectedDiagnosticType?.to_hour">
        <label for="to_hour">Hora de finalización de la falla: </label>
        <Calendar
          id="to_hour"
          class="inputfield ml-2"
          v-model="to_hour"
          :timeOnly="true"
          hourFormat="24"
        />
      </div>

      <div class="field" v-if="selectedDiagnosticType?.packet_203_count">
        <label for="packet_203_count">Cantidad de paquetes 203</label>
        <InputNumber
          id="packet_203_count"
          v-model="packet_203_count"
          class="inputfield w-full"
        />
      </div>

      <div class="field" v-if="selectedDiagnosticType?.pressure_difference">
        <label for="pressure_difference">Diferencia de presión</label>
        <InputNumber
          id="pressure_difference"
          v-model="pressure_difference"
          mode="decimal"
          :minFractionDigits="2"
          class="inputfield w-full"
        />
      </div>

      <div class="field">
        <label for="grafanaLink">Link a Grafana</label>
        <InputText
          id="grafanaLink"
          v-model="grafanaLink"
          type="text"
          class="inputfield w-full"
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
            Imagen de altimetría
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
            @uploader="imageUploadHandler"
            accept="image/*"
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
          <InlineMessage v-if="!!this.altimetry_image" severity="success"
            >Cargado {{ this.altimetry_image.name }}</InlineMessage
          >
        </div>
      </div>
      <div class="field">
        <label for="comments">Comentarios</label>
        <InputText
          id="comments"
          v-model="comments"
          type="text"
          class="inputfield w-full"
        />
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
          form="hardware-issue-creation-form"
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
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import Message from "primevue/message";
import InputNumber from "primevue/inputnumber";
import SelectButton from "primevue/selectbutton";
import {
  getDiagnosticTypesQuery,
  getIrrigatorsQuery,
  createHdwIssueMutation,
  addDiagnosticToHdwIssueMutation,
} from "../../../api/apiRequests";
import InlineMessage from "primevue/inlinemessage";
import FileUpload from "primevue/fileupload";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

export default {
  name: "HdwIssueCreationForm",
  components: {
    InputText,
    InputNumber,
    SelectButton,
    Calendar,
    Dropdown,
    Message,
    FileUpload,
    InlineMessage,
  },
  props: ["isOpen", "selectedIrrigatorId", "hdwIssueToEdit"],
  emits: ["updateIsOpen"],
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
        diagnosticDate: {
            required
        },
        selectedIrrigator: {
            required
        },
        selectedDiagnosticType: {
            required
        },
    }
  },
  data() {
    return {
      loading: false,
      error: null,
      //dates
      diagnosticDate: this?.hdwIssueToEdit?.diagnosticDate || null,

      //selectables
      selectedIrrigator: this?.hdwIssueToEdit?.irrigator?.id || null,
      selectedDiagnosticType: this?.hdwIssueToEdit?.diagnosticType || null,

      //text
      grafanaLink: this?.hdwIssueToEdit?.grafanaLink || "",
      comments: this?.hdwIssueToedit?.comments || null,
      angles: this?.hdwIssueToEdit?.angles  || null,
      gateway_satellite_power: this?.hdwIssueToEdit?.gateway_satellite_power  || null,
      packet_202_count: this?.hdwIssueToEdit?.packet_202_count  || null,
      packet_203_count: this?.hdwIssueToEdit?.packet_203_count  || null,
      battery_2to3: this?.hdwIssueToEdit?.battery_2to3  || null,
      positions: this?.hdwIssueToEdit?.positions  || null,
      lost_packets: this?.hdwIssueToEdit?.lost_packets  || null,
      node_to_gateway_distance_in_meters: this?.hdwIssueToEdit?.node_to_gateway_distance_in_meters  || null,
      gateway_first_data_transmission_date: this?.hdwIssueToEdit?.gateway_first_data_transmission_date  || null,
      height_difference_in_meters: this?.hdwIssueToEdit?.height_difference_in_meters  || null,
      to_hour: this?.hdwIssueToEdit?.to_hour  || null,
      from_hour: this?.hdwIssueToEdit?.from_hour  || null,
      pressure_difference: this?.hdwIssueToEdit?.pressure_difference  || null,
      altimetry_image: this?.hdwIssueToEdit?.altimetry_image || null,

      //dropdown options
      irrigatorOptions: [],
      diagnosticTypes: [],
      positionOptions: [
        { name: "Nulas", value: "null" },
        { name: "No nulas", value: "non-null" },
      ],
      submitted: false,
    };
  },
  methods: {
    async onSubmit(isFormValid) {
      this.submitted = true;
      if(!isFormValid) return;
      try {
        this.loading = true;
        let result;
        if(!this.hdwIssueToEdit) {
            result = await createHdwIssueMutation(
              new Date(),
              this.diagnosticDate,
              this.selectedIrrigator,
              this.selectedDiagnosticType.id,
              this.grafanaLink,
              this.comments,
              this.angles,
              this.gateway_satellite_power,
              this.packet_202_count,
              this.packet_203_count,
              this.battery_2to3,
              this.positions?.value,
              this.lost_packets,
              this.node_to_gateway_distance_in_meters,
              this.gateway_first_data_transmission_date,
              this.height_difference_in_meters,
              this.to_hour,
              this.from_hour,
              this.pressure_difference,
              this.altimetry_image
            );
        
          if (!result?.data?.createHdwIssue?.id)
            throw new Error("Missing Hdw Issue ID. Possible server error.");
        }
        else {
          result = await addDiagnosticToHdwIssueMutation(
              this.hdwIssueToEdit.id,
              this.diagnosticDate,
              this.selectedDiagnosticType.id,
              this.grafanaLink,
              this.comments,
              this.angles,
              this.gateway_satellite_power,
              this.packet_202_count,
              this.packet_203_count,
              this.battery_2to3,
              this.positions?.value,
              this.lost_packets,
              this.node_to_gateway_distance_in_meters,
              this.gateway_first_data_transmission_date,
              this.height_difference_in_meters,
              this.to_hour,
              this.from_hour,
              this.pressure_difference,
              this.altimetry_image
          )
        }
          
        this.computedIsOpen = false;
        this.$router.go();
      } catch (e) {
        this.error = e;
        this.loading = false;
      }
    },
    onCancel() {
      this.computedIsOpen = false;
      this.$router.push("/issues");
    },
    imageUploadHandler(event) {
      this.altimetry_image = event.files[0];
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
    //todo: error han dling
    this.loading = true;
    //populate dropdowns
    const result = await getIrrigatorsQuery();
    const irrigators = result.data.irrigators;
    this.irrigatorOptions = irrigators.map((irr) => ({
      name: irr.integration_id,
      code: irr.id,
    }));

    this.selectedIrrigator = this?.hdwIssueToEdit?.irrigator?.id 
    if(this.selectedIrrigatorId)
      this.selectedIrrigator = this.selectedIrrigatorId;

    const dtypesraw = await getDiagnosticTypesQuery();
    const diagnosticTypes = dtypesraw.data.diagnosticTypes;
    this.diagnosticTypes = diagnosticTypes.map((d) => ({
      name: `${d.type.name} - ${d.name}`,
      code: d.id,
      ...d,
    }));

    this.loading = false;
  },
  async beforeUpdate(){
    
    this.selectedIrrigator = this?.hdwIssueToEdit?.irrigator?.id 
  }
};
</script>

<style scoped>
</style>