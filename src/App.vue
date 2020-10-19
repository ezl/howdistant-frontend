<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  property: "App",
  data() {
    return {
      ogImage:
        this.$const.rootPath + require("./assets/images/howdistant_og.jpg")
    };
  },
  metaInfo() {
    return {
      title: "How Distant",
      meta: [
        {
          vmid: "og:site_name",
          property: "og:site_name",
          content: "How Distant"
        },
        {
          vmid: "og:type",
          property: "og:type",
          content: "website"
        },
        {
          vmid: "og:title",
          property: "og:title",
          content:
            "How Distant allows you to avoid awkward reunions with 8 questions"
        },
        {
          vmid: "og:description",
          property: "og:description",
          content:
            "Compare socializing preferences with friends and family to ensure a comfortable time for everyone. Make get togethers safe and easy in just a few short minutes."
        },
        {
          vmid: "og:url",
          property: "og:url",
          content: "https://www.howdistant.com"
        },
        {
          vmid: "og:image",
          property: "og:image",
          content: this.ogImage
        },
        {
          vmid: "og:image:type",
          property: "og:image:type",
          content: "image/jpeg"
        },
        {
          vmid: "og:image:width",
          property: "og:image:width",
          content: "1200"
        },
        {
          vmid: "og:image:height",
          property: "og:image:height",
          content: "630"
        },
        {
          vmid: "og:image:alt",
          property: "og:image:alt",
          content:
            "How Distant allows you to avoid awkward reunions with 8 questions"
        }
      ]
    };
  }
};
</script>

<style lang="scss">
#app {
  font-family: Cabin, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
/*
@media (max-width: 768px) {
  body {
    margin: 0px;
  }
}
*/
</style>
