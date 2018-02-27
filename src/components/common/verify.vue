<template>
  <div class="container">
    <!-- <div class="logo_container">
			<img class="logo" src="../../assets/logo.png" />
		</div> -->
    <div class="page-part"
      style="margin-top:30px;">
      <label>字面量测试：</label>
      <mt-field label="组合校验"
        type="tel"
        v-model="phoneNumber1"
        v-verify="{rule: 'required|mobile', 
        blur:true,replace:{a:1},error:['手机号码不能为空','请正确输入手机号码']}"
        placeholder="手机号码"
        :attr="{ maxlength: 11 }" />
    </div>
    <div class="page-part"
      v-for="(item, index) in list"
      :key="index">
      <label>行内错误展示-自定义错误提示(list)：</label>
      <mt-field label="组合校验"
        type="tel"
        v-model="list[index].name"
        v-verify="'required|mobile'"
        :data-verify="`{replace:{index:${index}}}`"
        placeholder="姓名" />
      <label style="color:#ff0000;"
        v-remind="list[index].name"
        :data-verify="`{replace:{index:${index}},error:['姓名不能为空','姓名错误']}`" />
    </div>
    <div class="page-part">
      <label>行内错误展示-自定义错误提示：</label>
      <mt-field label="组合校验"
        type="tel"
        v-model="phoneNumber"
        v-verify="'required'"
        placeholder="手机号码"
        :attr="{ maxlength: 11 }" />
      <label style="color:#ff0000;"
        v-remind="{field: 'phoneNumber', 
        error: ['手机号码不能为空','请正确输入手机号码']}" />
    </div>
    <!-- <div class="page-part"
      style="margin-top:30px;">
      <label>Toast错误展示-自定义错误提示：</label>
      <mt-field label="组合校验"
        type="tel"
        v-model="phoneNumber1"
        v-verify="'required|mobile'"
        data-verify="{blur:true,replace:{a:1}}"
        data-verify_errors="['手机号码不能为空','请正确输入手机号码']"
        placeholder="手机号码"
        :attr="{ maxlength: 11 }" />
    </div> -->
    <div class="page-part"
      style="margin-top:30px;">
      <label>行内错误展示-自定义校验规则：</label>
      <mt-field label="自定义校验"
        type="tel"
        v-model="verfifyCode"
        v-verify="verfifyCode"
        placeholder="输入验证码"
        :attr="{ maxlength: 4 }">
        <mt-button type="primary"
          :disabled="!verificationDisabled || time > 0"
          @click.stop.prevent="getVerification">{{ verification }}</mt-button>
      </mt-field>
      <label v-remind="verfifyCode"
        style="color:#ff0000;" />
    </div>
    <div class="page-part"
      style="margin-top:30px;">
      <label>Toast错误展示-自定义校验规则：</label>
      <mt-field label="Toast提示"
        type="tel"
        v-model="toast"
        v-verify="'toast'"
        placeholder="Toast"
        :attr="{ maxlength: 11 }" />
    </div>
    <div class="page-footer">
      <mt-switch v-model="checkAll">是否批量校验（暂不支持批量Toast）</mt-switch>
      <mt-switch v-model="msgBox">是否Toast提示（行内错误展示不支持）</mt-switch>
      <mt-button type="primary"
        size="large"
        @click="login">测试</mt-button>
      <router-link to="verify"
        @click.native="$router.go(0)">测试刷新</router-link>
    </div>
  </div>
</template>

<script type="application/ecmascript">
import { LOGIN } from '@/store/types';
export default {
  name: '',
  data() {
    return {
      list: [],
      phoneNumber: '',
      phoneNumber1: '',
      time: 0,
      verfifyCode: '',
      toast: '',
      checkAll: false,
      msgBox: true
    };
  },
  mounted() {
    this.$messagebox(
      '动态匹配路径',
      JSON.stringify(this.$utils.pathToRegexp('/:code'))
    );
  },
  watch: {
    checkAll(val) {
      this.$verify.config({
        batch: val,
        msgBox: null
      });
    },
    msgBox(val) {
      this.$verify.config({
        msgbox: this.msgBox ? this.$toast : false
      });
    }
  },
  verify: {
    verfifyCode: [
      {
        test: 'required',
        message: '验证码不能为空'
      },
      {
        test: /^(\+|-)?\d+($|\.\d+$)/,
        message: '请正确输入验证码'
      },
      {
        minLength: 4,
        message: '请输入四位验证码'
      }
    ],
    toast: [
      {
        test: 'required',
        message: 'Toast不能为空'
      },
      {
        minLength: 4,
        message: 'Toast 最少四位'
      }
    ]
  },
  computed: {
    verification() {
      return this.time > 0 ? this.time + 's后重新获取' : '获取验证码';
    },
    verificationDisabled() {
      return this.$verify.validate(
        'phoneNumber',
        this.$options.verify.mobile,
        true
      );
    },
    loginDisabled() {
      return !(
        this.verificationDisabled && this.$verify.validate('verfifyCode', true)
      );
    }
  },
  methods: {
    timer() {
      if (this.time > 0) {
        this.time--;
        setTimeout(this.timer, 1000);
      }
    },
    getVerification() {
      this.axios({
        url: '/abc'
        // silence:true //是否静默（不弹Loading，不提示错误）
      }).then(response => {
        this.$toast('已发送验证码');
        this.time = 60;
        this.timer();
      });
    },
    login() {
      this.list.push({});
      if (this.$verify.check()) {
        this.$router.push('/homePage');
        this.$store.dispatch(LOGIN, 'token');
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.container {
  padding-top: 20px;

  .logo_container {
    width: 200px;
    margin: 80px auto;

    .logo {
      width: 100%;
    }
  }

  .page-footer {
    padding: 15px;
    margin-top: 20px;

    .mint-button {
      margin-top: 15px;
    }
  }
}
</style>