<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductsStore } from '../stores/products'
import AsyncState from '../components/AsyncState.vue'
import ProductCard from '../components/ProductCard.vue'

const store = useProductsStore()
const featured = computed(() => store.items.filter((p) => p.category === 'BOUQUET').slice(0, 4))

onMounted(() => {
  if (store.status !== 'success') void store.fetchAll()
})
</script>

<template>
  <section class="hero">
    <div>
      <p class="eyebrow">Handmade in Cambodia</p>
      <h1 class="display">Fresh blooms, <em>wrapped by hand</em></h1>
      <p class="muted">
        Customise your bouquet, add a handwritten card and pick a pickup or delivery time. No more
        queues.
      </p>
      <RouterLink :to="{ name: 'products' }" class="btn btn-primary">Shop now</RouterLink>
    </div>
    <div class="hero-art" aria-hidden="true">💐</div>
  </section>

  <section>
    <div class="section-head">
      <h2>Best sellers</h2>
      <RouterLink :to="{ name: 'products' }">Shop all</RouterLink>
    </div>
    <AsyncState
      :skeleton-rows="1"
      :status="store.status"
      :error="store.error"
      :is-empty="featured.length === 0"
      empty-text="No bouquets are available right now."
      @retry="store.fetchAll()"
    >
      <div class="grid">
        <ProductCard v-for="p in featured" :key="p.id" :product="p" />
      </div>
    </AsyncState>
  </section>
</template>
