import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AsyncState from '../components/AsyncState.vue'

const base = { error: null, isEmpty: false }

describe('AsyncState loading page', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows nothing at first, then the loading page when loading is slow', async () => {
    const wrapper = mount(AsyncState, { props: { ...base, status: 'loading' } })
    expect(wrapper.text()).not.toContain('Loading fresh blooms')
    await vi.advanceTimersByTimeAsync(300)
    expect(wrapper.text()).toContain('Loading fresh blooms')
    expect(wrapper.findAll('.sk-card')).toHaveLength(8)
  })

  it('never shows the loading page when data arrives quickly', async () => {
    const wrapper = mount(AsyncState, {
      props: { ...base, status: 'loading' },
      slots: { default: '<p>Data</p>' },
    })
    await vi.advanceTimersByTimeAsync(100)
    await wrapper.setProps({ status: 'success' })
    await vi.advanceTimersByTimeAsync(500)
    expect(wrapper.text()).toContain('Data')
    expect(wrapper.text()).not.toContain('Loading fresh blooms')
  })

  it('shows the error with a retry button', async () => {
    const wrapper = mount(AsyncState, { props: { status: 'error', error: 'Boom', isEmpty: false } })
    expect(wrapper.text()).toContain('Boom')
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })
})
