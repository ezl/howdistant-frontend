<template>
  <div class="name-content">
    <div class="name-tag">
      <div class="top">
        <div class="content">
          <h4>HELLO</h4>
          <h5>my name is</h5>
        </div>
      </div>
      <div class="label">
        <!--<p>{{ $parent.name }}</p> -->
      </div>
      <div class="bottom"></div>
    </div>
    <div class="input-content">
      <p>
        We will display this name when we compare your answers to the answers of
        your family and friends.
      </p>
      <input type="text" placeholder="Your Name" v-model="$parent.name" />
    </div>
    <div class="actions">
      <primary-button @click="goToQuestions" label="Continue" />
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goToQuestions() {
      this.$router.push({ name: "questions" });
    }
  }
};
</script>
<style lang="scss" scoped>
.name-content {
  .input-content {
    margin-top: 50px;
    margin-bottom: 30px;
    p {
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 20px;

      color: #27272e;
    }
    input {
      display: block;
      margin: auto;
      background: #e0e6eb;
      border-radius: 4px;
      width: 100%;
      -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
      -moz-box-sizing: border-box; /* Firefox, other Gecko */
      box-sizing: border-box; /* Opera/IE 8+ */
      max-width: 300px;
      height: 50px;
      border: none;
      padding-left: 15px;
    }
  }
  .name-tag {
    margin: 50px auto;
    text-align: center;
    width: 100%;

    .top {
      margin: 0px auto;
      max-width: 300px;
      height: 80px;
      background: #2671d9;
      border-radius: 10px 10px 0px 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      .content {
        h4 {
          font-style: normal;
          font-weight: bold;
          font-size: 28px;
          line-height: 35px;
          color: #ffffff;
          margin: 0px;
        }
        h5 {
          font-style: normal;
          font-weight: bold;
          font-size: 20px;
          line-height: 25px;
          color: #ffffff;
          margin: 0px;
        }
      }
    }
    .label {
      margin: 0px auto;
      max-width: 300px;
      height: 100px;

      background: #f2f2f2;
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        margin: 0px;
      }
    }
    .bottom {
      margin: 0px auto;
      max-width: 300px;
      height: 25px;
      background: #2671d9;
      border-radius: 0px 0px 10px 10px;
    }
  }
  .actions {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 30px;
  }
}
</style>
