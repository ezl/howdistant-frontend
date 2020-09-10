<template>
  <div class="landing">
    <div class="nav"></div>
    <div class="container">
      <div class="header">
        <div class="logo">
          <img src="@/assets/images/logo.png" />
        </div>
        <div class="header-label">
          <h2 style="margin-bottom: 2px;">
            How
          </h2>
          <h2>
            Distant?
          </h2>
        </div>
      </div>
      <div class="subheader">
        <h4>
          You miss them, they miss you.
        </h4>
      </div>
      <div class="title">
        Avoid the awkward reunion.
      </div>
      <div class="content">
        <p>
          We know that navigating safe socializing in a Covid world is tricky,
          we’re here to help make make that conversation easier in just 5
          minutes.
        </p>
        <p>
          Before you and your group meet in person, collectively answer a few
          short questions so everyone knows how to meet without feeling
          uncomfortable.
        </p>
      </div>

      <div class="actions">
        <primary-button @click="startSurvey" label="Take the quiz" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "landing",
  methods: {
    startSurvey() {
      this.$router.push({
        name: "name",
        params: { bundleId: this.$route.params.id }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.landing {
  background: url("../assets/images/landing_background.png") no-repeat;
  height: 100vh;
  padding: 10px 35px;
  max-width: 500px;
  margin: auto;
}
.container {
  text-align: left;

  .header {
    display: flex;
    flex-direction: row;
    .logo {
    }
    .header-label {
      h2 {
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 24px;
        color: #2671d9;
        margin: 0px;
        margin-left: 10px;
      }
    }
  }
  .subheader {
    margin: 10px 0px;
    h4 {
      font-style: normal;
      font-weight: normal;
      font-size: 20px;
      line-height: 25px;

      color: #1f252e;
      margin: 0px;
    }
  }
  .title {
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
    line-height: 40px;

    color: #1f252e;
  }
  .content {
    p {
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 20px;

      color: #000000;
      padding: 5px;
    }
  }
  .actions {
    margin-top: 50px;
  }
}
.nav {
  height: 50px;
}
</style>
