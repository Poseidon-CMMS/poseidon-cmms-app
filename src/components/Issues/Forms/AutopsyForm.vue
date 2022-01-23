<template>
  <Dialog
    header="Nueva autopsia"
    v-model:visible="computedIsOpen"
    class="w-screen lg:w-6"
    :modal="true"
  >
    <div class="card">
      <form id="autopsy-form" @submit.prevent="onSubmit(!v$.$invalid)" class="p-fluid">
      <div class="field">
        <label for="date">Fecha de autopsia: </label>
        <Calendar
          id="date"
          :show-icon="true"
          v-model="date"
          dateFormat="yy-mm-dd"
          class="inputfield ml-2"
          :showTime="true"
          :showSeconds="true"
        />
        <div><small v-if="(v$.date.$invalid && submitted) || v$.date.$pending.$response" class="p-error">{{v$.date.required.$message.replace('Value', 'Fecha de autopsia')}}</small></div>

      </div>
      <div class="field">
        <label for="comments">Comentarios</label>
        <Textarea
          id="comments"
          placeholder="Observaciones acerca de la autopsia"
          v-model="comments"
          :autoResize="true"
          class="inputfield w-full"
          rows="2"
          cols="70"
        />
        <div><small v-if="(v$.comments.$invalid && submitted) || v$.comments.$pending.$response" class="p-error">{{v$.comments.required.$message.replace('Value', 'Comentarios')}}</small></div>

      </div>

      <div class="field">
        <label for="autopsyType">Tipo de autopsia</label>
        <Dropdown
          id="autopsyType"
          v-model="autopsyType"
          :options="autopsyTypes"
          optionLabel="name"
          :filter="true"
          class="inputfield w-full"
          placeholder="Tipo de autopsia"
        />
        <div><small v-if="(v$.autopsyType.$invalid && submitted) || v$.autopsyType.$pending.$response" class="p-error">{{v$.autopsyType.required.$message.replace('Value', 'Tipo de autopsia')}}</small></div>

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
          <p class="text-left font-bold text-blue-500">Archivo autodiagnóstico</p>
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
            @uploader="selfDiagnosticFileUploadHandler"
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
          <InlineMessage v-if="!!this.selfDiagnosticFile" severity="success"
            >Cargado {{ this.selfDiagnosticFile.name }}</InlineMessage
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
            Log de presión
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
            @uploader="pressureLogUploadHandler"
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
          <InlineMessage v-if="!!this.pressureLog" severity="success"
            >Cargado {{ this.pressureLog.name }}</InlineMessage
          >
        </div>
      </div>
      </form>
    </div>
    <template #footer>
      <Message v-if="!!error" severity="error" @close="onErrorClose">
        {{error}}
      </Message>
      <div class="mt-2">
        <Button
          class="p-button-success"
          icon="pi pi-check"
          label="Guardar"
          form="autopsy-form"
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
import Textarea from "primevue/textarea";
import Calendar from 'primevue/calendar';
import FileUpload from 'primevue/fileupload';
import InlineMessage from 'primevue/inlinemessage';

import { createAutopsyMutation, getAutopsyTypesQuery } from '../../../api/apiRequests';
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

function initialData() {
  return {
    loading: false,
    error: null,
    date: null,
    comments: null,
    pressureLog: null,
    selfDiagnosticFile: null,
    autopsyType: null,
    autopsyTypes: [],
    submitted: false
  };
}

export default {
  name: "AutopsyForm",
  props: ["isOpen", "selectedIssue"],
  emits: ["updateIsOpen", "issueUpdated"],
  components: {
    Message,
    Textarea,
    Calendar,
    FileUpload,
    InlineMessage,
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
        date: {
            required
        },
        comments: {
            required
        },
        autopsyType: {
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
      try{
        
      this.loading = true;
      const user_id = sessionStorage.getItem("id");
      const autopsyResult = await createAutopsyMutation(
        //TODO: validar q todos los campso esten completos
        this.date,
        user_id,
        this.selectedIssue.id,
        this.comments,
        this.pressureLog,
        this.selfDiagnosticFile,
        this.autopsyType.id,
      );
      const newAutopsy = autopsyResult.data.createautopsy;
      if (newAutopsy.id) {
        this.showSuccess();
        const newIssue = {
          ...this.selectedIssue, 
          autopsy: this.selectedIssue.autopsy? [...this.selectedIssue.autopsy, newAutopsy]: [newAutopsy],
          status: "closed"
        }
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
      Object.assign(this.$data, initialData());
    },
    showSuccess() {
      this.$toast.add({
        severity: "success",
        summary: "Autopsia creada correctamente",
        detail: "creacion: " + this.date,
        life: 3000,
      });
    },
    showError() {
      this.$toast.add({
        severity: "error",
        summary: "Error al crear la autopsia",
        detail: "error",
        life: 3000,
      });
    },
    onCancel() {
      this.resetWindow();
      this.computedIsOpen = false;
    },
    selfDiagnosticFileUploadHandler(event) {
      this.selfDiagnosticFile = event.files[0];
    },
    pressureLogUploadHandler(event) {
      this.pressureLog = event.files[0];
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
    this.loading = true;

    this.autopsyTypes = (
      await getAutopsyTypesQuery()
    ).data.autopsyTypes;

    this.loading = false;
  },
};
</script>

<style scoped>
</style>