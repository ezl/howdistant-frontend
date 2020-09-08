<template>
  <div class="nav">
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
      <div class="back" @click="shareAnswers">
        <img src="@/assets/images/export.svg" />
      </div>
    </template>
    <div class="label">
      <p>{{ currentLabel }}</p>
    </div>
    <template v-if="showGroupButton">
      <div class="group" @click="toggleGroupModal">
        <img src="@/assets/images/group.svg" />
        <span
          >{{ $parent.bundle ? $parent.bundle.surveys.length : 0 }} answ.</span
        >
      </div>
    </template>

    <modal class="group-modal" v-if="showGroupModal" @close="toggleGroupModal">
      <div slot="header" style="width: 100%; display: inline-block">
        <h4 style="margin:0px; display: inline-block;">Responses</h4>
        <div
          class="modal-default-button"
          @click="toggleGroupModal"
          style="float:right;"
        >
          <img src="@/assets/images/close.svg" alt="" />
        </div>
      </div>
      <div slot="body">
        <div class="responses">
          <div
            class="response"
            v-for="(survey, idx) in $parent.bundle.surveys"
            :key="idx"
          >
            <div class="name">
              <p>{{ survey.name }}</p>
            </div>
            <div class="created">
              <p>{{ survey.created | date }}</p>
            </div>
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showGroupModal: false
    };
  },
  computed: {
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
    showGroupButton() {
      if (this.$route.meta.showGroupButton) {
        return true;
      }
      return false;
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    close() {
      this.$router.push({ name: "landing" });
    },
    shareAnswers() {
      if (navigator.share) {
        navigator.share({
          title: "How Distant?",
          url: `${location.origin}/${this.$parent.bundle.id}/`
        });
      }
    },
    toggleGroupModal() {
      this.showGroupModal = !this.showGroupModal;
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
</style>
