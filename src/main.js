import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import moment from "moment";

import PrimaryButton from "@/components/PrimaryButton.vue";
import NavBar from "@/components/NavBar.vue";
import Modal from "@/components/Modal.vue";

Vue.config.productionTip = false;

Vue.component("primary-button", PrimaryButton);
Vue.component("nav-bar", NavBar);
Vue.component("modal", Modal);

Vue.filter("date", value => {
  if (!value) return "";
  return moment(value).fromNow();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
