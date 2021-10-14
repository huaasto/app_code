<template>
  <div class="home">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <div class="recode-wrap">
      <q-input v-model="text" filled type="textarea" />
      <ul class="record-list">
        <li v-for="recode in recodeList" :key="recode.id" class="recode-item"></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    // HelloWorld
  },
  setup () {
    const text = ref('')
    const recodeList = reactive([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 }
    ])
    return {
      text,
      recodeList
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  height: 100%;
  // position: fixed;
  // top: 0;
  // bottom: 0;
  // left: 0;
  // right: 0;
  // padding: 70px 20px 20px 320px;
}
.recode-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.record-list {
  flex: 1;
  overflow: auto;
}
.recode-item {
  height: 100px;
  margin: 10px;
  border-radius: 10px;
  background-color: #f5f5f5;
}
</style>
