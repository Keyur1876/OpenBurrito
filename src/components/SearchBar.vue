<script setup>
// Reusable search bar component.
// Emits input and clear events to the parent component.

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Search...' }
})

const emit = defineEmits(['update:modelValue', 'focus', 'clear'])

function onInput(e) {
  emit('update:modelValue', e.target.value)
}

function clear() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div class="search-bar">
    <span class="search-icon">🔍</span>

    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      @input="onInput"
      @focus="$emit('focus')"
    />

    <button v-if="modelValue" class="clear-btn" @click="clear">✕</button>
  </div>
</template>

<style scoped>
.search-bar {
  width: 100%;
  padding: 8px 12px;
  background: #ddd;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.search-bar input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
}
.clear-btn {
  border: none;
  background: white;
  border-radius: 8px;
  width: 28px;
  height: 28px;
  cursor: pointer;
}
</style>
