<script setup>
import Button from "primevue/button"
import { useRouter } from "vue-router"

const router = useRouter()
</script>

<template>
  <div class="about-page">
    <div class="wrap">
      <header class="header">
        <button class="back" type="button" @click="router.back()">
          <span class="pi pi-angle-left" />
        </button>
        <h1>About OpenBurrito</h1>
      </header>

      <section class="card">
        <h2>What this app is</h2>
        <p>
          OpenBurrito is an alternative frontend for the Boulder App.
          It focuses on a cleaner layout, simpler navigation,
          and a more welcoming user experience — especially on mobile.
        </p>
      </section>

      <section class="card">
        <h2>Why OpenBurrito</h2>
        <p>
          While the original Boulder App is powerful,
          OpenBurrito was created to make everyday use feel lighter and easier.
          The goal is to improve readability, reduce visual noise,
          and make discovering boulders more enjoyable.
        </p>
      </section>

      <section class="card">
        <h2>Technology</h2>
        <p>
          OpenBurrito is built with modern web technologies such as
          Vue, Leaflet, and Supabase.
          It stays compatible with the existing Boulder ecosystem
          while offering a refreshed interface.
        </p>
      </section>

      <section class="card">
        <h2>About the project</h2>
        <p>
          This project was created as a personal and community-driven effort.
          OpenBurrito is open-source and built with care for users
          who value clarity, usability, and thoughtful design.
        </p>
      </section>

      <section class="card">
        <h2>Contact</h2>
        <p>
          Have feedback or ideas?
          You can reach out via email at
          <strong>support@example.com</strong>.
        </p>
      </section>

      <Button
        label="Back to profile"
        icon="pi pi-user"
        class="w-full !rounded-2xl !py-3"
        @click="router.push('/profile')"
      />
    </div>
  </div>
</template>

<style scoped>
.about-page {
  min-height: 100dvh;
  background: linear-gradient(to bottom, #fafafa, #f3f4f6);
  padding: 18px;
}

.wrap {
  max-width: 560px;
  margin: 0 auto;
  padding-top: 10px;
  padding-bottom: 90px; /* space for BottomBar */
}

.header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.header h1 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.back {
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: white;
  border-radius: 14px;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 18px;
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
}

.card h2 {
  font-size: 14px;
  margin: 0 0 6px;
  font-weight: 700;
}

.card p {
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: rgba(0, 0, 0, 0.72);
}
</style>
