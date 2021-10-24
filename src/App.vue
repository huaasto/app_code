<template>
  <q-layout view="lHh Lpr lFf" style="height: 100%">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu" icon="menu" />

        <q-toolbar-title>title</q-toolbar-title>

        <div style="font-size: 24px">
          <q-btn icon="settings" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-2">
      <NavList />
    </q-drawer>

    <q-page-container style="height: 100%">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import NavList from '@/components/NavList'

export default {
  name: 'LayoutDefault',

  components: {
    NavList
  },

  setup() {
    return {
      leftDrawerOpen: ref(false)
    }
  }
}
</script>
