<template>
  <div :class="['number-button', showInput ? 'number-button--large' : '' ]">
    <mt-button class="number-button-minus"
      @click.native="decreaseVal"
      :disabled="handleDisable || minDisabled">
      <i class="iconfont icon-minus" />
    </mt-button>
    <slot v-if="showInput">
      <input type="text"
        v-model="currentValue"
        class="number-button-field"
        readonly
        onfocus="this.blur">
    </slot>
    <mt-button class="number-button-plus"
      @click.native="increaseVal"
      :disabled="handleDisable || maxDisabled">
      <i class="iconfont icon-plus" />
    </mt-button>
  </div>
</template>
<script>
export default {
  name: 'number-button',
  props: {
    /**
     * 中间计算框的数据
     */
    value: Number,
    /**
     * 步长
     */
    step: {
      type: Number,
      default: 1
    },
    /**
     * 最小值
     */
    min: {
      type: Number,
      default: -Infinity
    },
    /**
     * 最大值
     */
    max: {
      type: Number,
      default: Infinity
    },
    /**
     * 是否显示输入框
     */
    showInput: Boolean,
    /**
     * 是否禁用
     */
    disabled: Boolean,
    /**
     * 加
     */
    increase: Function,
    /**
     * 减
     */
    decrease: Function
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
    currentValue(val, oldVal) {
      this.$emit('input', val);
    }
  },
  computed: {
    minDisabled() {
      return this._decrease(this.value, this.step) < this.min;
    },
    maxDisabled() {
      return this._increase(this.value, this.step) > this.max;
    },
    handleDisable() {
      return (
        this.disabled ||
        this.currentValue === undefined ||
        this.currentValue === null
      );
    },
    precision() {
      const { value, step, getPrecision } = this;
      return Math.max(getPrecision(value), getPrecision(step));
    }
  },
  methods: {
    toPrecision(num, precision) {
      if (precision === undefined) precision = this.precision;
      return parseFloat(parseFloat(Number(num).toFixed(precision)));
    },
    getPrecision(value) {
      const valueString = value.toString();
      const dotPosition = valueString.indexOf('.');
      let precision = 0;
      if (dotPosition !== -1) {
        precision = valueString.length - dotPosition - 1;
      }
      return precision;
    },
    _increase(val, step) {
      if (typeof val !== 'number') return this.currentValue;
      const precisionFactor = Math.pow(10, this.precision);
      return this.toPrecision(
        (precisionFactor * val + precisionFactor * step) / precisionFactor
      );
    },
    _decrease(val, step) {
      if (typeof val !== 'number') return this.currentValue;
      const precisionFactor = Math.pow(10, this.precision);
      return this.toPrecision(
        (precisionFactor * val - precisionFactor * step) / precisionFactor
      );
    },
    increaseVal() {
      if (this.handleDisable || this.maxDisabled) return;
      if (this.increase) {
        this.increase();
        return;
      }
      const value = this.value || 0;
      const newVal = this._increase(value, this.step);
      if (newVal > this.max) return;
      this.setCurrentValue(newVal);
    },
    decreaseVal() {
      if (this.handleDisable || this.minDisabled) return;
      if (this.decrease) {
        this.decrease();
        return;
      }
      const value = this.value || 0;
      const newVal = this._decrease(value, this.step);
      if (newVal < this.min) return;
      this.setCurrentValue(newVal);
    },
    setCurrentValue(newVal) {
      const oldVal = this.currentValue;
      if (newVal >= this.max) newVal = this.max;
      if (newVal <= this.min) newVal = this.min;
      if (oldVal === newVal) {
        this.$refs.input.setCurrentValue(this.currentValue);
        return;
      }
      this.$emit('change', newVal, oldVal);
      this.$emit('input', newVal);
      this.currentValue = newVal;
    }
  }
};
</script>
<style lang="scss">
.number-button {
  display: inline-flex;
  .number-button-minus {
    border-radius: 4px 0 0 4px;
    height: 30px;
  }
  .number-button-plus {
    border-radius: 0 4px 4px 0;
    height: 30px;
  }
  .number-button-field {
    width: 30%;
    border: 0;
    color: #656b79;
    background-color: #f6f8fa;
    box-shadow: 0 0 1px #b8bbbf;
    text-align: center;
  }
}
.number-button.number-button--large {
  width: 115px;
}
</style>


