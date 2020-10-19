<template>
  <div>
    <nav-bar v-if="currentRouteName !== 'complete'" />
    <div class="container">
      <router-view :key="$route.hash" />
    </div>
  </div>
</template>
<script>
import axios from "axios";

//const baseUri = "http://localhost:8000";
export default {
  data() {
    return {
      name: "",
      answers: [],
      questions: [],
      bundle: null,
      bundleId: null,
      invited: false
    };
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      //Getting questions
      const response = await axios.get(
        //`${baseUri}/api/v1/survey_forms/default`
        `${process.env.VUE_APP_BACKEND_URI}/api/v1/survey_forms/default/`
      );
      vm.questions = response.data.form;
    });
  },
  async mounted() {
    if (this.$route.query.id) {
      this.bundleId = this.$route.query.id;
      this.invited = true;

      const response = await axios.get(
        `${process.env.VUE_APP_BACKEND_URI}/api/v1/survey_bundles/${this.bundleId}`
      );
      this.bundle = response.data;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 10px 15px;
  max-width: 500px;
  margin: auto;
  text-align: left;
}

/* iPhone 5/SE */
@media screen and (max-width: 320px) {
  .container {
    padding: 10px 5px;
  }
}
</style>
