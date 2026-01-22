<script setup>
// Reusable search bar component.
// Emits input and clear events to the parent component.
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "Search..." },
});

const emit = defineEmits(["update:modelValue", "focus", "clear"]);

function onInput(e) {
  emit("update:modelValue", e.target.value);
}

function clear() {
  emit("update:modelValue", "");
  emit("clear");
}
</script>

<template>
  <div class="search-wrap">
    <span class="icon" aria-hidden="true">🔍</span>

    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      @input="onInput"
      @focus="$emit('focus')"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
    />

    <button
      v-if="modelValue"
      class="clear"
      type="button"
      @click="clear"
      aria-label="Clear search"
    >
      ✕
    </button>
  </div>
</template>

<style scoped>
.search-wrap {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.10);
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
}

.icon {
  font-size: 14px;
  opacity: 0.65;
}

.search-wrap input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
}

.search-wrap:focus-within {
  border-color: rgba(0, 0, 0, 0.25);
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.06);
}

.clear {
  border: none;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 999px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.clear:active {
  transform: scale(0.98);
}
</style>
