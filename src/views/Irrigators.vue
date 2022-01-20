<template>
  <!-- <div class="grid mt-3 mb-5">
    <div class="col">
      <metric-card 
        titleCard="Issues no asignados"
        color="bg-yellow-400"
        contentCard="23"
        comments="hoy"
        colorComments="2 nuevos"
        icon="pi pi-exclamation-circle"
      />
    </div>
    <div class="col">
      <metric-card 
        titleCard="Sin diagnóstico"
        color="bg-green-400"
        contentCard="11"
        comments="de hoy"
        colorComments="1 equipo"
        icon="pi pi-question-circle"
      />
    </div>
    <div class="col">
      <metric-card 
        titleCard="Autopsia"
        color="bg-purple-400"
        contentCard="2"
        comments="de la última autopsia"
        colorComments="2 meses"
        icon="pi pi-hashtag"
      />
    </div>  
  </div> -->
  <div class="mt-5">
    <table-irrigators />
  </div>
</template>

<script>
import TableIrrigators from '../components/Irrigators/TableIrrigators.vue'; 

export default {
  name: 'Dashboard',
  components: {
    TableIrrigators
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
