<template>
  <button :class="{ disabled: disabled }" @click="$emit('click')">
    {{ label }}
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
</style>
