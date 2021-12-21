<template>
  <Dialog
    header="Nueva pericia"
    v-model:visible="computedIsOpen"
    :style="{ width: '50vw' }"
    :modal="true"  
  >
    <div class="grid">
      <div class="col-12 xl:col-6">
        <div class="flex justify-content-start flex-wrap">
          <div class="flex align-items-center justify-content-center mx-3 mt-3">
             <p class="w-3 text-left font-bold text-blue-500">Fecha</p>
          </div>
          <div class="flex align-items-center w-7 justify-content-center mx-3 mt-3">
            <Calendar :show-icon="true" v-model="calendarValue" dateFormat="yy-mm-dd"></Calendar>
          </div>
        </div>
      </div>
      <div class="col-12 xl:col-6">
        <div class="flex justify-content-start flex-wrap">
          <div class="flex align-items-center justify-content-center mx-3 mt-3">
             <p class="w-3 text-left font-bold text-blue-500">Tipo</p>
          </div>
          <div class="flex align-items-center w-7 justify-content-center h-2 mt-3">
            <Dropdown v-model="inspectionType" :options="inspectionTypes" optionLabel="name" placeholder="Tipo de pericia" />
          </div>
        </div>
      </div>
      <div class="col-12 px-4">
        <div class="flex align-items-center justify-content-center mx-3 mt-3">
          <p class="w-12 text-left font-bold text-blue-500">Comentarios</p>
        </div>
        <div class="flex align-items-center w-14 justify-content-center mx-3 pr-2 mt-3">
          <Textarea placeholder="Observaciones acerca de la pericia" v-model="comments" :autoResize="true" rows="2" cols="70"></Textarea>
        </div>
      </div>
      <div class="col-12 mt-2">
        <div class="flex justify-content-end flex-wrap">
          <div class="flex align-items-center justify-content-center mx-3 mt-3">
            <Button class="p-button-success" icon="pi pi-check" label="Guardar" @click="onSubmit" :loading="loading"/>
          </div>
          <div class="flex align-items-center justify-content-center mx-3 mt-3">
            <Button class="p-button-secondary" icon="pi pi-times" label="Cancelar" @click="onCancel" :loading="loading"/>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script>

import Textarea from 'primevue/textarea';

export default {
  name: "InspectionDialog",
  props: ["isOpen"],
  components: {
    Textarea
  },
  data() {
    return {
      inspection: null,
      loading: false,
      error: null,
      comments: "",
      calendarValue: null,
      inspectionTypes: [],
      inspectionType: null
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      console.log(this.comments);
      setTimeout(() => {
          this.loading = false;
        }, 750);
    },
    onCancel() {
      this.computedIsOpen = false;
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
  beforeMount() {
    this.inspectionTypes = [{id: 1, name: "Pericia 1"}, {id:2, name:"Pericia 2"}];
    this.loading = false;
  },
};
</script>

<style scoped>
</style>