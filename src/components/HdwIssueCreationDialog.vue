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
      <div class="field">
        <label for="diagnosticDate">Diagnostic Date</label>
        <Calendar
          class="inputfield w-full"
          id="diagnosticDate"
          v-model="diagnosticDate"
          :showIcon="true"
        />
      </div>
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
        <label for="diagnostic">Diagnostic</label>
        <Dropdown
          id="diagnostic"
          class="inputfield w-full"
          v-model="selectedDiagnostic"
          :options="diagnosticOptions"
          optionLabel="name"
          optionValue="code"
          placeholder="Select a diagnostic"
        />
      </div>
      <div class="field">
        <label for="grafanaLink">Grafana Link</label>
        <InputText
          id="grafanaLink"
          v-model="grafanaLink"
          type="text"
          class="inputfield w-full"
        />
      </div>
      <div class="field">
        <label for="observartions">Observations</label>
        <InputText
          id="observations"
          v-model="observations"
          type="text"
          class="inputfield w-full"
        />
      </div>
    </div>
    <template #footer>
    <Message v-if="!!error" severity="error" @close="onErrorClose">{{error}}</Message>
    <div class='mt-2'>
      <ion-button color="medium" icon="pi pi-check" @click="onCancel" :loading="loading">
          <i class="pi pi-times mr-1"></i> Cancel
      </ion-button>
      <ion-button color="success" icon="pi pi-check" @click="onSubmit" :loading="loading">
          <i class="pi pi-check mr-1"></i> Submit
      </ion-button>
    </div>
    </template>
  </Dialog>
</template>

<script>
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import Message from "primevue/message";
import { IonButton } from '@ionic/vue';

import {
  getDiagnosticTypesQuery,
  getIrrigatorsQuery,
  createHdwIssueMutation,
} from "../api/apiRequests";


export default {
  name: "HdwIssueCreationDialog",
  components: {
    InputText,
    Calendar,
    Dropdown,
    Message,
    IonButton
  },
  props: ["isOpen", "selectedIrrigatorId"],
  data() {
    return {
      loading: false,
      error: null,
      //dates
      creationDate: new Date(),
      diagnosticDate: new Date(),

      //selectables
      selectedIrrigator: this.selectedIrrigatorId || null,
      selectedDiagnostic: null,

      //text
      grafanaLink: "",
      observations: "",

      //dropdown options
      irrigatorOptions: [],
      diagnosticOptions: [],
    };
  },
  methods: {
    async onSubmit() {
      try {
        this.loading = true;
        const result = await createHdwIssueMutation(
          this.creationDate,
          this.diagnosticDate,
          this.selectedIrrigator,
          this.selectedDiagnostic,
          this.grafanaLink,
          this.observations
        );
        if (!result?.data?.createHdwIssue?.id)
          throw new Error("Missing Hdw Issue ID. Possible server error.");
        this.computedIsOpen = false;
        this.$router.push("/issues");
      } catch (e) {
        this.error = e;
        this.loading = false;
      }
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
    this.selectedIrrigator = this.selectedIrrigatorId || null;

    //populate dropdowns
    const result = await getIrrigatorsQuery();
    const irrigators = result.data.irrigators;
    this.irrigatorOptions = irrigators.map((irr) => ({
      name: irr.integrationID,
      code: irr.id,
    }));

    const dtypesraw = await getDiagnosticTypesQuery();
    const diagnosticTypes = dtypesraw.data.diagnosticTypes;
    this.diagnosticOptions = diagnosticTypes.map((d) => ({
      name: d.name,
      code: d.id,
    }));

    this.loading = false;
  },
};
</script>

<style scoped>
</style>