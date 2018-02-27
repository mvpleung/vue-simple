/*
 * 车牌录入
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-27 14:50:45
 */
<template>
  <div class="vehicle-input">
    <mt-field label="车牌号"
      placeholder="请输入车牌号码"
      v-model="presetNumber"
      @click.native="keyboardVisible = !keyboardVisible"
      readonly />
    <div class="page-bottom-area">
      <mt-button type="primary"
        size="large"
        :disabled="$utils.isEmpty(presetNumber)">下一步</mt-button>
    </div>
    <mt-popup v-model="keyboardVisible"
      position="bottom">
      <mixed-keyboard :args="{presetNumber, autoComplete: false}"
        :callbacks="{oncompleted, onkeypressed}" />
    </mt-popup>
  </div>
</template>
<script>
import { MixedKeyboard } from 'vehicle-keyboard';
export default {
  data() {
    return {
      presetNumber: '',
      keyboardVisible: false
    };
  },
  created() {
    document.setTitle('输入车牌');
  },
  methods: {
    /**
     * 车牌录入完成
     * @param {String} presetNumber 车牌号码
     * @param {Boolean} isAutoCompleted 是否自动完成
     */
    oncompleted(presetNumber, isAutoCompleted) {
      this.presetNumber = presetNumber;
    },
    /**
     * 键位按下监听
     * @param {Object} key 键位对象
     */
    onkeypressed(key) {
      if (key.FUN_OK) {
        this.keyboardVisible = !this.keyboardVisible;
      }
    }
  },
  components: {
    MixedKeyboard
  }
};
</script>
<style lang="scss" scoped>
.vehicle-input {
  padding-top: 25px;
  .mint-popup.mint-popup-bottom {
    width: 100%;
  }
}
</style>


