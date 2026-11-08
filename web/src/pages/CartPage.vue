<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useOrdersStore } from '../stores/orders'
import { useProductsStore } from '../stores/products'
import { useSessionStore } from '../stores/session'
import { validateCheckout } from '../validation'
import type { DeliveryMethod } from '../types'

const cart = useCartStore()
const orders = useOrdersStore()
const products = useProductsStore()
const session = useSessionStore()
const router = useRouter()

const form = reactive({
  deliveryMethod: 'PICKUP' as DeliveryMethod,
  scheduledTime: '',
  address: '',
})
const submitted = ref(false)
const pending = ref(false)
const serverError = ref<string | null>(null)

const errors = computed(() => validateCheckout(form))
const nameOf = (id: number) => products.byId(id)?.name ?? `Product #${id}`

onMounted(() => {
  if (products.status !== 'success') void products.fetchAll()
})

async function placeOrder() {
  submitted.value = true
  serverError.value = null
  if (Object.keys(errors.value).length > 0 || !session.user) return
  pending.value = true
  try {
    await orders.place(
      {
        userId: session.user.id,
        deliveryMethod: form.deliveryMethod,
        scheduledTime: form.scheduledTime,
        totalPrice: cart.total,
      },
      cart.lines,
    )
    cart.clear()
    await router.push({ name: 'my-orders' })
  } catch (e) {
    serverError.value = e instanceof Error ? e.message : 'Something went wrong.'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <h1>Your cart</h1>
  <section v-if="cart.lines.length === 0" class="state">
    <p>Your cart is empty.</p>
    <RouterLink :to="{ name: 'products' }" class="btn btn-primary">Browse bouquets</RouterLink>
  </section>
  <div v-else class="cart-layout">
    <ul class="list">
      <li v-for="(line, i) in cart.lines" :key="i" class="card row">
        <div>
          <strong>{{ nameOf(line.productId) }}</strong> × {{ line.quantity }}
          <p v-if="line.wrappingColor !== '-'" class="muted small">
            {{ line.wrappingColor }} wrap · {{ line.ribbonColor }} ribbon · card:
            {{ line.cardType.toLowerCase() }}
          </p>
          <p v-if="line.customNote" class="muted small">“{{ line.customNote }}”</p>
        </div>
        <div class="row-end">
          <span class="price">${{ (line.unitPrice * line.quantity).toFixed(2) }}</span>
          <button class="btn btn-ghost" type="button" @click="cart.remove(i)">Remove</button>
        </div>
      </li>
    </ul>

    <form class="form card" novalidate @submit.prevent="placeOrder">
      <h2>Checkout</h2>
      <fieldset>
        <legend>How would you like it?</legend>
        <label class="inline"
          ><input v-model="form.deliveryMethod" type="radio" value="PICKUP" /> Pickup</label
        >
        <label class="inline"
          ><input v-model="form.deliveryMethod" type="radio" value="DELIVERY" /> Delivery</label
        >
      </fieldset>
      <label
        >{{ form.deliveryMethod === 'PICKUP' ? 'Pickup' : 'Delivery' }} time
        <input v-model="form.scheduledTime" type="datetime-local" />
        <p v-if="submitted && errors.scheduledTime" class="error">{{ errors.scheduledTime }}</p>
      </label>
      <label v-if="form.deliveryMethod === 'DELIVERY'"
        >Delivery address
        <input v-model="form.address" type="text" />
        <p v-if="submitted && errors.address" class="error">{{ errors.address }}</p>
      </label>
      <p class="total">
        Total <strong>${{ cart.total.toFixed(2) }}</strong>
      </p>
      <p v-if="serverError" class="error" role="alert">{{ serverError }}</p>
      <button class="btn btn-primary" type="submit" :disabled="pending">
        {{ pending ? 'Placing order…' : 'Place order' }}
      </button>
    </form>
  </div>
</template>
