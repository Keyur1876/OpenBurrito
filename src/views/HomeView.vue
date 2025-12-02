<script setup>

import { boulderLocations } from '@/data/boulderLocations';
</script>

<template>
  <!-- Page wrapper: centered on desktop, full width on phone -->
  <div class="page">
    <!-- TOP BAR -->
    <header class="top-bar">
      <div class="logo-oval">Open Burrito</div>

      <div class="top-right">
        <button class="login-btn">Login</button>
        <button class="menu-btn" aria-label="Menu">
          ☰
        </button>
      </div>
    </header>

    <!-- SEARCH BAR -->
    <div class="search-wrapper">
      <input
        class="search-input"
        type="text"
        placeholder="Search..."
      />
    </div>

    <!-- CONTENT CARDS -->
    <main class="cards">
      <section
        class="card"
        v-for="place in boulderLocations"
        :key="place.id"
      >
        <img class="card-image" :src="place.image" :alt="place.name" />

        <div class="card-info">
          <h3>{{ place.name }}</h3>
          <p>{{ place.city }}</p>
        </div>
      </section>
    </main>

    <!-- BOTTOM NAV -->
    <footer class="bottom-nav">
      <router-link to="/" class="home-button" aria-label="Home">
        ⌂
      </router-link>

      <router-link to="/map" class="map-button" aria-label="Map">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 3 21 9 18 15 21 21 18 21 3 15 6 9 3 3 6"></polyline>
          <line x1="9" y1="3" x2="9" y2="18"></line>
          <line x1="15" y1="6" x2="15" y2="21"></line>
        </svg>
      </router-link>

    </footer>
  </div>
</template>

<style scoped>

.page {
  width: 100%;
  min-height: 100vh;
  padding: 16px 12px 20px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

/* Top bar */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-oval {
  padding: 6px 14px;             
  background: #ff5a5f;
  border-radius: 20px;        
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 14px;            
  white-space: nowrap;   
}


/* Right side of top bar */
.top-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-btn {
  padding: 4px 10px;
  font-size: 12px;
  background: transparent;
  border: 1px solid #000;
  border-radius: 4px;
  cursor: pointer;
}

.menu-btn {
  padding: 4px 8px;
  font-size: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
}

/* Search */
.search-wrapper {
  margin-top: 16px;
}

.search-input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
}

/* Cards area */
.cards {
  flex: 1;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 16px;
  background: #e5e5e5;
}

/* left side: text */
.card-info {
  flex: 1;
}

/* right side: image */
.card-image {
  width: 30%;        /* Image takes 30% of card */
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  margin-left: 0px;
  margin-right: 10px;
  background: #ccc;
}

/* small text styling */
.card-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.card-info p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #444;
}

/* Bottom navigation */
.bottom-nav {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.home-button {
  border: none;
  background: transparent;
  font-size: 35px;
  cursor: pointer;
}

.map-button {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 6px;
  text-decoration: none;
  color: inherit; 
  display: inline-flex;
  align-items: center;
  justify-content: center;
}


.map-button:hover {
  background: #f0f0f0;
  border-radius: 8px;
}

</style>