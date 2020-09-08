<template>
  <div>
    <nav-bar />
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
      bundleId: null
    };
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
  mounted() {
    if (this.$route.params.bundleId) {
      this.bundleId = this.$route.params.bundleId;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 10px 40px;
  max-width: 500px;
  margin: auto;
  text-align: left;
}
</style>
