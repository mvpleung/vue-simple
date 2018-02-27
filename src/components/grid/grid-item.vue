/*
 * 九宫格子项
 * @Date: 2018-02-01 15:27:15 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-27 11:08:18
 */
<template>
  <a href="javascript:;"
    class="weui-grid"
    @click="onClick"
    :style="style">
    <div class="weui-grid__icon"
      v-if="hasIconSlot || icon">
      <slot name="icon">
        <img :src="icon"
          alt="">
      </slot>
    </div>
    <p v-if="hasLabelSlot || label"
      class="weui-grid__label">
      <slot name="label">
        <span v-html="labelVal" />
        <template v-if="subLabel">
          <br>
          <span v-html="subLabelVal" />
        </template>
      </slot>
    </p>
    <slot/>
  </a>
</template>
<script>
export default {
  name: 'grid-item',
  props: {
    /**
     * 标签文本
     */
    label: [String, Number],
    /**
     * label 展示模式，支持 %s {0}  占位
     */
    labelPattern: String,
    /**
     * 副标签文本
     */
    subLabel: [String, Number],
    /**
     * subLabel 展示模式，支持 %s {0}  占位
     */
    subLabelPattern: String,
    /**
     * 图片地址
     */
    icon: String,
    /**
     * 路由地址，可选值['BACK', { replace: true }, '']
     */
    link: String,
    /**
     * 子项点击
     */
    itemClick: Function,
    /**
     * 下标（结合 grid-view 使用）
     */
    index: Number
  },
  data() {
    return {
      hasIconSlot: false,
      hasLabelSlot: false
    };
  },
  mounted() {
    this.$slots.icon && (this.hasIconSlot = true);
    this.$slots.label && (this.hasLabelSlot = true);
  },
  computed: {
    /**
     * 动态调整宽度
     */
    style() {
      const column = this.$parent.column;
      if (!column || column === 3) {
        return;
      }
      return {
        width: `${100 / column}%`
      };
    },
    /**
     * 处理占位
     */
    labelVal() {
      return this.labelPattern && this.labelPattern !== '' ?
        this.labelPattern.replace('%s', this.label).replace('{0}', this.label) :
        this.label;
    },
    /**
     * 处理占位
     */
    subLabelVal() {
      return this.subLabelPattern && this.subLabelPattern !== '' ?
        this.subLabelPattern
          .replace('%s', this.subLabel)
          .replace('{0}', this.subLabel) :
        this.subLabel;
    }
  },
  methods: {
    onClick() {
      if (/^javas/.test(this.link) || !this.link) {
        if (this.itemClick) {
          this.itemClick(this.index);
        }
        return;
      }
      const useRouter =
        typeof this.link === 'object' ||
        this.$router &&
          typeof this.link === 'string' &&
          !/http/.test(this.link);
      if (useRouter) {
        if (typeof this.link === 'object' && this.link.replace === true) {
          this.$router.replace(this.link);
        } else {
          this.link === 'BACK' ?
            this.$router.go(-1) :
            this.$router.push(this.link);
        }
      } else {
        window.location.href = this.link;
      }
    }
  }
};
</script>
<style lang="scss">
.weui-grid {
  text-decoration: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  position: relative;
  float: left;
  padding: 20px 10px;
  width: calc(100% /3);
  box-sizing: border-box;
  .weui-grid__icon {
    width: 28px;
    height: 28px;
    margin: 0 auto;
  }
  .weui-grid__icon + .weui-grid__label {
    margin-top: 5px;
  }
  .weui-grid__label {
    display: block;
    text-align: center;
    color: #000000;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .weui-grid__label span:last-child {
    line-height: 2;
    font-size: 80%;
  }
  .weui-grid__icon img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.weui-grid:before {
  content: ' ';
  position: absolute;
  right: 0;
  top: 0;
  width: 1px;
  bottom: 0;
  border-right: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 100% 0;
  transform-origin: 100% 0;
  -webkit-transform: scaleX(0.5);
  transform: scaleX(0.5);
}
.weui-grid:after {
  content: ' ';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.weui-grid:active {
  background-color: #ececec;
}
</style>


