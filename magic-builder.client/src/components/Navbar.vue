<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light px-3 elevation-2">
    <router-link :to="{ name: 'Home' }">
      <h2>🧙‍♂️✨</h2>
      <ul class="navbar-nav me-auto">
      </ul>
    </router-link>
    <div class="collapse navbar-collapse justify-content-end" id="navbarText">
      <!-- LOGIN COMPONENT HERE -->
      <Login />
    </div>
  </nav>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style scoped>
a:hover {
  text-decoration: none;
}

.nav-link {
  text-transform: uppercase;
}

.navbar-nav .router-link-exact-active {
  border-bottom: 2px solid var(--bs-success);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
