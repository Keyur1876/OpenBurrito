<template>
  <header class="top-bar">
    <div class="logo-pill">
      Open Burrito
    </div>
  </header>
</template>

<script setup>
/* no logic needed */
</script>

<style scoped>
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;

  background: white;
  border-bottom: 1px solid #ddd;

  z-index: 1000;
}

/* ORANGE OVAL LOGO */
.logo-pill {
  padding: 6px 18px;
  background: #ff8c00;
  color: white;

  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.4px;

  border-radius: 999px; /* oval */
  user-select: none;
}
</style>
