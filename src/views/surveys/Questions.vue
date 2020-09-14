<template>
  <div>
    <div class="content">
      <div class="progress">
        <div
          class="dot"
          :class="{ active: idx === currentIndex, done: idx < currentIndex }"
          v-for="(q, idx) in $parent.questions"
          :key="idx"
        ></div>
      </div>
      <div class="question">
        <h4>{{ currentQuestion.question }}</h4>
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
        :disabled="currentQuestion.required && !currentAnswer"
        :label="
          currentIndex === $parent.questions.length - 1 ? 'Submit' : 'Next'
        "
      />
    </div>
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
      return `${location.origin}/${this.$parent.bundle.id}/`;
    },
    hasShare() {
      if (navigator && navigator.share) {
        return true;
      }
      return false;
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
  .progress {
    max-width: 230px;
    width: auto;
    display: inline-block;
    margin: auto;
    position: relative;
    left: 50%; // Move the element to the left by 50% of the container's width
    transform: translateX(-50%);

    .dot {
      display: inline-block;
      background: #e6e6e6;
      border-radius: 29px;
      width: 8px;
      height: 8px;
      margin: 0px 5px;
    }
    .active {
      background: #2671d9;
    }
    .done {
      background: rgba(38, 113, 217, 0.6);
    }
  }
  .question {
    h4 {
      font-weight: normal;
      font-size: 20px;
      line-height: 24px;
      color: #505055;
    }
  }
  .options {
    position: absolute;
    top: 200px;
    bottom: 100px;
    left: 0px;
    right: 0px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .option {
      height: 65px;
      padding: 5px 0px;
      display: flex;
      align-items: center;

      p {
        margin-left: 10px;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 18px;
        max-width: 190px;

        color: #27272e;
      }
      .emoji {
        font-size: 25px;
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
    .option.active {
      background: rgba(56, 124, 219, 1) !important;

      p {
        color: #ffffff;
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
}

.actions {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
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
</style>
