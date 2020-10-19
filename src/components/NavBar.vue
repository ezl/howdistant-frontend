<template>
  <div class="nav">
    <!-- START Side Menu -->
    <side-menu
      :showMenu="showSideMenu"
      @close="toggleSideMenu"
      class="side-menu"
    >
      <div slot="header" class="header">
        <div class="close">
          <img src="@/assets/images/close.svg" @click="toggleSideMenu" />
        </div>
        <div class="header-content">
          <h4>Menu</h4>
        </div>
      </div>
      <div slot="menu-items" class="menu-items">
        <div class="menu-item" @click="shareSurvey">
          <div class="icon">📤</div>
          <div class="menu-label"><p>Invite someone to the group</p></div>
        </div>
        <div class="line"></div>
        <div class="menu-item" @click="toggleNotificationModal">
          <div class="icon">🔔</div>
          <div class="menu-label">
            <p>Get notified when new results added</p>
          </div>
        </div>
        <div class="line"></div>
        <div class="menu-item" @click="startNewSurvey">
          <div class="icon">📝</div>
          <div class="menu-label">
            <p>Start a new survey with another group</p>
          </div>
        </div>
        <div class="line"></div>

        <div class="menu-item">
          <div class="icon">😊</div>
          <div class="menu-label">
            <p>
              Your Group ({{
                $parent.bundle ? $parent.bundle.surveys.length : 0
              }}
              responses)
            </p>
          </div>
        </div>
        <div class="menu-item survey-names">
          <div class="icon"></div>
          <div class="menu-label" v-if="$parent.bundle">
            <p v-for="(survey, idx) in $parent.bundle.surveys" :key="idx">
              {{ survey.name }}
            </p>
          </div>
        </div>
      </div>
    </side-menu>
    <!-- END Side Menu -->

    <template v-if="showBackButton">
      <div class="back" @click="goBack">
        <img src="@/assets/images/back.svg" />
      </div>
    </template>
    <template v-if="showCloseButton">
      <div class="close" @click="close">
        <img src="@/assets/images/close.svg" />
      </div>
    </template>
    <template v-if="showExportButton">
      <div class="back" @click="toggleSideMenu">
        <img src="@/assets/images/hamburger.svg" />
      </div>
    </template>
    <div class="label">
      <p v-if="currentRouteName !== 'questions'">
        {{ currentLabel }}
      </p>
      <div v-if="currentRouteName === 'questions'" class="progress">
        <div
          class="dot"
          :class="{ active: idx === currentIndex, done: idx < currentIndex }"
          v-for="(q, idx) in $parent.questions"
          :key="idx"
        ></div>
      </div>
    </div>

    <CopyLinkModal
      v-if="$parent.bundle"
      :show="showCopyLinkModal"
      :bundleId="$parent.bundle.id"
      @close="toggleCopyLinkModal"
    />

    <NotificationModal
      v-if="$parent.bundle"
      :show="showNotificationModal"
      :surveyId="
        $parent.bundle.submitted_survey
          ? $parent.bundle.submitted_survey.id
          : $parent.bundle.surveys[0].id
      "
      @close="toggleNotificationModal"
      @success="notificationUpdateSuccess"
    />
  </div>
</template>
<script>
import CopyLinkModal from "@/components/CopyLinkModal.vue";
import NotificationModal from "@/components/NotificationModal.vue";

export default {
  components: {
    CopyLinkModal,
    NotificationModal
  },
  data() {
    return {
      showSideMenu: false,
      showCopyLinkModal: false,
      showNotificationModal: false
    };
  },
  computed: {
    currentIndex() {
      if (!this.$route.hash.replace("#", "")) {
        return 0;
      }
      return parseInt(this.$route.hash.replace("#", "")) - 1;
    },
    currentRouteName() {
      return this.$route.name;
    },
    currentLabel() {
      return this.$route.meta.label(this);
    },
    showBackButton() {
      if (this.$route.meta.showBackButton === false) {
        return false;
      }
      return true;
    },
    showCloseButton() {
      if (this.$route.meta.showCloseButton) {
        return true;
      }
      return false;
    },
    showExportButton() {
      if (this.$route.meta.showExportButton) {
        return true;
      }
      return false;
    },
    bundleLink() {
      return `${location.origin}/survey/invited?id=${this.$parent.bundle.id}`;
    },
    hasShare() {
      if (navigator && navigator.share) {
        return true;
      }
      return false;
    }
  },
  methods: {
    startNewSurvey() {
      this.toggleSideMenu();
      this.$router.push({ name: "name" });
    },
    toggleNotificationModal() {
      this.showNotificationModal = !this.showNotificationModal;
    },
    notificationUpdateSuccess() {
      setTimeout(() => {
        this.toggleNotificationModal();
      }, 1000);
    },
    async shareSurvey() {
      if (this.hasShare) {
        try {
          await navigator.share({
            title: "How Distant?",
            url: this.bundleLink
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        this.toggleCopyLinkModal();
      }
    },
    toggleCopyLinkModal() {
      this.showCopyLinkModal = !this.showCopyLinkModal;
    },
    goBack() {
      this.$router.back();
    },
    close() {
      this.$router.push({ name: "landing" });
    },
    toggleSideMenu() {
      this.showSideMenu = !this.showSideMenu;
    }
  }
};
</script>
<style lang="scss" scoped>
.nav {
  height: 50px;
  padding: 0px 20px;
  display: flex;
  align-items: center;

  .back {
    width: 30px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: left;
  }
  .label {
    width: 100%;
    display: block;

    p {
      font-style: normal;
      font-weight: normal;
      font-size: 20px;
      line-height: 25px;

      color: #27272e;
      text-align: center;
      position: absolute;

      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      margin: 0px;
    }
    p.questions {
      font-size: 16px;
    }
    .progress {
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
  }
  .group {
    width: 55px;
    display: flex;
    flex-direction: column;

    img {
      margin-bottom: 5px;
    }
    span {
      font-size: 12px;
      line-height: 15px;
      color: rgba(39, 39, 46, 0.6);
    }
  }
}

.group-modal {
  h4 {
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 25px;

    color: #505055;
  }
  .responses {
    .response {
      display: flex;
      padding: 5px 15px;
      .name {
        flex: 4;
        p {
          text-align: left;
          font-style: normal;
          font-weight: normal;
          font-size: 18px;
          line-height: 23px;
          color: #505055;
        }
      }
      .created {
        flex: 1;
        p {
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 18px;
          color: rgba(80, 80, 85, 0.6);
        }
      }
    }
    .response:nth-child(even) {
      background: #f6f6f6;
      border-radius: 5px;
    }
  }
}

.side-menu {
  .header {
    display: flex;
    flex-direction: row;
    padding: 10px;

    .close {
      flex: 1;
      display: flex;
    }
    .header-content {
      flex: 5;
      h4 {
        margin: 0px;
        padding-right: 15px;
      }
    }
  }
  .menu-items {
    padding: 10px;

    .menu-item {
      display: flex;
      flex-direction: row;
      height: 50px;
      margin: 5px 0px;

      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
      }
      .menu-label {
        display: flex;
        align-items: center;
        width: 100%;
        p {
          margin: 0px;
          font-size: 14px;
          line-height: 17px;
        }
      }
    }
    .survey-names {
      margin-top: 0px;
      margin-left: 50px;
      height: 100%;
    }
  }
  .line {
    border-top: 1px solid rgba(66, 135, 224, 0.4);
  }
}

/* iPhone 5/SE */
@media screen and (max-width: 320px) {
  .nav {
    padding: 0px 15px;
    .label {
      p {
        font-size: 18px;
      }
    }
  }
}
</style>
