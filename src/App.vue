<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
const ROOT_PATH = "https://nervous-hamilton-b8033b.netlify.app";
export default {
  property: "App",
  data() {
    return {
      ogImage: ROOT_PATH + require("./assets/images/howdistant_og.jpg"),
      twitterImage:
        ROOT_PATH + require("./assets/images/howdistant_twitter.jpg")
    };
  },
  metaInfo() {
    return {
      title: "How Distant",
      meta: [
        // Facebook OpenGraph
        {
          property: "og:site_name",
          content: "How Distant"
        },
        {
          property: "og:type",
          content: "website"
        },
        {
          property: "og:title",
          content:
            "How Distant allows you to avoid awkward reunions with 8 questions"
        },
        {
          property: "og:description",
          content:
            "Compare socializing preferences with friends and family to ensure a comfortable time for everyone. Make get togethers safe and easy in just a few short minutes."
        },
        {
          property: "og:url",
          content: "https://www.howdistant.com"
        },
        {
          property: "og:image",
          content: this.ogImage
        },
        {
          property: "og:image:type",
          content: "image/jpeg"
        },
        {
          property: "og:image:width",
          content: "1200"
        },
        {
          property: "og:image:height",
          content: "630"
        },
        {
          property: "og:image:alt",
          content:
            "How Distant allows you to avoid awkward reunions with 8 questions"
        },
        // Twitter Card
        { property: "twitter:card", content: "summary_large_image" },
        {
          property: "twitter:title",
          content:
            "Let Jack, Sue, and LeAnn know your social distancing preferences."
        },
        {
          property: "twitter:description",
          content:
            "Answer a few questions and compare answers to remove the awkwardness when you meet in person."
        },
        { property: "twitter:image", content: this.twitterImage }
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
