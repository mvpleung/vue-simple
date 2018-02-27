<template>
  <div class="pay-test">
    <div class="page-container">
      <span v-show="result && result.code === 'ok'"
        class="mint-field-state is-success">
        <i class="mintui mintui-field-success" />
      </span>
      <span v-show="result && result.code !== 'ok'"
        class="mint-field-state is-error">
        <i class="mintui mintui-field-error" />
      </span>
      <p class="font18">{{ result ? result.message : '' }}</p>
    </div>
    <div class="page-bottom-area">
      <mt-button type="primary"
        size="large"
        :disabled="isLoading"
        @click.native="pay">
        一分钱测试
        <div v-show="isLoading"
          class="mint-spinner-snake"
          slot="icon" />
      </mt-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLoading: false,
      result: null
    };
  },
  created() {
    document.setTitle('支付测试');
  },
  methods: {
    pay() {
      this.axios
        .get('v1/', {
          params: {
            openId: this.$store.getters.openId
          },
          errorHandle: true
        })
        .then(data => {
          this.result = null;
          this.isLoading = true;
          this.$uniquePay
            .pay(data.params)
            .then(resp => {
              this.result = resp;
              this.isLoading = false;
            })
            .catch(err => {
              this.result = err;
              this.isLoading = false;
            });
        })
        .catch(err => {
          this.result = err;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.pay-test {
  margin-top: 35%;
  .page-container {
    text-align: center;
    color: rgb(192, 204, 218);
    .mint-field-state {
      margin-left: 0;
      i {
        font-size: 50px;
      }
    }
    p {
      margin-top: 20px;
    }
  }
  .page-bottom-area {
    margin-top: 50px;
    .mint-spinner-snake {
      border-top-color: rgb(236, 235, 235);
      border-left-color: rgb(236, 235, 235);
      border-bottom-color: rgb(236, 235, 235);
      border-width: 2px;
      height: 15px;
      width: 15px;
    }
  }
}
</style>
