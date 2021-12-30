<template>
  <Dialog
    header="Nueva pericia"
    v-model:visible="computedIsOpen"
    :style="{ width: '50vw' }"
    :modal="true"
  >
    <div class="grid">
      <div class="col-12">
        <div class="flex justify-content-start flex-wrap">
          <div class="flex align-items-center justify-content-center mx-3 mt-3">
            <p class="w-3 text-left font-bold text-blue-500">Fecha</p>
          </div>
          <div
            class="flex align-items-center w-7 justify-content-center mx-3 mt-3"
          >
            <Calendar
              :show-icon="true"
              v-model="calendarValue"
              dateFormat="yy-mm-dd"
            ></Calendar>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="flex justify-content-start flex-wrap">
          <div class="flex align-items-center justify-content-center mx-3 mt-3">
            <p class="text-left font-bold w-7 text-blue-500">
              Dispositivo con fallas
            </p>
          </div>
          <div
            class="flex align-items-center w-7 justify-content-center h-2 mt-3"
          >
            <Dropdown
              v-model="assetType"
              :options="assetTypes"
              optionLabel="name"
              placeholder="Dispositivo con fallas"
            />
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="flex justify-content-start flex-wrap">
          <div class="flex align-items-center justify-content-center mx-3 mt-3">
            <p class="w-3 text-left font-bold text-blue-500">Tipo</p>
          </div>
          <div
            class="flex align-items-center w-7 justify-content-center h-2 mt-3"
          >
            <Dropdown
              v-model="inspectionType"
              :options="inspectionTypes"
              optionLabel="name"
              placeholder="Tipo de pericia"
            />
          </div>
        </div>
      </div>
      <div class="p-field-checkbox">
        <Checkbox
          id="jumper_wifi"
          name="jumper_wifi"
          :binary="true"
          v-model="jumper_wifi"
        />
        <label for="jumper_wifi">Jumper WiFi Conectado</label>
      </div>
      <div class="col-12 px-4">
        <div class="field">
          <label for="led_gtw">Color del LED del Gateway</label>
          <InputText
            id="led_gtw"
            v-model="led_gtw"
            type="text"
            class="inputfield w-full"
          />
        </div>
      </div>
      <div class="col-12 px-4">
        <div class="flex align-items-center justify-content-center mx-3 mt-3">
          <p class="w-12 text-left font-bold text-blue-500">Comentarios</p>
        </div>
        <div
          class="
            flex
            align-items-center
            w-14
            justify-content-center
            mx-3
            pr-2
            mt-3
          "
        >
          <Textarea
            placeholder="Observaciones acerca de la pericia"
            v-model="comments"
            :autoResize="true"
            rows="2"
            cols="70"
          ></Textarea>
        </div>
      </div>
      <div class="col-12 px-4">
        <div class="flex align-items-center justify-content-center mx-3 mt-3">
          <p class="w-12 text-left font-bold text-blue-500">Imagen</p>
        </div>
        <FileUpload
          name="image_upload"
          :customUpload="true"
          @uploader="imageUploadHandler"
          mode="basic"
          accept="image/*"
          :auto="true"
        />
        <InlineMessage v-if="!!this.image_file" severity="success"
          >Cargado {{ this.image_file.name }}</InlineMessage
        >
      </div>
      <div class="col-12 px-4">
        <div class="flex align-items-center justify-content-center mx-3 mt-3">
          <p class="w-12 text-left font-bold text-blue-500">Log del dispositivo</p>
        </div>
        <FileUpload
          name="log_upload"
          :customUpload="true"
          @uploader="logUploadHandler"
          mode="basic"
          :auto="true"
        />
        <InlineMessage v-if="!!this.log_file" severity="success"
          >Cargado {{ this.log_file.name }}</InlineMessage
        >
      </div>
      <div class="col-12 mt-2">
        <div class="flex justify-content-end flex-wrap">
          <div class="flex align-items-center justify-content-center mx-3 mt-3">
            <Button
              class="p-button-success"
              icon="pi pi-check"
              label="Guardar"
              @click="onSubmit"
              :loading="loading"
            />
          </div>
          <div class="flex align-items-center justify-content-center mx-3 mt-3">
            <Button
              class="p-button-secondary"
              icon="pi pi-times"
              label="Cancelar"
              @click="onCancel"
              :loading="loading"
            />
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script>
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";
import InlineMessage from "primevue/inlinemessage";
import FileUpload from "primevue/fileupload";
import {
  getAssetTypesQuery,
  getInspectionTypesQuery,
} from "../../api/apiRequests";

export default {
  name: "InspectionDialog",
  props: ["isOpen"],
  components: {
    Textarea,
    Checkbox,
    FileUpload,
    InlineMessage,
  },
  data() {
    return {
      inspection: null,
      loading: false,
      error: null,
      comments: "",
      calendarValue: null,
      inspectionTypes: [],
      inspectionType: null,
      assetType: null,
      jumper_wifi: false,
      led_gtw: "",
      log_file: null,
      image_file: null,
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 750);
    },
    onCancel() {
      this.computedIsOpen = false;
      this.inspection= null;
      this.loading= false;
      this.error= null;
      this.comments= "";
      this.calendarValue= null;
      this.inspectionType= null;
      this.assetType= null;
      this.jumper_wifi= false;
      this.led_gtw= "";
      this.log_file= null;
      this.image_file= null;
    },
    imageUploadHandler(event) {
      console.log("hola image");
      console.log(event);
      this.image_file = event.files[0];
    },
    logUploadHandler(event) {
      console.log("hola log");
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
        this.$emit("issueUpdated", value);
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