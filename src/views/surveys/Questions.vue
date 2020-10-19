<template>
  <div>
    <div class="content">
      <div class="question">
        <div class="question_text" v-html="currentQuestionText"></div>
      </div>
      <div class="options">
        <template v-if="currentQuestion.type === 'radio'">
          <label
            v-for="(opt, idx) in currentQuestion.options"
            :key="idx"
            class="option radio"
            :class="{
              active:
                currentAnswer === opt.value ||
                (currentAnswerOption &&
                  currentAnswerOption.depend.includes(opt.value))
            }"
          >
            <div
              class="dash-top"
              v-if="
                idx !== 0 &&
                  currentAnswerOption &&
                  (currentAnswer === opt.value ||
                    currentAnswerOption.depend.includes(opt.value))
              "
            ></div>
            <input
              type="radio"
              :checked="
                currentAnswer === opt.value ||
                  (currentAnswerOption &&
                    currentAnswerOption.depend.includes(opt.value))
              "
              :id="idx"
              :value="opt.value"
              name="options"
              v-model="currentAnswer"
            />
            <p class="emoji">{{ opt.icon }}</p>
            <p>{{ opt.label }}</p>
          </label>
        </template>
        <template v-if="currentQuestion.type === 'checkbox'">
          <label
            v-for="(opt, idx) in currentQuestion.options"
            :key="idx"
            class="option checkbox"
            :class="{ active: currentAnswer.includes(opt.value) }"
          >
            <input
              type="checkbox"
              :id="idx"
              :value="opt.value"
              name="options"
              v-model="currentAnswer"
              class="checkmark"
            />
            <p class="emoji">{{ opt.icon }}</p>
            <p>{{ opt.label }}</p>
          </label>
        </template>
      </div>
    </div>
    <div class="actions">
      <primary-button
        @click="goToNextQuestion"
        :disabled="!isValid"
        :label="
          currentIndex === $parent.questions.length - 1 ? 'Submit' : 'Next'
        "
      />
    </div>

    <!--
    <modal
      class="copy-link-modal"
      v-if="showCopyLinkModal"
      @close="toggleCopyLinkModal"
    >
      <div slot="body">
        <h4>That's it, you just made socializing easier.</h4>
        <p>
          Send the link below to friends and family to compare answers and make
          your reunion safe and comfortable for everyone.
        </p>
        <div class="link">
          <input type="text" :value="bundleLink" ref="bundleLink" />
          <div class="copy" @click="copyUrl">
            <p>Copy</p>
          </div>
        </div>
        <div class="copied" v-if="copied">
          <img src="@/assets/images/thumbup.png" />
          <p>link copied!</p>
        </div>
        <p>
          Save this link, it is your comparison page, and will update as friends
          and family members answer the questions.
        </p>

        <primary-button
          @click="shareSurvey"
          :label="hasShare ? 'Share to compare' : 'Copy link to share'"
        />
      </div>
    </modal>
    -->
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      currentIndex: 0,
      currentQuestion: {},
      currentAnswer: null,
      showCopyLinkModal: false,
      copied: false
    };
  },
  computed: {
    currentQuestionText() {
      if (!this.currentQuestion) {
        return "";
      }
      return `<h4>${this.currentQuestion.question}</h4>`.replace(
        /which|greetings|where|(what length)|when|(wear a mask)|eating|(how many people)/gi,
        function(x) {
          return `<span>${x}</span>`;
        }
      );
    },
    currentAnswerOption() {
      if (!this.currentAnswer) {
        return null;
      }
      const option = this.currentQuestion.options.find(
        opt => opt.value === this.currentAnswer
      );
      return option;
    },
    bundleLink() {
      return `${location.origin}/survey/invited?id=${this.$parent.bundle.id}/`;
    },
    hasShare() {
      if (navigator && navigator.share) {
        return true;
      }
      return false;
    },
    isValid() {
      if (!this.currentQuestion) {
        return true;
      }

      if (this.currentQuestion.required === false) {
        return true;
      }

      return this.currentQuestion.type === "radio"
        ? !!this.currentAnswer
        : !!(this.currentAnswer || []).length;
    }
  },
  mounted() {
    if (!this.$route.hash.replace("#", "")) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = parseInt(this.$route.hash.replace("#", "")) - 1;
    }

    this.currentQuestion = this.$parent.questions[this.currentIndex];
    this.currentAnswer = this.currentQuestion.answer;
  },
  methods: {
    toggleCopyLinkModal() {
      this.showCopyLinkModal = !this.showCopyLinkModal;
    },
    shareSurvey() {
      if (this.hasShare) {
        navigator.share({
          title: "How Distant?",
          url: this.bundleLink
        });
      }
    },
    async submitSurvey() {
      const { name, bundleId } = this.$parent;
      const answers = this.$parent.questions.map(q => q.answer);
      const response = await axios.post(
        `${process.env.VUE_APP_BACKEND_URI}/api/v1/survey_forms/submit/`,
        {
          answers,
          name,
          bundle: bundleId
        }
      );

      this.$parent.bundle = response.data;
    },
    async goToNextQuestion() {
      this.currentQuestion.answer = this.currentAnswer;
      if (this.currentIndex === this.$parent.questions.length - 1) {
        await this.submitSurvey();

        this.$router.push({
          name: "complete"
        });
      } else {
        this.$router.push({
          name: "questions",
          hash: `#${this.currentIndex + 2}`
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  label > input[type="radio"] {
    display: none;
  }
  label > input[type="radio"] + *::before {
    content: " ";
    display: inline-block;
    vertical-align: bottom;
    border: 1px solid white;
    width: 25px;
    height: 25px;
    margin-right: 1rem;
    border-radius: 50%;
    border: 1px solid rgba(39, 39, 46, 0.6);
  }

  label.active > input[type="radio"] + *::before {
    width: 25px;
    height: 25px;
    margin-right: 1rem;
    border-radius: 50%;
    border: 1px solid white;
    vertical-align: middle;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    background-image: url("../../assets/images/checked-white.svg");
    background-color: rgba(56, 124, 219, 0.8);
    background-size: auto;
  }

  label > input[type="radio"]:checked + * {
    color: rgba(56, 124, 219, 0.8);
  }
  label > input[type="radio"]:checked + *::before {
    width: 25px;
    height: 25px;
    margin-right: 1rem;
    border-radius: 50%;
    border: 1px solid white;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    background-image: url("../../assets/images/checked.svg");
    background-color: #fff;
    background-size: auto;
  }

  label > input[type="checkbox"] {
    display: none;
  }
  label > input[type="checkbox"] + *::before {
    content: " ";
    display: inline-block;
    vertical-align: bottom;
    border: 1px solid white;
    width: 24px;
    height: 24px;
    border-radius: 5px;
    margin-right: 1rem;
    border: 1px solid rgba(39, 39, 46, 0.6);
  }

  label > input[type="checkbox"]:checked + * {
    color: rgba(56, 124, 219, 0.8);
  }
  label > input[type="checkbox"]:checked + *::before {
    width: 24px;
    height: 24px;
    margin-right: 1rem;
    border-radius: 5px;
    border: 1px solid white;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    background-image: url("../../assets/images/checked.svg");
    background-color: #fff;
    background-size: auto;
  }

  .question {
    .question_text {
      ::v-deep h4 {
        margin-top: 0px;
        font-style: normal;
        font-weight: normal;
        font-size: 20px;
        line-height: 24px;
        color: #505055;
      }

      ::v-deep span {
        font-weight: bold;
        line-height: 30px;
        background: linear-gradient(
          to top,
          rgba(38, 113, 217, 0.2) 50%,
          transparent 50%
        );
      }
    }
  }
  .options {
    position: relative;
    left: 0px;
    right: 0px;
    overflow-y: scroll;
    display: table-cell;
    vertical-align: bottom;
    min-height: 300px;
    width: 100vh;
    height: 50vh;

    .option {
      height: calc(100vw / 7);
      max-height: 60px;
      padding: 5px 0px;
      display: flex;
      align-items: center;
      padding-right: 5px;

      .dash-top {
        border-left: 1px dashed #ffffff;
        position: relative;
        height: 35px;
        top: -30px;
        left: 24px;
      }

      p {
        margin-left: 10px;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 18px;

        color: #27272e;
      }
      .emoji {
        font-size: 25px;
        min-width: fit-content;
      }

      input {
        margin-left: 10px;
      }
    }

    .option.checkbox:nth-child(odd) {
      background-color: #f9f9f9;
    }

    .option.checkbox:nth-child(even) {
      background-color: #f0f0f0;
    }

    .option:first-child {
      border-radius: 10px 10px 0px 0px;
    }
    .option:last-child {
      border-radius: 0px 0px 10px 10px;
    }
    .option.radio:nth-child(2) {
      background-color: rgba(0, 0, 0, 0.02);
    }
    .option.radio:nth-child(3) {
      background-color: rgba(0, 0, 0, 0.05);
    }
    .option.radio:nth-child(4) {
      background-color: rgba(0, 0, 0, 0.08);
    }
    .option.radio:nth-child(5) {
      background-color: rgba(0, 0, 0, 0.1);
    }
    .option.radio:nth-child(6) {
      background-color: rgba(0, 0, 0, 0.12);
    }
    .option.checkbox.active {
      background: rgba(56, 124, 219, 1) !important;

      p {
        color: #ffffff;
      }
    }
    .option.active {
      p {
        color: white;
      }
    }

    .option.radio.active:nth-child(1) {
      background: rgba(56, 124, 219, 0.8);
    }
    .option.radio.active:nth-child(2) {
      background: rgba(56, 124, 219, 0.9);
    }
    .option.radio.active:nth-child(3) {
      background: rgba(56, 124, 219, 1);
    }
    .option.radio.active:nth-child(4) {
      background: rgba(56, 124, 219, 1.1);
    }
    .option.radio.active:nth-child(5) {
      background: rgba(56, 124, 219, 1.2);
    }
  }
  .options > :first-child {
    margin-top: auto;
  }
}

.actions {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  left: 0;
  bottom: 0;
  width: 100%;
}

.copy-link-modal {
  h4 {
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 30px;

    color: #27272e;
  }
  p {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
  }
  .link {
    display: flex;
    flex-direction: row;
    input {
      border: none;
      border-radius: 8px 0px 0px 8px;
      height: 50px;
      width: 250px;
      box-sizing: border-box;
      background: url("../../assets/images/link.svg") no-repeat scroll 10px 15px;
      padding-left: 40px;
      background-color: #f0f2f5;
    }
    .copy {
      width: 60px;
      height: 50px;
      background: #2671d9;
      border-radius: 0px 8px 8px 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      p {
        font-style: normal;
        font-weight: bold;
        font-size: 14px;
        line-height: 18px;
        /* identical to box height */

        color: #ffffff;
      }
    }
  }
  .copied {
    display: flex;
    margin-top: 10px;
    align-items: center;
    flex-direction: row;
    justify-content: center;

    img {
      width: 16px;
      height: 16px;
    }
    p {
      color: #2671d9;
      margin: 0px 5px;
    }
  }
}

/* iPhone 5/SE */
@media screen and (max-width: 320px) {
  .content {
    .options {
      height: 45vh;

      .option {
        .dash-top {
          border-left: 1px dashed #ffffff;
          position: relative;
          height: 28px;
          top: -28px;
          left: 24px;
        }
      }
    }
  }
}
</style>
