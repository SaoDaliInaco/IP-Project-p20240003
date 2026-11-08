<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '../stores/session'
import { validateAuth } from '../validation'

const session = useSessionStore()
const route = useRoute()
const router = useRouter()

const mode = ref<'login' | 'register'>('login')
const form = reactive({ fullName: '', email: '', password: '' })
const submitted = ref(false)
const pending = ref(false)
const serverError = ref<string | null>(null)

const errors = computed(() => validateAuth(form, mode.value))

async function onSubmit() {
  submitted.value = true
  serverError.value = null
  if (Object.keys(errors.value).length > 0) return
  pending.value = true
  try {
    if (mode.value === 'login') await session.login(form.email, form.password)
    else await session.register(form.fullName, form.email, form.password)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.push(redirect)
  } catch (e) {
    serverError.value = e instanceof Error ? e.message : 'Something went wrong.'
  } finally {
    pending.value = false
  }
}

function switchMode(next: 'login' | 'register') {
  mode.value = next
  submitted.value = false
  serverError.value = null
}
</script>

<template>
  <section class="auth">
    <h1>{{ mode === 'login' ? 'Welcome back' : 'Create your account' }}</h1>
    <form class="form" novalidate @submit.prevent="onSubmit">
      <label v-if="mode === 'register'"
        >Full name
        <input v-model="form.fullName" type="text" autocomplete="name" />
        <p v-if="submitted && errors.fullName" class="error">{{ errors.fullName }}</p>
      </label>
      <label
        >Email
        <input v-model="form.email" type="email" autocomplete="email" />
        <p v-if="submitted && errors.email" class="error">{{ errors.email }}</p>
      </label>
      <label
        >Password
        <input v-model="form.password" type="password" autocomplete="current-password" />
        <p v-if="submitted && errors.password" class="error">{{ errors.password }}</p>
      </label>
      <p v-if="serverError" class="error" role="alert">{{ serverError }}</p>
      <button class="btn btn-primary" type="submit" :disabled="pending">
        {{ pending ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Register' }}
      </button>
    </form>
    <p class="muted">
      <template v-if="mode === 'login'">
        New here?
        <button class="link" type="button" @click="switchMode('register')">
          Create an account
        </button>
      </template>
      <template v-else>
        Have an account?
        <button class="link" type="button" @click="switchMode('login')">Sign in</button>
      </template>
    </p>
    <p class="hint">
      Demo accounts (mock API): customer@flower.test / customer123, admin@flower.test / admin123
    </p>
  </section>
</template>
