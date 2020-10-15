<template>
  <button :class="{ disabled: disabled }" @click="$emit('click')">
    <div style="display: flex;align-items: center;justify-content: center;">
      <span>{{ label }}</span>
      <img v-if="loading" src="@/assets/images/loading.svg" />
      <img class="success" v-if="success" src="@/assets/images/success.svg" />
    </div>
  </button>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    success: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss" scoped>
button {
  cursor: pointer;
  margin: 0 auto;
  display: block;
  width: 100%;
  max-width: 280px;
  height: 50px;

  background: #2671d9;
  border-radius: 10px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  border: none;
  /* identical to box height */

  text-align: center;
  color: #ffffff;
}
.disabled {
  background: rgba(38, 113, 217, 0.6);
  pointer-events: none;
}
img {
  height: 20px;
  margin-left: 8px;
}
.success {
  height: 20px;
  color: white;
}
</style>
