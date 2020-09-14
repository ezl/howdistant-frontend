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
          <!-- START Unanimous Options -->
          <div
            class="option_group unanimous"
            v-if="
              question.options.filter(
                o =>
                  o.comfortable &&
                  o.comfortable.length > 0 &&
                  o.comfortable.length === surveyCount
              ).length
            "
          >
            <div class="icon">
              <img src="@/assets/images/check.svg" />
            </div>
            <div class="labels">
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
                <div class="span_block">
                  <span class="unanimous">{{ option.label }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- END Unanimous Options -->

          <!-- START Some Options -->
          <div
            class="option_group some"
            v-if="
              question.options.filter(
                o =>
                  o.comfortable &&
                  o.comfortable.length > 0 &&
                  o.comfortable.length < surveyCount
              ).length
            "
          >
            <div class="icon">
              <img src="@/assets/images/exclamation.svg" />
            </div>
            <div class="labels">
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
                <div class="span_block">
                  <span class="warning">{{ option.label }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- End Some Options -->

          <!-- START None Options -->
          <div
            class="option_group none"
            v-if="
              question.options.filter(
                o => !o.comfortable || !o.comfortable.length
              ).length
            "
          >
            <div class="icon">
              <img src="@/assets/images/none.svg" />
            </div>
            <div class="labels">
              <div
                class="option"
                v-for="(option, optIdx) in question.options
                  .filter(o => !o.comfortable || !o.comfortable.length)
                  .reverse()"
                :key="`uncomfortable-${optIdx}`"
              >
                <div class="span_block">
                  <span class="uncomfortable">{{ option.label }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- END None Options -->
        </div>
      </div>
    </div>

    <!-- START Option Detail Modal -->
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
    <!-- END Option Detail Modal -->

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
            <div class="text"><p>Some are comfortable with it</p></div>
          </div>

          <div class="label none">
            <div class="icon"><img src="@/assets/images/none.svg" /></div>
            <div class="text"><p>No one was comfortable with it</p></div>
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
      showWarningModal: false,
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
    toggleWarningModal(option, question) {
      this.showWarningModal = !this.showWarningModal;

      this.currentOption = option;
      this.currentQuestion = question;
    },
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
    color: #956b00;
  }
  .uncomfortable {
    text-decoration-line: line-through;

    color: #8b3939;
  }
}
.option_group {
  display: flex;
  flex-direction: row;
  .icon {
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .labels {
    display: flex;
    flex-direction: column;
  }
}
.option_group:first-child {
  border-radius: 10px 10px 0px 0px;
}
.option_group:last-child {
  border-radius: 0px 0px 10px 10px;
}
.option_group.unanimous {
  background: #eefcf0;
}
.option_group.some {
  background: #fdfcea;
}
.option_group.none {
  background: #fdeaea;
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
.info-modal {
  h4 {
    font-size: 18px;
    line-height: 23px;
    color: #27272e;
    margin: 10px 0px;
  }
  p {
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
}
</style>
