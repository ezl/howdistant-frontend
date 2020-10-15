<template>
  <!-- START Notification Modal -->
  <modal class="notification-modal" v-if="show" @close="$emit('close')">
    <div slot="body">
      <h4>Get notified when friends and families answer</h4>
      <p>
        Enter your phone number below, and we will text you when new results are
        added to your comparison page.
      </p>
      <div class="link">
        <input
          placeholder="(123) 456-7890"
          type="tel"
          ref="phone"
          v-model="phone"
          v-cleave="{
            numericOnly: true,
            blocks: [0, 3, 0, 3, 4],
            delimiters: ['(', ')', ' ', '-']
          }"
        />
      </div>
    </div>
    <div slot="footer">
      <primary-button
        :label="notificationSuccess ? 'Success' : 'Submit'"
        @click="enableSMSNotification"
        :disabled="!phone || loading || notificationSuccess"
        :loading="loading"
        :success="notificationSuccess"
      />
    </div>
  </modal>
  <!-- END Notification Modal -->
</template>
<script>
import axios from "axios";

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    surveyId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      notificationSuccess: false,
      phone: "",
      loading: false
    };
  },
  methods: {
    async enableSMSNotification() {
      const id = this.surveyId;
      const { phone } = this;

      try {
        this.loading = true;
        await axios.put(
          `${process.env.VUE_APP_BACKEND_URI}/api/v1/surveys/${id}/enable_sms_notification/`,
          {
            phone
          }
        );
        this.loading = false;
        this.notificationSuccess = true;
        this.$emit("success");
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.notification-modal {
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
      background: url("../assets/images/link.svg") no-repeat scroll 10px 15px;
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

.notification-modal {
  h4 {
    margin-bottom: 0px;
  }
  .link {
    input {
      width: 100%;
      border-radius: 8px;
      background: none;
      background-color: #f0f2f5;
      padding-left: 15px;
      font-size: 18px;
    }
  }
}
</style>
