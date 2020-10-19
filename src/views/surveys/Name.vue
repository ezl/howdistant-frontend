<template>
  <div class="name-content">
    <div class="name-tag">
      <div class="top">
        <div class="content">
          <h4>HELLO</h4>
          <h5>my name is</h5>
        </div>
      </div>
      <div class="label">
        <input
          type="text"
          v-model="$parent.name"
          @keyup.enter="goToQuestions"
          autofocus
          ref="nameInput"
        />

        <!--<p>{{ $parent.name }}</p> -->
      </div>
      <div class="bottom"></div>
    </div>
    <div class="actions">
      <primary-button
        @click="goToQuestions"
        label="Continue"
        :disabled="!$parent.name"
      />
    </div>

    <modal class="info-modal" v-if="showInfoModal" @close="toggleInfoModal">
      <div slot="header"></div>
      <div slot="body">
        <h4>
          {{ bundleNames }} want{{ surveyCount > 1 ? "" : "s" }}
          to hang
        </h4>

        <p>
          Answer 8 quick questions and we’ll compare your answers to make
          visiting more comfortable for everyone.
        </p>

        <primary-button @click="toggleInfoModal" label="Answer Questions" />
      </div>
    </modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showInfoModal: false,
      ogImage:
        this.$const.rootPath + require("../../assets/images/howdistant_og2.jpg")
    };
  },
  metaInfo() {
    return {
      title: "How Distant",
      meta: [
        {
          vmid: "og:title",
          property: "og:title",
          content:
            "Let Jack, Sue, and LeAnn know your social distancing preferences."
        },
        {
          vmid: "og:url",
          property: "og:url",
          content: "https://www.howdistant.com/survey/invited/"
        },
        {
          vmid: "og:description",
          property: "og:description",
          content:
            "Answer a few questions and compare answers to remove the awkwardness when you meet in person."
        },
        {
          vmid: "og:image",
          property: "og:image",
          content: this.ogImage
        }
      ]
    };
  },

  computed: {
    surveyCount() {
      if (this.$parent.bundle && this.$parent.bundle.surveys) {
        return this.$parent.bundle.surveys.length;
      }
      return 0;
    },
    bundleNames() {
      if (this.$parent.bundle) {
        if (this.$parent.bundle.surveys.length > 5) {
          return `${this.$parent.bundle.surveys
            .map(s => s.name)
            .slice(0, 5)
            .join(", ")} and ${this.$parent.bundle.surveys.length - 5} other${
            this.$parent.bundle.surveys.length - 5 > 1 ? "s" : ""
          }`;
        } else if (this.$parent.bundle.surveys.length > 2) {
          return `${this.$parent.bundle.surveys
            .map(s => s.name)
            .slice(0, this.$parent.bundle.surveys.length - 1)
            .join(", ")} and ${
            this.$parent.bundle.surveys[this.$parent.bundle.surveys.length - 1]
              .name
          }`;
        } else if (this.$parent.bundle.surveys.length > 1) {
          return `${this.$parent.bundle.surveys
            .map(s => s.name)
            .join(" and ")}`;
        } else {
          return this.$parent.bundle.surveys[0].name;
        }
      }
      return "";
    }
  },
  methods: {
    goToQuestions() {
      this.$router.push({ name: "questions", hash: "#1" });
    },
    toggleInfoModal() {
      this.showInfoModal = !this.showInfoModal;
    }
  },
  mounted() {
    this.$refs.nameInput.focus();
    if (this.$route.query.id) {
      this.toggleInfoModal();
    }
  }
};
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Yellowtail");

.name-content {
  .input-content {
    margin-top: 50px;
    margin-bottom: 30px;
    p {
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 20px;

      color: #27272e;
    }
  }
  .name-tag {
    margin: 50px auto;
    text-align: center;
    width: 100%;

    .top {
      margin: 0px auto;
      max-width: 300px;
      height: 80px;
      background: #2671d9;
      border-radius: 10px 10px 0px 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      .content {
        h4 {
          font-style: normal;
          font-weight: bold;
          font-size: 28px;
          line-height: 35px;
          color: #ffffff;
          margin: 0px;
        }
        h5 {
          font-style: normal;
          font-weight: bold;
          font-size: 20px;
          line-height: 25px;
          color: #ffffff;
          margin: 0px;
        }
      }
    }
    .label {
      margin: 0px auto;
      max-width: 300px;
      height: 100px;

      background: #f2f2f2;
      display: flex;
      align-items: center;
      justify-content: center;

      input {
        display: block;
        margin: auto;
        background: #f2f2f2;
        -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
        -moz-box-sizing: border-box; /* Firefox, other Gecko */
        box-sizing: border-box; /* Opera/IE 8+ */
        width: 100%;
        height: 100%;
        font-size: 40px;
        line-height: 55px;
        color: #27272e;
        border: none;
        outline: none;
        text-align: center;
        font-family: "Yellowtail";
      }
    }
    .bottom {
      margin: 0px auto;
      max-width: 300px;
      height: 25px;
      background: #2671d9;
      border-radius: 0px 0px 10px 10px;
    }
  }
  .actions {
    /*
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 30px;
    */
  }
}

.info-modal {
  h4 {
    font-size: 24px;
    line-height: 30px;
    color: #27272e;
    margin: 10px 0px;
  }

  p {
    font-size: 14px;
    line-height: 18px;
    color: #27272e;
    margin-bottom: 30px;
  }
}
</style>
