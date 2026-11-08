<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import {
  CARD_PRICES,
  NOTE_MAX,
  RIBBON_COLORS,
  RIBBON_PRICE,
  WRAPPING_COLORS,
  type CardType,
} from '../types'
import { validateNote } from '../validation'
import AsyncState from '../components/AsyncState.vue'

const props = defineProps<{ id: string }>()

const store = useProductsStore()
const cart = useCartStore()
const router = useRouter()
const { status, error } = storeToRefs(store)

const product = computed(() => store.byId(Number(props.id)))
const isBouquet = computed(() => product.value?.category === 'BOUQUET')

const form = reactive({
  quantity: 1,
  wrappingColor: 'Blush' as string,
  ribbonColor: 'Pink' as string,
  cardType: 'NONE' as CardType,
  customNote: '',
})
const submitted = ref(false)

// The unit price is calculated from the other state, so it is a computed, not a ref.
const unitPrice = computed(() => {
  if (!product.value) return 0
  const ribbon = isBouquet.value && form.ribbonColor !== 'None' ? RIBBON_PRICE : 0
  const card = isBouquet.value ? CARD_PRICES[form.cardType] : 0
  return product.value.price + ribbon + card
})
const noteError = computed(() => validateNote(form.customNote))
const quantityError = computed(() =>
  Number.isInteger(form.quantity) && form.quantity >= 1 && form.quantity <= 20
    ? undefined
    : 'Quantity must be a whole number from 1 to 20.',
)

// watch with immediate: also reloads when the route param changes while the page stays mounted.
watch(
  () => props.id,
  () => {
    if (store.status !== 'success') void store.fetchAll()
  },
  { immediate: true },
)

function addToCart() {
  submitted.value = true
  if (!product.value || noteError.value || quantityError.value) return
  cart.add({
    productId: product.value.id,
    quantity: form.quantity,
    unitPrice: unitPrice.value,
    wrappingColor: isBouquet.value ? form.wrappingColor : '-',
    ribbonColor: isBouquet.value ? form.ribbonColor : '-',
    cardType: isBouquet.value ? form.cardType : 'NONE',
    customNote: isBouquet.value && form.cardType !== 'NONE' ? form.customNote.trim() : '',
  })
  void router.push({ name: 'cart' })
}
</script>

<template>
  <RouterLink :to="{ name: 'products' }" class="back">← Back to shop</RouterLink>
  <AsyncState
    :status="status"
    :error="error"
    :is-empty="!product"
    empty-text="We could not find this product."
    @retry="store.fetchAll()"
  >
    <article v-if="product" class="detail">
      <div class="thumb big" :class="`thumb-${product.category}`" aria-hidden="true">
        {{
          product.category === 'BOUQUET' ? '💐' : product.category === 'SINGLE_STEM' ? '🌹' : '🎀'
        }}
      </div>
      <div>
        <h1>{{ product.name }}</h1>
        <p class="price big-price">${{ unitPrice.toFixed(2) }}</p>
        <p>{{ product.description }}</p>
        <p class="muted"><strong>Materials:</strong> {{ product.materials.join(', ') }}</p>

        <form class="form" novalidate @submit.prevent="addToCart">
          <template v-if="isBouquet">
            <label
              >Wrapping colour
              <select v-model="form.wrappingColor">
                <option v-for="c in WRAPPING_COLORS" :key="c">{{ c }}</option>
              </select>
            </label>
            <label
              >Ribbon (+${{ RIBBON_PRICE.toFixed(2) }})
              <select v-model="form.ribbonColor">
                <option v-for="c in RIBBON_COLORS" :key="c">{{ c }}</option>
              </select>
            </label>
            <label
              >Message card
              <select v-model="form.cardType">
                <option value="NONE">No card</option>
                <option value="STANDARD">Standard (+$1.00)</option>
                <option value="PREMIUM">Premium (+$2.50)</option>
              </select>
            </label>
            <label v-if="form.cardType !== 'NONE'"
              >Handwritten note (optional)
              <textarea v-model="form.customNote" rows="3" :maxlength="NOTE_MAX"></textarea>
              <small :class="{ error: noteError }"
                >{{ form.customNote.length }}/{{ NOTE_MAX }}</small
              >
              <p v-if="submitted && noteError" class="error">{{ noteError }}</p>
            </label>
          </template>
          <label
            >Quantity
            <input v-model.number="form.quantity" type="number" min="1" max="20" />
            <p v-if="submitted && quantityError" class="error">{{ quantityError }}</p>
          </label>
          <button class="btn btn-primary" type="submit">Add to cart</button>
        </form>
      </div>
    </article>
  </AsyncState>
</template>
