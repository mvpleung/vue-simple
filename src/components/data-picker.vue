/*
 * 数据选择器
 * @Author: liangzc 
 * @Date: 2018-02-01 17:44:59 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:18:08
 */
<template>
  <mt-popup v-model="visible"
    :position="position"
    class="mint-data">
    <mt-picker :slots="slotsData"
      @change="change"
      :visible-item-count="visibleItemCount"
      :value-key="valueKey"
      class="mint-data-picker"
      ref="dataPicker"
      :show-toolbar="showToolbar">
      <span class="mint-data-action mint-data-cancel"
        @click="close">{{ cancelText }}</span>
      <span class="mint-data-action mint-data-confirm"
        @click="confirm">{{ confirmText }}</span>
    </mt-picker>
  </mt-popup>
</template>

<script type="text/babel">
export default {
  name: 'data-picker',
  props: {
    slots: {
      type: Array,
      default: () => {
        return [];
      }
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    visibleItemCount: {
      type: Number,
      default: 5
    },
    valueKey: {
      type: String,
      default: null
    },
    default: {
      type: Object,
      default: null
    },
    position: {
      type: String,
      default: 'bottom'
    },
    showToolbar: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      currentValues: null,
      slotsData: []
    };
  },
  watch: {
    visible(val, oldVal) {
      if (val === false) {
        this.$emit('cancel');
        let defaultValue = this.updateDefault();
        defaultValue && this.$refs.dataPicker.setValues([defaultValue]);
      }
    },
    default: {
      handler(val, oldVal) {
        this.updateDefault();
      },
      deep: true
    }
  },
  created() {
    this.$nextTick(() => {
      this.$refs.dataPicker.$el.addEventListener(
        'touchmove',
        event => {
          event.preventDefault();
        },
        false
      );
    });
    this.updateDefault();
  },
  methods: {
    open() {
      let defaultValue = this.updateDefault();
      defaultValue && this.$refs.dataPicker.setValues([defaultValue]);
      this.visible = true;
    },
    close() {
      this.visible = false;
      this.$emit('cancel');
    },
    change(picker, values) {
      this.currentValues = values;
      this.handleValueChange();
      this.$emit('change', picker, values);
    },
    confirm() {
      this.visible = false;
      this.$emit('confirm', this.$refs.dataPicker, this.currentValues);
    },
    handleValueChange() {
      this.$emit('input', this.currentValues);
    },
    /**
     * 更新默认值
     */
    updateDefault() {
      if (this.default) {
        this.slotsData = [];
        let that = this,
          opt = that.default.opt && Array.isArray(that.default.opt),
          values = [],
          defaultValue;
        this.slots.forEach(item => {
          let indexOf = -1;
          item.values &&
            item.values.forEach((value, index) => {
              if (
                indexOf === -1 &&
                (value.value === (that.default.value || that.default.val) ||
                  value.label === (that.default.label || that.default.val_text))
              ) {
                indexOf = index;
                defaultValue = value;
              }
              if (opt) {
                //配置可选项
                that.default.opt.forEach(opt => {
                  if (value.value === String(opt)) {
                    values.push(value);
                  }
                });
              }
            });
          that.slotsData.push({
            flex: item.flex,
            values: opt ? values : item.values,
            defaultIndex: indexOf !== -1 ? indexOf : item.defaultIndex
          });
        });
        return defaultValue;
      }
      this.slotsData = this.slots;

      return null;
    }
  }
};
</script>
<style lang="scss">
.mint-data {
  width: 100%;
  pointer-events: auto;
  .picker-slot-wrapper,
  .picker-item {
    backface-visibility: hidden;
  }

  .picker-toolbar {
    border-bottom: solid 1px #eaeaea;
  }

  .mint-data-action {
    display: inline-block;
    width: 50%;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    color: #26a2ff;
  }

  .mint-data-cancel {
    float: left;
  }

  .mint-data-confirm {
    float: right;
  }
}
</style>