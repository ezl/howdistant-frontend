<template>
  <div class="complete">
    <div class="header">
      <div class="logo">
        <img src="@/assets/images/bell.png" />
      </div>
    </div>
    <div class="subheader">
      <h4>
        Invite Sent!<br />
        Get notified of responses?
      </h4>
    </div>
    <div class="content">
      <p>
        Sit back, relax, and wait for their preferences to come in. Your results
        will automatically update to compare preferences as your friends and
        family answer the survey. Click “Get Notified” to recieve a text when a
        new result is added.
      </p>
    </div>

    <div class="actions">
      <primary-button
        style="margin-bottom: 15px;"
        @click="toggleNotificationModal"
        label="Get Notified"
      />
      <router-link :to="{ name: 'summary', params: { id: $parent.bundle.id } }"
        >Skip</router-link
      >
    </div>

    <!-- START Notification Modal -->
    <modal
      class="notification-modal"
      v-if="showNotificationModal"
      @close="toggleNotificationModal"
    >
      <div slot="body">
        <h4>Get notified when friends and families answer</h4>
        <p>
          Enter your phone number below, and we will text you when new results
          are added to your comparison page.
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
      <!--
      <template v-if="notificationSuccess">
        <div slot="body">
          <h4>Success!</h4>
          <img src="@/assets/images/success.svg" />
        </div>
        <div slot="footer">
          <primary-button label="View Results" @click="navigateToSummary" />
        </div>
      </template>
      -->
    </modal>
    <!-- END Notification Modal -->
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      showNotificationModal: false,
      notificationSuccess: false,
      phone: "",
      loading: false
    };
  },
  computed: {
    hasShare() {
      if (navigator && navigator.share) {
        return true;
      }
      return false;
    }
  },
  methods: {
    navigateToSummary() {
      this.toggleNotificationModal();
      this.$router.push({
        name: "summary",
        params: { id: this.$parent.bundle.id }
      });
    },
    async enableSMSNotification() {
      const id = this.$parent.bundle.submitted_survey.id;
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
        setTimeout(() => {
          this.navigateToSummary();
        }, 1000);
      } catch (err) {
        console.log(err);
      }
    },
    toggleNotificationModal() {
      this.showNotificationModal = !this.showNotificationModal;
    }
  }
};
</script>
<style lang="scss" scoped>
.complete {
  margin-bottom: 40px;
}
.logo {
  margin-top: 10px;
  img {
    margin: auto;
    display: block;
    height: 75px;
    width: 75px;
  }
}
.subheader {
  h4 {
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 30px;
    margin-top: 20px;

    color: #27272e;
    padding: 5px;
  }
}
.content {
  p {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;

    color: #000000;
    padding: 5px;
  }
  a {
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 23px;
    /* identical to box height */
    text-decoration-line: underline;
    color: #2671d9;
  }
}
.actions {
  margin-top: 50px;
  text-align: center;

  a {
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 23px;
    /* identical to box height */
    text-decoration-line: none;
    color: #2671d9;
  }
}
.copy-link-modal,
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

/* iPhone 5/SE */
@media (max-width: 320px) {
  .actions {
    margin-top: 20px;
  }
}
</style>
<style lang="scss">
.toasted-container.top-center.full-width {
  .enabled_sms_toast {
    background-color: #2671d9;
    font-family: Arial;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    padding-left: calc(100vw / 4);
  }

  a.close_toast_action {
    background: url("../../assets/images/toast-close.svg") no-repeat scroll;
  }
}
</style>
