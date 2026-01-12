<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/lib/supabase";

const router = useRouter();

const saving = ref(false);
const errorMsg = ref("");

const form = ref({
  name: "",
  city: "",
  lat: "",
  lng: "",
  type: "boulder",     // or "climb"
  label: "",
  length: "",
  firstAscent: "",
  description: "",
  imagePreviewUrl: "",
  imageFile: null,
});

function onImageChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  form.value.imageFile = file;
  form.value.imagePreviewUrl = URL.createObjectURL(file);
}

async function save() {
  errorMsg.value = "";

  if (!form.value.name.trim()) {
    errorMsg.value = "Name is required.";
    return;
  }

  saving.value = true;
  try {
    // 1) Insert location first (without image_url) and return the created row
    const insertPayload = {
      name: form.value.name.trim(),
      city: form.value.city?.trim() || null,
      lat: form.value.lat !== "" ? Number(form.value.lat) : null,
      lng: form.value.lng !== "" ? Number(form.value.lng) : null,
      type: form.value.type || null,
      label: form.value.label?.trim() || null,
      length: form.value.length !== "" ? Number(form.value.length) : null,
      first_ascent: form.value.firstAscent?.trim() || null,
      description: form.value.description?.trim() || null,
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

    // 2) If user selected an image, upload it
    if (form.value.imageFile) {
      const file = form.value.imageFile;

      // create a safe filename
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

      // 3) Get public URL for the uploaded file
      const { data: publicData } = supabase.storage
        .from("location-images")
        .getPublicUrl(filePath);

      const publicUrl = publicData?.publicUrl;
      if (!publicUrl) {
        errorMsg.value = "Upload succeeded, but could not get public URL.";
        return;
      }

      // 4) Update the location row with image_url
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
    <h1>Add Location</h1>

    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

    <div class="form">
      <div class="field">
        <label>Name</label>
        <input v-model="form.name" placeholder="" />
      </div>

      <div class="field">
        <label>City</label>
        <input v-model="form.city" placeholder="" />
      </div>

      <div class="field">
        <label>Latitude</label>
        <input v-model="form.lat" placeholder="" inputmode="decimal" />
      </div>

      <div class="field">
        <label>Longitude</label>
        <input v-model="form.lng" placeholder="" inputmode="decimal" />
      </div>

      <div class="field">
        <label>Type</label>
        <select v-model="form.type">
          <option value="boulder">Boulder</option>
          <option value="climb">Klettern</option>
        </select>
      </div>

      <div class="field">
        <label>Label</label>
        <input v-model="form.label" placeholder="Route label" />
      </div>

      <div class="field">
        <label>Length in meter</label>
        <input v-model="form.length" placeholder="Example: 42" inputmode="numeric" />
      </div>

      <div class="field">
        <label>First Ascent</label>
        <input v-model="form.firstAscent" placeholder="" />
      </div>

      <div class="field">
        <label>Description</label>
        <textarea v-model="form.description" placeholder="" />
      </div>

      <div class="image-box">
        <img v-if="form.imagePreviewUrl" :src="form.imagePreviewUrl" />
        <label class="upload-btn">
          Upload image
          <input type="file" hidden accept="image/*" @change="onImageChange" />
        </label>
      </div>

      <div class="actions">
        <button class="save" :disabled="saving" @click="save">
          {{ saving ? "Saving..." : "Save" }}
        </button>
        <button class="cancel" :disabled="saving" @click="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { padding: 80px 20px 100px; }
h1 { text-align: center; margin-bottom: 24px; }

.error {
  background: #ffe6e6;
  border: 1px solid #ffb3b3;
  color: #7a0000;
  padding: 10px 12px;
  border-radius: 10px;
  margin-bottom: 16px;
  font-size: 14px;
}

.form { display: flex; flex-direction: column; gap: 16px; }

.field label {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
  display: block;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #aaa;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

textarea { min-height: 80px; resize: vertical; }

.image-box {
  border: 1px dashed #bbb;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
}

.image-box img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 10px;
}

.upload-btn {
  display: inline-block;
  padding: 8px 14px;
  background: #f2f2f2;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.save {
  background: #ff8c00;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
}

.cancel {
  background: #e0e0e0;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
}
</style>
