<template>
<div class="card">
    
</div>
  <Card style="width: 20rem; margin: auto auto">
    <template #title>
      <div class="flex justify-content-between flex-wrap card-container purple-container">
        <div class="flex align-items-center justify-content-center w-12rem h-4rem font-bold border-round m-2">
            {{titleCard}}
        </div>
        <div class="flex align-items-center justify-content-center w-4rem h-4rem font-bold border-round m-2">
          <div :class='color' class="text-white font-bold border-round m-4 flex align-items-center justify-content-center" style="min-width: 40px; min-height: 40px">
            <i :class='icon' style="fontSize: 1.5rem" />
          </div>
        </div>
      </div>
    </template>
    <template #content>
      <div class="flex align-items-start">
        <p class="text-6xl w-12 card">{{contentCard}}</p>
      </div>
    </template>
    <template #footer>
      <span class="text-green-500 font-medium">{{colorComments + ' '}} </span>
      <span class="text-500">{{comments}}</span>
    </template>
  </Card>
</template>

<script>

export default {
  name: 'LoginForm',
  components: {
  },
  props: ['titleCard', 'color', 'contentCard', 'comments','colorComments', 'icon'],
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  margin: 0px
}

</style>
