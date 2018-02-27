<template>
  <div class="page-container">
    <img v-show="authFail"
      src="../../assets/refresh.png"
      width="10%">
    <p class="font18"
      v-show="!authFail">正在跳转...</p>
    <p class="font16"
      v-show="authFail">授权失败，轻触屏幕重新加载</p>
    <p v-show="authFail">
      <span class="font12">{{ errorMsg }}</span>
    </p>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      query: {},
      errorMsg: '',
      authFail: false //授权失败
    };
  },
  created() {
    document.setTitle('加载中...');
    this.query = this.$utils.getUrlVars();
    window.addEventListener('touchstart', this.retry);
    this.init();
  },
  methods: {
    /**
     * 初始化
     */
    init() {
      //code: 微信code, auth_code:支付宝code
      if (
        (!this.$utils.isEmpty(this.query.code) ||
          !this.$utils.isEmpty(this.query.auth_code)) &&
        !this.$utils.isEmpty(this.query.state)
      ) {
        this.authFail = false;
        //code、state都不为空，授权成功
        this.axios
          .get('v1/wechat', { params: this.query, errorHandle: true })
          .then(resp => {
            this.errorMsg = '';
            if (!this.$utils.isEmpty(this.query.redirect)) {
              this.updateUser(resp.user_info || {});
              const redirectUri = decodeURIComponent(this.query.redirect);
              if (redirectUri) {
                //兼容外链
                if (redirectUri.startWith('http')) {
                  window.top.location.href = redirectUri;
                } else {
                  this.$router.replace(redirectUri);
                }
              }
            } else {
              self.location = document.referrer;
            }
          })
          .catch(error => {
            this.authFail = true;
            this.errorMsg = error.message;
          });
      } else {
        //重定向授权页
        const { wechat, alipay } = this.$store.getters.appid;
        const oatuhUri = {
          wechat: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wechat}&redirect_uri={0}&response_type=code&scope=snsapi_userinfo&state=vueapp#wechat_redirect`,
          alipay: `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${alipay}&scope=auth_user&redirect_uri={0}`
        };
        var authUri = oatuhUri[$globalConfig.navigator.ua];
        authUri &&
          (window.top.location.href = authUri.format(
            encodeURIComponent(
              `${location.origin}/#/oauth?redirect=${encodeURIComponent(
                decodeURIComponent(this.query.redirect)
              )}`
            )
          ));
      }
    },
    /**
     * 重试
     */
    retry(e) {
      if (this.authFail) {
        window.removeEventListener('touchstart', this.retry);
        //授权失败，轻触重试
        let link = document.createElement('a');
        link.href = `/#/oauth?redirect=${encodeURIComponent(
          decodeURIComponent(this.query.redirect)
        )}`;
        link.click();
        link.remove();
      }
    },
    ...mapActions(['updateUser'])
  }
};
</script>
<style lang="scss" scoped>
.page-container {
  width: 100%;
  font-size: 20px;
  text-align: center;
  color: rgb(192, 204, 218);
  top: 35%;
  position: fixed;
  p {
    margin-top: 20px;
  }
}
</style>
