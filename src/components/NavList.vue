<template>
  <q-list>
    <q-item-label header>Nav</q-item-label>
    <q-item clickable tag="router-link" to="/">
      <q-item-section avatar>
        <q-icon name="home" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Record</q-item-label>
        <q-item-label caption>home</q-item-label>
      </q-item-section>
    </q-item>
    <q-item clickable tag="router-link" to="/pics">
      <q-item-section avatar>
        <q-icon name="school" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Photos</q-item-label>
        <q-item-label caption>collection</q-item-label>
      </q-item-section>
    </q-item>
    <q-item clickable tag="router-link" to="/blogs">
      <q-item-section avatar>
        <q-icon name="code" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Blogs</q-item-label>
      </q-item-section>
    </q-item>
    <q-item clickable tag="router-link" to="/demos">
      <q-item-section avatar>
        <q-icon name="chat" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Demos</q-item-label>
        <q-item-label caption>some interesting demos I have done</q-item-label>
      </q-item-section>
    </q-item>
    <q-item clickable tag="router-link" to="/links">
      <q-item-section avatar>
        <q-icon name="forum" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Links</q-item-label>
        <q-item-label caption>some interesting websites I have met</q-item-label>
      </q-item-section>
    </q-item>
    <q-item clickable tag="router-link" to="/about-me">
      <q-item-section avatar>
        <q-icon name="rss_feed" />
      </q-item-section>
      <q-item-section>
        <q-item-label>about me</q-item-label>
        <q-item-label caption>some thing I can not sort</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<style>
</style>

<script>
export default {
  name: 'HelloWorld'
}
</script>
