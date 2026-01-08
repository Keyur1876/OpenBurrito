<template>
  <div>
    <div class="card-header" :class="{ 'card-header-buy': hideSettings }">
      <slot name="left"></slot>

      <h3 class="card-name" :class="{ erledigt: product.erledigt }">
        {{ product.produkt_name || 'Unbekanntes Produkt' }}
      </h3>

      <button
        v-if="!hideSettings"
        @click="onSettings(product)"
        class="button button-product-settings"
      >
        <font-awesome-icon icon="pen" />
      </button>
    </div>
  </div>
</template>

<script setup></script>

<style scoped></style>

<template>
  <div class="card" :class="{ erledigt: product.erledigt }">
    <div class="card-header" :class="{ 'card-header-buy': hideSettings }">
      <slot name="left"></slot>

      <h3 class="card-name" :class="{ erledigt: product.erledigt }">
        {{ product.produkt_name || 'Unbekanntes Produkt' }}
      </h3>

      <button
        v-if="!hideSettings"
        @click="onSettings(product)"
        class="button button-product-settings"
      >
        <font-awesome-icon icon="pen" />
      </button>
    </div>

    <div class="card-info" v-if="product.produkt_menge || product.einheit_abk">
      <span>
        <strong>Menge:</strong> {{ product.produkt_menge || product.menge }}
        {{ product.einheit_abk }}
      </span>
    </div>
    <div class="card-info" v-else>
      <span style="visibility: hidden">Platzhalter</span>
    </div>

    <div class="card-beschreibung" v-if="product.beschreibung">
      <div class="beschreibung">{{ product.beschreibung }}</div>
    </div>
    <div class="card-beschreibung" v-else>
      <div style="visibility: hidden">Platzhalter</div>
    </div>

    <!-- Slot für extra Infos -->
    <slot name="extra"></slot>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: { type: Object, required: true },
    onSettings: { type: Function, required: false },
    hideSettings: { type: Boolean, default: false }, // true, wenn es ein Archivprodukt ist
  },
}
</script>
