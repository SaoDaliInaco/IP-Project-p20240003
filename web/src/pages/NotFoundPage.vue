<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="state">
    <h1>404 · Page not found</h1>
    <p class="muted">This page wilted away. Let's get you back to the flowers.</p>
    <RouterLink :to="{ name: 'products' }" class="btn btn-primary">Browse bouquets</RouterLink>
  </section>
</template>
