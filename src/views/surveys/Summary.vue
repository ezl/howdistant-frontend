<template>
  <div>
    <div class="tab-nav">
      <div
        class="tab"
        :class="{ active: currentTab === 'interaction' }"
        @click="currentTab = 'interaction'"
      >
        <span>Interaction</span>
      </div>
      <div
        class="tab"
        :class="{ active: currentTab === 'exposure' }"
        @click="currentTab = 'exposure'"
      >
        <span>Exposure</span>
      </div>
    </div>

    <Interaction
      v-if="currentTab === 'interaction'"
      :questions="interactionQuestions"
      :surveyCount="surveyCount"
    />

    <Exposure
      v-if="currentTab === 'exposure'"
      :questions="exposureQuestions"
      :surveyCount="surveyCount"
    />

    <!-- START Info Modal -->
    <modal class="info-modal" v-if="showInfoModal" @close="toggleInfoModal">
      <div slot="body">
        <h4>
          The hard work is done,
          <br />
          get ready to socialize.
        </h4>

        <p>
          Sometimes things aren’t clear cut, and your group will have split
          opinions. Use the key below when looking at your group’s answers.
        </p>
        <div class="labels">
          <div class="label unanimous">
            <div class="icon"><img src="@/assets/images/check.svg" /></div>
            <div class="text"><p>Everyone is comfortable with it</p></div>
          </div>
          <div class="label some">
            <div class="icon">
              <img src="@/assets/images/exclamation.svg" />
            </div>
            <div class="text">
              <p>Some are comfortable with it</p>
              <p class="sub">(tap to see the breakdown)</p>
            </div>
          </div>

          <div class="label none">
            <div class="icon"><img src="@/assets/images/none.svg" /></div>
            <div class="text"><p>No one was comfortable with it</p></div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <primary-button @click="toggleInfoModal" label="Okay" />
      </div>
    </modal>
  </div>
</template>
<script>
import axios from "axios";
import Interaction from "@/views/surveys/Interaction.vue";
import Exposure from "@/views/surveys/Exposure.vue";

export default {
  components: {
    Interaction,
    Exposure
  },
  data() {
    return {
      surveyForm: null,
      currentTab: "interaction",
      showInfoModal: false
    };
  },
  async beforeRouteEnter(to, from, next) {
    await next(async vm => {
      if (!vm.$parent.bundle || !vm.$parent.bundle.summary) {
        const response = await axios.get(
          `${process.env.VUE_APP_BACKEND_URI}/api/v1/survey_bundles/${vm.$route.params.id}`
        );
        vm.$parent.bundle = response.data;
        vm.surveyForm = vm.$parent.bundle.summary;
      } else {
        vm.surveyForm = vm.$parent.bundle.summary;
      }
    });
  },
  computed: {
    filteredQuestions() {
      if (!this.surveyForm) {
        return [];
      }
      return this.surveyForm.filter(q => q.group === this.currentTab);
    },
    interactionQuestions() {
      if (!this.surveyForm) {
        return [];
      }
      return this.surveyForm.filter(q => q.group === "interaction");
    },
    exposureQuestions() {
      if (!this.surveyForm) {
        return [];
      }
      return this.surveyForm.filter(q => q.group === "exposure");
    },
    surveyCount() {
      if (!this.$parent.bundle) {
        return 0;
      }
      return this.$parent.bundle.surveys.length;
    }
  },
  mounted() {
    this.toggleInfoModal();
  },
  /*
  async mounted() {
    if (!this.$parent.bundle || !this.$parent.bundle.summary) {
      const response = await axios.get(
        `http://localhost:8000/api/v1/survey_bundles/${this.$route.params.id}`
      );
      this.$parent.bundle = response.data;
      this.surveyForm = this.$parent.bundle.summary;
    }
  },
  */
  methods: {
    toggleInfoModal() {
      this.showInfoModal = !this.showInfoModal;
    }
  }
};
</script>
<style lang="scss" scoped>
.tab-nav {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .tab {
    width: 70px;
    height: 25px;
    padding: 3px;
    text-align: center;
    span {
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      line-height: 18px;
      color: #27272e;
      margin: 5px 0px;
    }
  }
  .tab.active {
    border-bottom: 2px solid #4287e0;
  }
}

.info-modal {
  h4 {
    font-weight: normal;
    font-size: 18px;
    line-height: 23px;
    color: #27272e;
    margin: 10px 0px;
  }
  p {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 20px;
    color: #505055;
  }
  .labels {
    .label {
      display: flex;
      height: 40px;
    }
    .icon {
      width: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      p {
        margin: 0px;
        font-size: 14px;
      }
    }
    .unanimous {
      background: #eefcf0;
      .text {
        p {
          color: #1e8e37;
        }
      }
    }
    .some {
      background: #fdfcea;
      .text {
        p {
          color: #ca9100;
        }
        .sub {
          color: #505055;
        }
      }
    }
    .none {
      background: #fdeaea;
      .text {
        p {
          color: #b74412;
        }
      }
    }
  }
  .modal-footer {
    button {
      width: 200px;
    }
  }
}
</style>
