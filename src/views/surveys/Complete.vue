<template>
  <div class="complete">
    <div class="header">
      <div class="logo">
        <img src="@/assets/images/confetti.png" />
      </div>
    </div>
    <div class="subheader">
      <h4>
        That’s it, you just made socializing easier.
      </h4>
    </div>
    <div class="content">
      <p>
        Send the link below to friends and family to compare answers and make
        your reunion safe and comfortable for everyone.
      </p>
      <p>
        Save the results page, and it will update as friends and family members
        answer the questions.
      </p>

      <router-link :to="{ name: 'summary', params: { id: $parent.bundle.id } }"
        >View Results</router-link
      >
    </div>

    <div class="actions">
      <primary-button
        style="margin-bottom: 15px;"
        @click="shareSurvey"
        :label="hasShare ? 'Share to compare' : 'Copy link to share'"
      />
      <div class="copy-link" v-show="hasShare" style="margin-bottom: 15px;">
        <a href="#" @click="toggleCopyLinkModal">Copy Link</a>
      </div>
      <secondary-button @click="toggleNotificationModal" label="Get Notified" />
    </div>

    <!-- START Copy Link Modal -->
    <modal
      class="copy-link-modal"
      v-if="showCopyLinkModal"
      @close="toggleCopyLinkModal"
    >
      <div slot="body">
        <h4>Copy the URL</h4>
        <p>
          Send this link to friends and family to invite them to share answers
          so that everyone is comfortable.
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
      </div>
    </modal>
    <!-- END Copy Link Modal -->

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
          label="Submit"
          @click="enableSMSNotification"
          :disabled="!phone"
        />
      </div>
    </modal>
    <!-- END Notification Modal -->
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      showCopyLinkModal: false,
      showNotificationModal: false,
      copied: false,
      phone: ""
    };
  },
  computed: {
    bundleLink() {
      return `${location.origin}/${this.$parent.bundle.id}`;
    },
    hasShare() {
      if (navigator && navigator.share) {
        return true;
      }
      return false;
    }
  },
  methods: {
    async enableSMSNotification() {
      const id = this.$parent.bundle.submitted_survey.id;
      const { phone } = this;

      try {
        await axios.put(
          `${process.env.VUE_APP_BACKEND_URI}/api/v1/surveys/${id}/enable_sms_notification/`,
          {
            phone
          }
        );
        this.toggleNotificationModal();
        this.$toasted.show("🔔 Notifications Turned On!", {
          className: "enabled_sms_toast",
          position: "top-center",
          fullWidth: true,
          action: [
            {
              text: "",
              class: "close_toast_action",
              onClick: (e, toastObject) => {
                toastObject.goAway(0);
              }
            }
          ],
          duration: 5000
        });
      } catch (err) {
        console.log(err);
      }
    },
    shareSurvey() {
      if (this.hasShare) {
        navigator.share({
          title: "How Distant?",
          url: this.bundleLink
        });
      } else {
        this.toggleCopyLinkModal();
      }
    },
    toggleNotificationModal() {
      this.showNotificationModal = !this.showNotificationModal;
    },
    toggleCopyLinkModal() {
      this.showCopyLinkModal = !this.showCopyLinkModal;
    },
    copyUrl() {
      let textToCopy = this.$refs.bundleLink;
      textToCopy.select();
      document.execCommand("copy");
      this.copied = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.complete {
  margin-bottom: 40px;
}
.logo {
  img {
    margin: auto;
    display: block;
  }
}
.subheader {
  h4 {
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 30px;

    color: #27272e;
  }
}
.content {
  p {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 20px;

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

  .copy-link {
    margin-top: 30px;
    text-align: center;

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
