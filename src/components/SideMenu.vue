<template>
  <div class="sidebar">
    <div class="sidebar-backdrop" @click="$emit('close')" v-if="showMenu"></div>
    <transition name="slide">
      <div v-if="showMenu" class="sidebar-panel">
        <slot name="header"></slot>

        <slot name="menu-items"></slot>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    showMenu: {
      type: Boolean,
      default: false
    }
  },
  methods: {}
};
</script>
<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(-100%);
  transition: all 150ms ease-in 0s;
}

.sidebar-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  cursor: pointer;
}

.sidebar-panel {
  overflow-y: auto;
  background-color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 999;
  padding: 20px 10px;
  width: 80vw;
}
</style>
