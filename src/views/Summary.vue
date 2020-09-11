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

    <div class="questions" v-if="filteredQuestions">
      <div
        class="question"
        v-for="(question, idx) in filteredQuestions"
        :key="idx"
      >
        <h4>{{ question.question }}</h4>
        <div class="options">
          <div
            class="option"
            v-for="(option, optIdx) in question.options
              .filter(
                o =>
                  o.comfortable &&
                  o.comfortable.length > 0 &&
                  o.comfortable.length === surveyCount
              )
              .reverse()"
            :key="`unanimous-${optIdx}`"
          >
            <div class="img_block">
              <img v-if="optIdx === 0" src="@/assets/images/unanimous.svg" />
            </div>
            <div class="span_block">
              <span class="unanimous">{{ option.label }}</span>
            </div>
          </div>

          <div
            class="option"
            v-for="(option, optIdx) in question.options
              .filter(
                o =>
                  o.comfortable &&
                  o.comfortable.length > 0 &&
                  o.comfortable.length < surveyCount
              )
              .reverse()"
            :key="`warning-${optIdx}`"
            @click="toggleWarningModal(option, question)"
          >
            <div class="img_block">
              <img v-if="optIdx === 0" src="@/assets/images/warning.svg" />
            </div>
            <div class="span_block">
              <span class="warning">{{ option.label }}</span>
            </div>
          </div>

          <div
            class="option"
            v-for="(option, optIdx) in question.options
              .filter(o => !o.comfortable || !o.comfortable.length)
              .reverse()"
            :key="`uncomfortable-${optIdx}`"
          >
            <div class="img_block">
              <img
                v-if="optIdx === 0"
                src="@/assets/images/uncomfortable.svg"
              />
            </div>
            <div class="span_block">
              <span class="uncomfortable">{{ option.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal
      class="warning-modal"
      v-if="showWarningModal"
      @close="toggleWarningModal"
    >
      <div slot="body">
        <div class="question">
          <p>{{ currentQuestion.question }}</p>
        </div>

        <div class="option">
          <h4>{{ currentOption.label }}</h4>
        </div>

        <div class="comfortable">
          <div class="header_block">
            <div class="img_block">
              <img src="@/assets/images/unanimous.svg" />
            </div>
            <div class="span_block">
              <span>Comfortable with it</span>
            </div>
          </div>
          <div
            class="name_block"
            v-for="name in currentOption.comfortable"
            :key="name"
          >
            <div class="img_block">
              👍
            </div>
            <div class="span_block">
              <span>{{ name }}</span>
            </div>
          </div>
        </div>
        <div class="uncomfortable">
          <div class="header_block">
            <div class="img_block">
              <img src="@/assets/images/uncomfortable.svg" />
            </div>
            <div class="span_block">
              <span>Uncomfortable with it</span>
            </div>
          </div>
          <div
            class="name_block"
            v-for="name in currentOption.uncomfortable"
            :key="name"
          >
            <div class="img_block">
              👎
            </div>
            <div class="span_block">
              <span>{{ name }}</span>
            </div>
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      surveyForm: null,
      currentTab: "interaction",
      currentOption: null,
      currentQuestion: null,
      showWarningModal: false
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
    surveyCount() {
      if (!this.$parent.bundle) {
        return 0;
      }
      return this.$parent.bundle.surveys.length;
    }
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
    toggleWarningModal(option, question) {
      this.showWarningModal = !this.showWarningModal;

      this.currentOption = option;
      this.currentQuestion = question;
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
.questions {
  margin: 30px 0px;

  h4 {
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 25px;

    color: #505055;
  }
}
.option {
  margin: 10px 0px;
  display: flex;
  flex-direction: row;

  .img_block {
    display: flex;
    width: 40px;
    margin-right: 5px;
    height: 40px;
    align-items: center;
    justify-content: center;
  }
  .span_block {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 200px;
  }
  span {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
  }
  .unanimous {
    color: #00844c;
  }
  .warning {
    color: rgba(39, 39, 46, 0.6);
  }
  .uncomfortable {
    text-decoration-line: line-through;

    color: #8b3939;
  }
}
.warning-modal {
  .question {
    p {
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 20px;

      color: rgba(80, 80, 85, 0.6);
    }
  }
  .option {
    h4 {
      margin: 10px 0px;
    }
  }
  .comfortable,
  .uncomfortable {
    span {
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 20px;
    }
    .header_block,
    .name_block {
      margin: 10px 0px;
      display: flex;
      flex-direction: row;

      .img_block {
        display: flex;
        width: 40px;
        margin-right: 5px;
        height: 40px;
        align-items: center;
        justify-content: center;
      }
      .span_block {
        display: flex;
        justify-content: center;
        align-items: center;
        max-width: 200px;
      }
    }
  }
  .comfortable {
    .header_block {
      span {
        color: #00844c;
      }
    }
  }
  .uncomfortable {
    .header_block {
      span {
        color: #8b3939;
      }
    }
  }
}
</style>
