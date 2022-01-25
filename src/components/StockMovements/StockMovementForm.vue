<template>
  <Dialog
    header="Corrección de stock"
    v-model:visible="computedIsOpen"
    class="w-screen lg:w-6"
    :modal="true"
  >
    <div class="card">
      <form id="stock-movement-form" @submit.prevent="onSubmit(!v$.$invalid)" class="p-fluid">
        <div class="field">
        <label for="location_from">Almacenamiento origen</label>
        <Dropdown
          id="location_from"
          v-model="selectedLocationFrom"
          :options="locations"
          optionLabel="name"
          class="inputfield w-full"
          placeholder="Origen"
        />
        <div><small v-if="(v$.selectedLocationFrom.$invalid && submitted) || v$.selectedLocationFrom.$pending.$response" class="p-error">{{v$.selectedLocationFrom.required.$message.replace('Value', 'Almacenamiento origen')}}</small></div>
      </div>
      <div class="field">
        <label for="location_to">Almacenamiento destino</label>
        <Dropdown
          id="location_to"
          v-model="selectedLocationTo"
          :options="locations"
          optionLabel="name"
          class="inputfield w-full"
          placeholder="Destino"
        />
        <div><small v-if="(v$.selectedLocationFrom.$invalid && submitted) || v$.selectedLocationFrom.$pending.$response" class="p-error">{{v$.selectedLocationFrom.required.$message.replace('Value', 'Almacenamiento origen')}}</small></div>
      </div>
      <div class="field">
        <label for="asset_type">Tipo de dispositivo</label>
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
          assetType?.name === 'Gateway'
        "
      >
        <label for="gateway">Gateway transladado</label>
        <Dropdown
          id="gateway"
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
          assetType?.name == 'Nodo GPS'
        "
      >
        <label for="selectedGpsNode">Nodo GPS transldado</label>
        <Dropdown
          id="selectedGpsNode"
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
          assetType?.name == 'Sensor de Presión'
        "
      >
        <label for="selectedPressureSensor">Sensor de presión transladado</label>
        <Dropdown
          id="selectedPressureSensor"
          v-model="selectedPressureSensor"
          :options="pressureSensors"
          optionLabel="integration_id"
          class="inputfield w-full"
          placeholder="Sensor de presión"
        />
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
          form="stock-movement-form"
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
import Message from "primevue/message";
import SelectButton from "primevue/selectbutton";
import {
  getAssetTypesQuery,
  getGatewaysQuery,
  getGpsNodesQuery,
  getPressureSensorsQuery,
  getStorageLocationsQuery,
  createStockMovementMutation,
} from "../../api/apiRequests";
import { dateFormatter } from "../../utils/dateFormatter.js";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

function initialData(avoidDeletingDropdowns = false) {
  let initialData = {
    error: null,
    //campos
    selectedLocationFrom: null,
    selectedLocationTo: false,
    assetType: null,
    selectedGateway: null,
    selectedPressureSensor: null,
    selectedGpsNode: null,
    locations: []
  };
  if (!avoidDeletingDropdowns)
    initialData = {
      ...initialData,
      assetTypes: [],
      pressureSensors: [],
      gpsNodes: [],
      gateways: [],
    };
  return initialData;
}

export default {
  name: "RepairForm",
  props: ["isOpen"],
  emits: ["updateIsOpen", "stockMovementUpdated"],
  components: {
    Message,
    SelectButton,
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
        selectedLocationFrom: {
            required
        },
        selectedLocationTo: {
            required
        },
        assetType: {
            required
        }
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
        const creationDate = new Date();
        const user_id = sessionStorage.getItem("id");
        const stockMovementCreated = await createStockMovementMutation(
          creationDate,
          this.selectedLocationFrom?.id,
          this.selectedLocationTo?.id,
          this.selectedGateway?.id,
          this.selectedGpsNode?.id,
          this.selectedPressureSensor?.id,
          user_id
        );

        if (stockMovementCreated.data.createStockMovement.id) {
          this.showSuccess();
          this.$emit("stockMovementUpdated", stockMovementCreated.data.createStockMovement);
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
        summary: "Movimiento de stock creado correctamente",
        detail: "",
        life: 3000,
      });
    },
    showError() {
      this.$toast.add({
        severity: "error",
        summary: "Error al crear el movimiento de stock",
        detail: "error",
        life: 3000,
      });
    },
    onCancel() {
      this.resetWindow();
      this.computedIsOpen = false;
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
    this.gateways = (await getGatewaysQuery()).data.gateways; //todo: error handling y traer solo las del tecnico
    this.pressureSensors = (
      await getPressureSensorsQuery()
    ).data.pressureSensors; //todo: error handling y traer solo las del tecnico
    this.gpsNodes = (await getGpsNodesQuery()).data.gpsNodes; //todo: error handling y traer solo las del tecnico
    this.locations = (await getStorageLocationsQuery()).data.storageLocations; 

    this.loading = false;
  },
};
</script>

<style scoped>
</style>