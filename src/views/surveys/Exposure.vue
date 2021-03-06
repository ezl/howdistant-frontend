<template>
  <div>
    <div class="questions">
      <div class="question" v-for="(question, idx) in questions" :key="idx">
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
              <p>All</p>
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
              <p>Some</p>
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
              <p>None</p>
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
            <div class="img_block"></div>
            <div class="span_block">
              <span>Marked that this applies to them</span>
            </div>
          </div>
          <div>
            <div
              class="name_block"
              v-for="(name, idx) in currentOption.comfortable"
              :key="`comfortable-${idx}`"
            >
              <div class="img_block">
                👍
              </div>
              <div class="span_block">
                <span>{{ name }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="uncomfortable">
          <div class="header_block">
            <div class="img_block"></div>
            <div class="span_block">
              <span>Did not mark this</span>
            </div>
          </div>
          <div>
            <div
              class="name_block"
              v-for="(name, idx) in currentOption.uncomfortable"
              :key="`uncomfortable-${idx}`"
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
      </div>
    </modal>
    <!-- END Option Detail Modal -->
  </div>
</template>
<script>
export default {
  props: {
    questions: {
      type: Array,
      required: true
    },
    surveyCount: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      showWarningModal: false,
      currentOption: null,
      currentQuestion: null
    };
  },
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

    color: #595959;
  }
}
.option_group {
  display: flex;
  flex-direction: row;
  .icon {
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    p {
      font-size: 14px;
    }
  }
  .labels {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
.option_group:first-child {
  border-radius: 10px 10px 0px 0px;
}
.option_group:last-child {
  border-radius: 0px 0px 10px 10px;
}
.option_group:only-child {
  border-radius: 10px 10px 10px 10px;
}
.option_group.unanimous {
  background: #eefcf0;
  .icon {
    p {
      color: #1e8e37;
    }
  }
}
.option_group.some {
  background: #fdfcea;

  .icon {
    p {
      color: #956b00;
    }
  }
}
.option_group.none {
  background: #f7f7f7;
  .icon {
    p {
      color: #595959;
    }
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
      color: #505055;
      font-style: normal;
      font-weight: normal;
      font-size: 20px;
      line-height: 24px;
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
      }
    }
    .name_block {
      border-radius: 5px;
    }
    .name_block:nth-child(even) {
      background: #fff;
    }
    .name_block:nth-child(even) {
      background: #f6f6f6;
    }
  }

  .comfortable {
    .header_block {
      background: #fdfcea;

      span {
        color: #ca9100;
        font-size: 16px;
        line-height: 20px;
      }
    }
  }
  .uncomfortable {
    .header_block {
      background: #f7f7f7;

      span {
        font-size: 16px;
        line-height: 20px;
        color: #595959;
      }
    }
  }
}
</style>
