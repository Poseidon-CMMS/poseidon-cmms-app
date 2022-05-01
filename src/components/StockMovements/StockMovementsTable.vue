<template>
  <!-- Tabla -->
  <Message v-if="!!error" severity="error" @close="onErrorClose">{{error}}</Message>
  <data-table
    :rowHover="true"
    :loading="loading"
    :value="stockMovements"
    v-model:selection="selectedStockMovement"
    selectionMode="single"
    responsiveLayout="scroll"
    @rowSelect="onRowSelect"
  >
    <template #header>
      <p class="text-2xl font-semibold m-0">Movimientos de Stock</p>
    </template>
    <template #empty> 
      <div class="flex align-items-center border-bottom-1 surface-border surface-overlay w-full">
        <p class="text-2xl w-">Sin datos de stock.</p>
      </div>
    </template>
    <template #loading> 
      <div class="flex align-items-center border-bottom-1 surface-border surface-overlay w-full">
        <p class="text-2xl w-10">Cargando datos...</p>
      </div>  
    </template>
    <column field="id" header="Id" :sortable="true"></column>
    <column field="date" header="Fecha" :sortable="true">
        <template #body="{data}">
          {{dateFormatter(data?.date)}}
      </template>
    </column>
    <column field="location_from.name" header="Desde" :sortable="true">
        <template #body="{data}">
            {{data?.location_from?.name || 'Equipo de riego'}}
        </template></column>
    <column field="location_to.name" header="Hacia" :sortable="true">
        <template #body="{data}">
            {{data?.location_to?.name || 'Equipo de riego'}}
        </template></column>
    <column field="author" header="Autor" :sortable="true">
        <template #body="{data}">
            {{data?.author?`${data?.author?.name}&lt;${data?.author?.email}>` :'Automático'}}
        </template>
    </column>
    <column field="asset_type" header="Tipo" :sortable="true">
      <template #body="{data}">
          {{data?.gateway?"GTW":data?.gps_node?"SGPS":data?.pressure_sensor?"SPRES":"Desconocido"}}
      </template>
    </column>
    <column field="asset_id" header="Asset ID" :sortable="true">
      <template #body="{data}">
          {{data?.gateway?.integration_id || data?.gps_node?.integration_id || data?.pressure_sensor?.integration_id || "Desconocido"}}
      </template>
    </column>
  </data-table>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Message from "primevue/message";

import { FilterMatchMode } from "primevue/api";
import {dateFormatter} from "../../utils/dateFormatter";

export default {
  name: "TableStockMovements",
  components: {
    DataTable,
    Column,
    Message,
  },
  props: ["stockMovements", "loading"],
  data() {
    return {
      error: '',
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      selectedStockMovement: null,
    };
  },
  methods: {
    dateFormatter,
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .status-badge {
          border-radius: 2px;
          padding: .25em .5rem;
          text-transform: uppercase;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: .3px;
  }
  .status-badge.status-transmitting {
        background-color: #C8E6C9;
        color: #256029;
    }

  .status-badge.status-error{
      background-color: #FFCDD2;
      color: #C63737;
  }

  .status-badge.status-noTelemetry {
      background-color: #B3E5FC;
      color: #23547B;
  }
</style>
