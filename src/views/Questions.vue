<template>
  <div>
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
          class="option"
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
          class="option"
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
    <div class="actions">
      <primary-button
        @click="goToNextQuestion"
        :disabled="currentQuestion.required && !currentAnswer"
        :label="
          currentIndex === $parent.questions.length - 1 ? 'Submit' : 'Next'
        "
      />
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      currentIndex: 0,
      currentQuestion: {},
      currentAnswer: null
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
    }
  },
  mounted() {
    this.currentIndex = parseInt(this.$route.hash.replace("#", "")) || 0;
    this.currentQuestion = this.$parent.questions[this.currentIndex];
    this.currentAnswer = this.currentQuestion.answer;
  },
  methods: {
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
          hash: `#${this.currentIndex + 1}`
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
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
.options {
  margin-top: 50px;

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
  .option:nth-child(2) {
    background-color: rgba(0, 0, 0, 0.02);
    mix-blend-mode: screen;
  }
  .option:nth-child(3) {
    background-color: rgba(0, 0, 0, 0.05);
    mix-blend-mode: screen;
  }
  .option:nth-child(4) {
    mix-blend-mode: screen;
    background-color: rgba(0, 0, 0, 0.08);
  }
  .option:nth-child(5) {
    mix-blend-mode: screen;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .option:nth-child(6) {
    mix-blend-mode: screen;
    background-color: rgba(0, 0, 0, 0.12);
  }
  .option.active {
    background: linear-gradient(328.85deg, #387cdb -16.63%, #387cdb 216.13%);
    p {
      color: #ffffff;
    }
  }
}
.actions {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
}
</style>
