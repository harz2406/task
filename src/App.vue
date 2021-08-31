<template>
  <div id="app">
    <nav class="navbar sticky navbar-expand navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">Accounts</router-link>
    </nav>

    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>

<style >
.sticky {
  position: fixed;
  width: 100%;
  top: 0;
}
</style>