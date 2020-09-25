import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import moment from "moment";

import PrimaryButton from "@/components/PrimaryButton.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import NavBar from "@/components/NavBar.vue";
import Modal from "@/components/Modal.vue";
import Cleave from "cleave.js";
import "cleave.js/dist/addons/cleave-phone.us";
import Toasted from "vue-toasted";

Vue.config.productionTip = false;

Vue.use(Toasted);

Vue.component("primary-button", PrimaryButton);
Vue.component("secondary-button", SecondaryButton);
Vue.component("nav-bar", NavBar);
Vue.component("modal", Modal);

Vue.directive("cleave", {
  inserted: (el, binding) => {
    el.cleave = new Cleave(el, binding.value || {});
  },
  update: el => {
    const event = new Event("input", { bubbles: true });
    setTimeout(() => {
      el.value = el.cleave.properties.result;
      el.dispatchEvent(event);
    }, 100);
  }
});

Vue.filter("date", value => {
  if (!value) return "";
  return moment(value).fromNow();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
