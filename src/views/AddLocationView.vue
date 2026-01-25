<script setup>
// View for creating a new climbing location.
// Handles form state, validation, image upload,
// and saving the location to Supabase.
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/lib/supabase";
import BaseCard from "@/components/BaseCard.vue";

const router = useRouter();

const saving = ref(false);
const errorMsg = ref("");

const form = ref({
  name: "",
  city: "",
  lat: "",
  lng: "",
  type: "boulder", // or "climb"
  label: "",
  length: "",
  firstAscent: "",
  description: "",
  imagePreviewUrl: "",
  imageFile: null,
});

/**
 * Single compact coordinates input.
 * User types: "52.5200, 13.4050"
 * We parse and store into form.lat + form.lng.
 */
const coordinates = computed({
  get() {
    const lat = form.value.lat;
    const lng = form.value.lng;
    if (lat !== "" && lng !== "") return `${lat}, ${lng}`;
    return "";
  },
  set(value) {
    const parts = String(value)
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length !== 2) return;

    const lat = Number(parts[0]);
    const lng = Number(parts[1]);

    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      form.value.lat = lat;
      form.value.lng = lng;
    }
  },
});

function onImageChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  form.value.imageFile = file;
  form.value.imagePreviewUrl = URL.createObjectURL(file);
}

/**
 * Validate required fields (everything except description + first ascent).
 * Returns true if valid; otherwise sets errorMsg and returns false.
 */
function validateForm() {
  const name = form.value.name.trim();
  const city = form.value.city.trim();
  const type = (form.value.type || "").trim();
  const label = form.value.label.trim();

  // length should be a positive number
  const lengthRaw = String(form.value.length).trim();
  const lengthNum = Number(lengthRaw);

  // lat/lng should be numbers and in valid ranges
  const latNum = Number(form.value.lat);
  const lngNum = Number(form.value.lng);

  if (!name) {
    errorMsg.value = "Please enter a name.";
    return false;
  }

  if (!city) {
    errorMsg.value = "Please enter a city.";
    return false;
  }

  // coordinates: user must provide both and they must parse correctly
  if (form.value.lat === "" || form.value.lng === "") {
    errorMsg.value = "Please enter coordinates (lat, lng).";
    return false;
  }
  if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
    errorMsg.value = "Coordinates must be valid numbers (lat, lng).";
    return false;
  }
  if (latNum < -90 || latNum > 90) {
    errorMsg.value = "Latitude must be between -90 and 90.";
    return false;
  }
  if (lngNum < -180 || lngNum > 180) {
    errorMsg.value = "Longitude must be between -180 and 180.";
    return false;
  }

  if (!type) {
    errorMsg.value = "Please select a type (Boulder / Klettern).";
    return false;
  }

  if (!label) {
    errorMsg.value = "Please enter a label.";
    return false;
  }

  if (!lengthRaw) {
    errorMsg.value = "Please enter the length in meters.";
    return false;
  }
  if (Number.isNaN(lengthNum) || lengthNum <= 0) {
    errorMsg.value = "Length must be a positive number.";
    return false;
  }

  return true;
}

async function save() {
  errorMsg.value = "";

  // REAL validation (blocks saving)
  if (!validateForm()) return;

  saving.value = true;
  try {
    const insertPayload = {
      name: form.value.name.trim(),
      city: form.value.city.trim(),
      lat: Number(form.value.lat),
      lng: Number(form.value.lng),
      type: form.value.type,
      label: form.value.label.trim(),
      length: Number(form.value.length),
      first_ascent: form.value.firstAscent?.trim() || null, // optional
      description: form.value.description?.trim() || null, // optional
      image_url: null,
    };

    const { data: createdRows, error: insertError } = await supabase
      .from("locations")
      .insert(insertPayload)
      .select("id")
      .limit(1);

    if (insertError) {
      errorMsg.value = insertError.message;
      return;
    }

    const createdId = createdRows?.[0]?.id;
    if (!createdId) {
      errorMsg.value = "Could not get created location id.";
      return;
    }

    // If user selected an image, upload it
    if (form.value.imageFile) {
      const file = form.value.imageFile;

      const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
      const filePath = `locations/${createdId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("location-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "image/*",
        });

      if (uploadError) {
        errorMsg.value = uploadError.message;
        return;
      }

      const { data: publicData } = supabase.storage
        .from("location-images")
        .getPublicUrl(filePath);

      const publicUrl = publicData?.publicUrl;
      if (!publicUrl) {
        errorMsg.value = "Upload succeeded, but could not get public URL.";
        return;
      }

      const { error: updateError } = await supabase
        .from("locations")
        .update({ image_url: publicUrl })
        .eq("id", createdId);

      if (updateError) {
        errorMsg.value = updateError.message;
        return;
      }
    }

    router.push({ name: "home" });
  } finally {
    saving.value = false;
  }
}

function cancel() {
  router.back();
}
</script>

<template>
  <div class="page">
    <div class="wrap">
      <header class="header">
        <button class="back" type="button" @click="cancel" aria-label="Go back">
          <span class="pi pi-angle-left" />
        </button>

        <div>
          <h1>Add Location</h1>
          <p class="sub">Create a new boulder or climbing spot.</p>
        </div>
      </header>

      <div v-if="errorMsg" class="error" role="alert">
        {{ errorMsg }}
      </div>

      <div class="card">
        <p class="hint">Fields marked with <span class="req">*</span> are required.</p>

        <div class="grid">
          <div class="field">
            <label>Name <span class="req">*</span></label>
            <input v-model="form.name" placeholder="e.g. Waldkante" />
          </div>

          <div class="field">
            <label>City <span class="req">*</span></label>
            <input v-model="form.city" placeholder="e.g. Berlin" />
          </div>

          <div class="field span-2">
            <label>Coordinates (lat, lng) <span class="req">*</span></label>
            <input
              v-model="coordinates"
              placeholder="e.g. 52.5200, 13.4050"
              inputmode="decimal"
            />
            <small class="hint">Enter latitude and longitude separated by a comma.</small>
          </div>

          <div class="field">
            <label>Type <span class="req">*</span></label>
            <select v-model="form.type">
              <option value="boulder">Boulder</option>
              <option value="climb">Klettern</option>
            </select>
          </div>

          <div class="field">
            <label>Label <span class="req">*</span></label>
            <input v-model="form.label" placeholder="Route label" />
          </div>

          <div class="field">
            <label>Length (m) <span class="req">*</span></label>
            <input v-model="form.length" placeholder="Example: 42" inputmode="numeric" />
          </div>

          <div class="field">
            <label>First Ascent</label>
            <input v-model="form.firstAscent" placeholder="Name / year (optional)" />
          </div>

          <div class="field span-2">
            <label>Description</label>
            <textarea v-model="form.description" placeholder="Short description (optional)" />
          </div>
        </div>

        <div class="image-box">
          <div class="image-preview">
            <img v-if="form.imagePreviewUrl" :src="form.imagePreviewUrl" alt="Preview" />
            <div v-else class="placeholder">
              <div class="ph-title">No image selected</div>
              <div class="ph-sub">Upload a photo to help others recognize the spot.</div>
            </div>
          </div>

          <label class="upload-btn">
            <span class="pi pi-upload" />
            <span>{{ form.imagePreviewUrl ? "Change image" : "Upload image" }}</span>
            <input type="file" hidden accept="image/*" @change="onImageChange" />
          </label>
        </div>

        <div class="actions">
          <button class="cancel" :disabled="saving" @click="cancel">Cancel</button>
          <button class="save" :disabled="saving" @click="save">
            <span v-if="saving" class="spinner" aria-hidden="true"></span>
            {{ saving ? "Saving..." : "Save location" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100dvh;
  padding: 18px 16px 110px;
  background: linear-gradient(to bottom, #fafafa, #f3f4f6);
}

.wrap {
  max-width: 620px;
  margin: 0 auto;
}

.header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 14px;
}

.back {
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: white;
  border-radius: 14px;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  cursor: pointer;
}

h1 {
  font-size: 18px;
  margin: 0;
  font-weight: 800;
}

.sub {
  margin: 4px 0 0;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
}

.error {
  background: rgba(255, 230, 230, 0.9);
  border: 1px solid rgba(255, 100, 100, 0.35);
  color: #7a0000;
  padding: 10px 12px;
  border-radius: 14px;
  margin-bottom: 12px;
  font-size: 13px;
}

.card {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 520px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.span-2 {
  grid-column: span 2;
}
@media (max-width: 520px) {
  .span-2 {
    grid-column: span 1;
  }
}

.field label {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 6px;
  display: block;
  color: rgba(0, 0, 0, 0.78);
}

.req {
  color: #d11;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  border-radius: 12px;
  font-size: 14px;
  background: white;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.field textarea {
  min-height: 96px;
  resize: vertical;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  border-color: rgba(0, 0, 0, 0.32);
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.06);
}

.hint {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.55);
  margin: 0 0 10px;
  display: block;
  line-height: 1.35;
}

.image-box {
  margin-top: 14px;
  border: 1px dashed rgba(0, 0, 0, 0.18);
  border-radius: 16px;
  padding: 12px;
}

.image-preview {
  border-radius: 14px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.03);
}

.image-preview img {
  width: 100%;
  display: block;
}

.placeholder {
  padding: 18px 12px;
  text-align: center;
}

.ph-title {
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 6px;
}

.ph-sub {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}

.upload-btn {
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.10);
  border-radius: 14px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 16px;
}

.actions button {
  border: none;
  border-radius: 14px;
  padding: 10px 14px;
  font-size: 14px;
  cursor: pointer;
}

.cancel {
  background: rgba(0, 0, 0, 0.06);
}

.save {
  background: #ff8c00;
  color: white;
  font-weight: 700;
}

.actions button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-top-color: rgba(255, 255, 255, 0.15);
  display: inline-block;
  margin-right: 8px;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
