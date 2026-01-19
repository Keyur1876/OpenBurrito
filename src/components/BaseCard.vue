<template>
  <section class="card">
    <header class="card__header">
      <slot name="header" />
    </header>

    <div class="card__body">
      <slot />
    </div>

    <footer class="card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 12px;
  background: white;
}
.card__header { margin-bottom: 10px; font-weight: 700; }
.card__footer { margin-top: 10px; opacity: 0.8; font-size: 13px; }
</style>
