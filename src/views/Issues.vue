<template>
    <div class="grid text-sm mt-3">
      <div class="col-3">
        <dragable-list title="In field" :list='inFieldList' :log='inFieldLog'/>
      </div>
      <div class="col-3">
        <dragable-list title="Assigned" :list='assignedList' :log='assignedLog'/>
      </div>
      <div class="col-3">
        <dragable-list title="Repaired" :list='repairedList' :log='repairedLog'/>
      </div>
      <div class="col-3">
        <dragable-list title="Out of field" :list='outOfFieldList' :log='outOfFieldLog'/>
      </div>
    </div>
    <div class="grid text-sm">
      <div class="col-12 my-4">
        <Card>
            <template #title>
                Simple Card
            </template>
            <template #content>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
                quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!</p>
            </template>
        </Card>
      </div>
    </div>
    
</template>

<script>
import DragableList from '../components/DragableList';

export default {
  name: 'Dashboard',
  components: {
    DragableList
  },
  methods: {
    inFieldLog: function(evt) {
      console.log('In field: ' + evt);
    },
    assignedLog: function(evt) {
      console.log('Assigned: ' + evt);
    },
    repairedLog: function(evt) {
      console.log('Repaired: ' + evt);
    },
    outOfFieldLog: function(evt) {
      console.log('Out of field: ' + evt);
    },
  },
  data() {
    return {
        inFieldList: [
        { name:'Presión en 0mA (203)', client: { name: "John" }, field: {name: 'Campo1'},  irrigator:{name:'El alemán'} },
        { name:'Presión en 0mA (203)', client: { name: "John" }, field: {name: 'Campo1'},  irrigator:{name:'El alemán'} },
        { name:'Presión en 0mA (203)', client: { name: "John" }, field: {name: 'Campo1'},  irrigator:{name:'El alemán'} },
        { name:'Presión en 0mA (203)', client: { name: "John" }, field: {name: 'Campo1'},  irrigator:{name:'El alemán'} },
      ],
      assignedList: [
        { name:'Presión en 0mA (203)', client: { name: "John" }, field: {name: 'Campo1'},  irrigator:{name:'El alemán'} },
      ],
      repairedList: [
        { name:'Presión en 0mA (203)', client: { name: "John" }, field: {name: 'Campo1'},  irrigator:{name:'El alemán'} },
      ],
      outOfFieldList: [
        { name:'Presión en 0mA (203)', client: { name: "John" }, field: {name: 'Campo1'},  irrigator:{name:'El alemán'} },
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
