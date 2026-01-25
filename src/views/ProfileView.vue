<script setup>
import { onMounted, ref, computed } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "@/lib/supabase"
import Button from "primevue/button"

const router = useRouter()

const user = ref(null)
const loading = ref(true)

const displayName = computed(() => {
  const u = user.value
  if (!u) return "Guest"
  return (
    u.user_metadata?.full_name ||
    u.user_metadata?.name ||
    u.email?.split("@")?.[0] ||
    "User"
  )
})

const subtitle = computed(() => {
  const u = user.value
  return u?.email ? u.email : "Sign in to sync your data"
})

async function refreshUser() {
  loading.value = true
  const { data } = await supabase.auth.getUser()
  user.value = data?.user ?? null
  loading.value = false
}

async function goLogin() {
  // If you already have a /login route, this is perfect
  router.push("/login")
}

async function signOut() {
  await supabase.auth.signOut()
  await refreshUser()
}

function goSettings() {
  router.push("/settings")
}

function goAbout() {
  router.push("/about")
}

function exitApp() {
  // “Exit” in a web app usually means go back to home / map
  router.push("/")
}

onMounted(async () => {
  await refreshUser()

  // keep UI in sync if auth changes in another tab or via redirects
  supabase.auth.onAuthStateChange(() => {
    refreshUser()
  })
})
</script>

<template>
  <div class="profile-page">
    <div class="px-5 pt-10 pb-28 max-w-md mx-auto">
      <!-- Header Card -->
      <div
        class="rounded-3xl shadow-sm border border-white/40 bg-white/80 backdrop-blur p-5"
      >
        <div class="flex items-center gap-4">
          <div
            class="h-14 w-14 rounded-2xl bg-black/90 text-white flex items-center justify-center text-lg font-semibold"
            aria-hidden="true"
          >
            {{ displayName.slice(0, 1).toUpperCase() }}
          </div>

          <div class="min-w-0">
            <div class="text-lg font-semibold truncate">
              {{ loading ? "Loading..." : displayName }}
            </div>
            <div class="text-sm text-black/60 truncate">
              {{ subtitle }}
            </div>
          </div>
        </div>

        <div class="mt-4">
          <Button
            v-if="!user && !loading"
            label="Login"
            icon="pi pi-sign-in"
            class="w-full !rounded-2xl !py-3 !bg-black !border-black"
            @click="goLogin"
          />
          <Button
            v-else-if="user && !loading"
            label="Sign out"
            icon="pi pi-sign-out"
            severity="secondary"
            class="w-full !rounded-2xl !py-3"
            @click="signOut"
          />
          <div
            v-else
            class="w-full rounded-2xl py-3 text-center text-sm bg-black/5"
          >
            Checking session…
          </div>
        </div>
      </div>

      <!-- Menu -->
      <div class="mt-5 space-y-3">
        <button class="menu-btn" type="button" @click="goSettings">
          <span class="menu-left">
            <span class="menu-icon pi pi-cog" />
            <span class="menu-title">Settings</span>
          </span>
          <span class="pi pi-angle-right text-black/40" />
        </button>

        <button class="menu-btn" type="button" @click="goAbout">
          <span class="menu-left">
            <span class="menu-icon pi pi-info-circle" />
            <span class="menu-title">About us</span>
          </span>
          <span class="pi pi-angle-right text-black/40" />
        </button>

        <button class="menu-btn danger" type="button" @click="exitApp">
          <span class="menu-left">
            <span class="menu-icon pi pi-times-circle" />
            <span class="menu-title">Exit</span>
          </span>
          <span class="pi pi-angle-right opacity-60" />
        </button>
      </div>

      <!-- Small footer text -->
      <div class="mt-6 text-center text-xs text-black/50">
        v1.0 • Built with Vue + Supabase
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100dvh;
  /* subtle background */
  background:
    radial-gradient(900px 500px at 30% 10%, rgba(0, 0, 0, 0.06), transparent 60%),
    radial-gradient(700px 450px at 80% 30%, rgba(0, 0, 0, 0.04), transparent 60%),
    linear-gradient(to bottom, #fafafa, #f3f4f6);
}

/* menu buttons */
.menu-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 14px 14px;
  border-radius: 18px;

  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
  backdrop-filter: blur(10px);

  transition: transform 0.08s ease, background 0.15s ease;
}

.menu-btn:active {
  transform: scale(0.99);
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.95);
}

.menu-left {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.menu-icon {
  font-size: 18px;
  opacity: 0.85;
}

.menu-title {
  font-weight: 600;
}

.menu-btn.danger {
  background: rgba(255, 235, 235, 0.75);
  border-color: rgba(255, 0, 0, 0.12);
}

.menu-btn.danger .menu-title,
.menu-btn.danger .menu-icon {
  color: #b42318;
}
</style>