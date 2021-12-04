<template>
  <Dialog
    header="Creación de Hardware Issue"
    v-model:visible="computedIsOpen"
    :style="{ width: '50vw' }"
    :modal="true"
  >
    <div class="card">
      <div class="field">
        <label for="creationDate">Creation Date</label>
        <Calendar
          class="inputfield w-full"
          id="creationDate"
          v-model="creationDate"
          :showIcon="true"
        />
      </div>
      <!-- <div class="field">
            <label for="assignationDate">Assignation Date</label>
            <Calendar class="inputfield w-full" id="assignationDate" v-model="assignationDate" :showIcon="true" :showTime="true" :showSeconds="false"/>
        </div>
        <div class="field">
            <label for="fieldRepairDate">Field Repair Date</label>
            <Calendar class="inputfield w-full" id="fieldRepairDate" v-model="fieldRepairDate" :showIcon="true" :showTime="true" :showSeconds="false"/>
        </div> -->
      <div class="field">
        <label for="gtw">Irrigator</label>
        <Dropdown
          id="irrigator"
          :filter="true"
          class="inputfield w-full"
          v-model="selectedIrrigator"
          :options="irrigatorOptions"
          optionLabel="name"
          optionValue="code"
          placeholder="Select an Irrigator"
        />
      </div>
      <div class="field">
        <label for="hdwIssueDescription">Hardware Issue</label>
        <InputText
          id="hdwIssueDescription"
          v-model="hdwIssueDescription"
          type="text"
          class="inputfield w-full"
        />
      </div>
      <div class="field">
        <label for="device">Device</label>
        <Dropdown
          id="device"
          class="inputfield w-full"
          v-model="selectedDevice"
          :options="deviceOptions"
          optionLabel="name"
          optionValue="code"
          placeholder="Select a device"
        />
      </div>
      <div class="field">
        <label for="rootCause">Root</label>
        <InputText
          id="rootCause"
          v-model="rootCause"
          type="text"
          class="inputfield w-full"
        />
      </div>
      <div class="field">
        <label for="gtw">Gateway Id</label>
        <Dropdown
          id="gtw"
          :filter="true"
          class="inputfield w-full"
          v-model="selectedGtw"
          :options="gtwOptions"
          optionLabel="name"
          optionValue="code"
          placeholder="Select a Gateway"
        />
      </div>
      <div class="field">
        <label for="gpsNode">Node Id</label>
        <Dropdown
          id="gpsNode"
          :filter="true"
          class="inputfield w-full"
          v-model="selectedGpsNode"
          :options="gpsNodeOptions"
          optionLabel="name"
          optionValue="code"
          placeholder="Select a Gps Node"
        />
      </div>
      <div class="field">
        <label for="pressureSensor">Pressure Sensor Id</label>
        <Dropdown
          id="pressureSensor"
          :filter="true"
          class="inputfield w-full"
          v-model="selectedPressureSensor"
          :options="pressureSensorOptions"
          optionLabel="name"
          optionValue="code"
          placeholder="Select a Pressure Sensor"
        />
      </div>
      <div class="field">
        <label for="status">Status</label>
        <InputText
          id="status"
          v-model="status"
          type="text"
          class="inputfield w-full"
        />
      </div>
      <div class="field">
        <label for="assignedTechnician">Assigned Technician</label>
        <Dropdown
          id="assignedTechnician"
          :filter="true"
          class="inputfield w-full"
          v-model="assignedTechnician"
          :options="assignedTechnicianOptions"
          optionLabel="name"
          optionValue="code"
          placeholder="Select a Technician"
        />
      </div>
    </div>
    <template #footer>
      <Button
        class="p-button-success"
        icon="pi pi-check"
        label="Submit"
        @click="onSubmit"
        :loading="loading"
      />
      <Button
        class="p-button-secondary"
        icon="pi pi-times"
        label="Cancel"
        @click="onCancel"
        :loading="loading"
      />
    </template>
  </Dialog>
</template>

<script>
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import { getGatewaysQuery, getIrrigatorsQuery } from "../api/apiRequests";

export default {
  name: "HdwIssueCreationDialog",
  components: {
    InputText,
    Calendar,
    Dropdown,
  },
  props: ["isOpen", "selectedIrrigatorId"],
  data() {
    return {
      loading: false,
      //dates
      creationDate: new Date(),
      assignationDate: null,
      fieldRepairDate: null,

      //dropdown selectors
      selectedIrrigator: this.selectedIrrigatorId || null,
      selectedDevice: null,
      selectedGtw: null,
      selectedGpsNode: null,
      selectedPressureSensor: null,
      assignedTechnician: null,

      //strings
      hdwIssueDescription: "",
      rootCause: "",
      status: "",

      //dropdown options
      deviceOptions: [
        { name: "Gateway", code: "GTW" },
        { name: "Gps Node", code: "NODE" },
        { name: "Pressure Sensor", code: "SPRES" },
      ],
      pressureSensorOptions: [
        { name: "PRES123", code: "PRES123" },
        { name: "PRES333", code: "PRES333" },
        { name: "PRES223", code: "PRES223" },
      ],
      gpsNodeOptions: [
        { name: "NODO123", code: "NODO123" },
        { name: "NODO456", code: "NODO456" },
        { name: "NODO433", code: "NODO433" },
      ],
      gtwOptions: [
        { name: "GTW735", code: "1be96856-4214-4f69-b715-ca8a34ffe4d5" },
        { name: "GTW456", code: "GTW456" },
        { name: "GTW789", code: "GTW789" },
      ],
      assignedTechnicianOptions: [
        { name: "Lucas Perez", code: "asdasdas@gmail.com" },
        { name: "Hardco Deado", code: "bebedsds@gmail.com" },
        { name: "Miguel Lopez", code: "aeuaea@hotmail.com" },
      ],
    };
  },
  methods: {
    onSubmit() {
      console.log("onsubmit todo!!");
      //TODO
    },
    onCancel() {
      this.computedIsOpen = false;
      this.$router.push("/issues");
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
    if (this.selectedIrrigatorId) {
      //fetch irrigator data;
      const result = await getIrrigatorsQuery(this.selectedIrrigatorId);
      const irrigator = result.data.irrigators[0];
      console.log(irrigator);
      this.selectedGtw = irrigator.gateway.id;
      this.selectedGpsNode = irrigator.gpsNode.id;
    }

    //populate dropdowns

    const result = await getGatewaysQuery();
    this.gtwOptions = result.data.gateways.map((gtw) => ({
      name: gtw.integrationId,
      code: gtw.id,
    }));

    this.loading = false;
  },
};
</script>

<style scoped>
</style>