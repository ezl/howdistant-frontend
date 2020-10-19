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
        Want to add more people later on? Access the menu on the results page to
        send out additional invites.
      </p>
    </div>

    <div class="actions">
      <primary-button
        style="margin-bottom: 15px;"
        @click="shareSurvey"
        label="Invite Others to take the Quiz"
      />
      <router-link :to="{ name: 'invite_sent' }">Skip</router-link>
    </div>

    <CopyLinkModal
      :show="showCopyLinkModal"
      :bundleId="$parent.bundle.id"
      @close="toggleCopyLinkModal"
    />
  </div>
</template>
<script>
import CopyLinkModal from "@/components/CopyLinkModal.vue";

export default {
  components: {
    CopyLinkModal
  },
  data() {
    return {
      showCopyLinkModal: false
    };
  },
  computed: {
    bundleLink() {
      return `${location.origin}/survey/invited/?id=${this.$parent.bundle.id}`;
    },
    hasShare() {
      if (navigator && navigator.share) {
        return true;
      }
      return false;
    }
  },
  methods: {
    async shareSurvey() {
      if (this.hasShare) {
        try {
          await navigator.share({
            title: "How Distant?",
            url: this.bundleLink
          });
          setTimeout(() => {
            this.toggleNotificationModal();
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      } else {
        this.toggleCopyLinkModal();
      }
    },
    toggleCopyLinkModal() {
      this.showCopyLinkModal = !this.showCopyLinkModal;

      if (!this.showCopyLinkModal) {
        this.$router.push({ name: "invite_sent" });
      }
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
    height: 90px;
    width: 90px;
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
