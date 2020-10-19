<template>
  <modal class="copy-link-modal" v-if="show" @close="$emit('close')">
    <div slot="body">
      <h4>Copy the URL</h4>
      <p>
        Send this link to friends and family to invite them to share answers so
        that everyone is comfortable.
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
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    bundleId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      copied: false
    };
  },
  computed: {
    bundleLink() {
      return `${location.origin}/survey/invited?id=${this.bundleId}`;
    }
  },
  methods: {
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
</style>
