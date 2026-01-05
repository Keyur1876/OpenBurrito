<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref({
  label: "",
  length: "",
  firstAscent: "",
  description: "",
  boulderName: "",
  image: null,
});

function onImageChange(e) {
  const file = e.target.files[0];
  if (file) {
    form.value.image = URL.createObjectURL(file);
  }
}

function save() {
  console.log("New location:", form.value);
  // TODO: send to backend / store
  router.push({ name: "home" });
}

function cancel() {
  router.back();
}
</script>

<template>
  <div class="page">
    <h1>Add Location</h1>

    <!-- FORM -->
    <div class="form">

      <div class="field">
        <label>Label</label>
        <input v-model="form.label" placeholder="Current value" />
      </div>

      <div class="field">
        <label>Length</label>
        <input v-model="form.length" placeholder="Example: 42" />
      </div>

      <div class="field">
        <label>First Ascent</label>
        <input v-model="form.firstAscent" placeholder="Unknown" />
      </div>

      <div class="field">
        <label>Boulder Name</label>
        <input v-model="form.boulderName" placeholder="Name" />
      </div>

      <div class="field">
        <label>Description</label>
        <textarea v-model="form.description" placeholder="Description" />
      </div>

      <!-- IMAGE UPLOAD -->
      <div class="image-box">
        <img v-if="form.image" :src="form.image" />
        <label class="upload-btn">
          Upload image
          <input type="file" hidden @change="onImageChange" />
        </label>
      </div>

      <!-- ACTIONS -->
      <div class="actions">
        <button class="save" @click="save">Save</button>
        <button class="cancel" @click="cancel">Cancel</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 80px 20px 100px; /* top + bottom bars */
}

h1 {
  text-align: center;
  margin-bottom: 24px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field label {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
  display: block;
}

.field input,
.field textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #aaa;
  border-radius: 8px;
  font-size: 14px;
}

textarea {
  min-height: 80px;
  resize: vertical;
}

/* IMAGE */
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

/* ACTIONS */
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
