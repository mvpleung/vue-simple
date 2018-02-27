<template>
  <div class="field">
    <mt-cell class="wx-field"
      :title="title"
      :label="label"
      v-clickoutside="doCloseActive"
      :class="[{
      'is-textarea': type === 'textarea',
      'is-notitle': !title,
      'error-label': error
    }]">
      <textarea @change="$emit('change', currentValue)"
        ref="textarea"
        class="mint-field-core"
        :placeholder="placeholder"
        v-if="type === 'textarea'"
        :rows="rows"
        :disabled="disabled"
        :readonly="readonly"
        v-model="currentValue" />
      <input @change="$emit('change', currentValue)"
        ref="input"
        class="mint-field-core"
        :placeholder="placeholder"
        :number="type === 'number'"
        v-else
        :type="type"
        @focus="active = true"
        :disabled="disabled"
        :readonly="readonly"
        :value="currentValue"
        @input="handleInput">
      <div @click="handleClear"
        class="mint-field-clear"
        v-if="!disableClear"
        v-show="currentValue && type !== 'textarea' && active">
        <i class="mintui mintui-field-error" />
      </div>
      <span class="mint-field-state"
        v-if="state"
        :class="['is-' + state]">
        <i class="mintui"
          :class="['mintui-field-' + state]" />
      </span>
      <div class="mint-field-other">
        <slot/>
      </div>
    </mt-cell>
    <div class="lineerror"
      v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import Clickoutside from '@/js/clickoutside';

/**
 * mt-field
 * @desc 编辑器，依赖 cell
 * @module components/field
 *
 * @param {string} [type=text] - field 类型，接受 text, textarea 等
 * @param {string} [title] - 标题
 * @param {string} [label] - 标签
 * @param {string} [rows] - textarea 的 rows
 * @param {string} [placeholder] - placeholder
 * @param {string} [disabled] - disabled
 * @param {string} [readonly] - readonly
 * @param {string} [state] - 表单校验状态样式，接受 error, warning, success
 *
 * @example
 * <mt-field v-model="value" label="用户名" />
 * <mt-field v-model="value" label="密码" placeholder="请输入密码" />
 * <mt-field v-model="value" label="自我介绍" placeholder="自我介绍" type="textarea" rows="4" />
 * <mt-field v-model="value" label="邮箱" placeholder="成功状态" state="success" />
 */
export default {
  name: 'field',

  data() {
    return {
      active: false,
      currentValue: this.value
    };
  },

  directives: {
    Clickoutside
  },

  props: {
    type: {
      type: String,
      default: 'text'
    },
    rows: String,
    title: String,
    label: String,
    error: String,
    placeholder: String,
    readonly: Boolean,
    disabled: Boolean,
    disableClear: Boolean,
    state: {
      type: String,
      default: 'default'
    },
    value: {},
    attr: Object
  },
  methods: {
    doCloseActive() {
      this.active = false;
    },

    handleInput(evt) {
      this.currentValue = evt.target.value;
    },

    handleClear() {
      if (this.disabled || this.readonly) return;
      this.currentValue = '';
    }
  },

  watch: {
    value(val) {
      this.currentValue = val;
    },

    currentValue(val) {
      this.$emit('input', val);
    },

    attr: {
      immediate: true,
      handler(attrs) {
        this.$nextTick(() => {
          const target = [this.$refs.input, this.$refs.textarea];
          target.forEach(el => {
            if (!el || !attrs) return;
            Object.keys(attrs).map(name => el.setAttribute(name, attrs[name]));
          });
        });
      }
    }
  }
};
</script>

<style lang="scss">
.field {
  .wx-field {
    display: flex;

    textarea {
      align-items: inherit;

      .mint-cell-title {
        padding: 10px 0;
      }

      .mint-cell-value {
        padding: 5px 0;
      }
    }

    .mint-cell-title {
      width: 105px;
      flex: none;
    }

    .mint-cell-value {
      flex: 1;
      color: inherit;
      display: flex;
    }

    .mint-field-core {
      appearance: none;
      border-radius: 0;
      border: 0;
      flex: 1;
      outline: 0;
      line-height: 1.6;
      font-size: inherit;
      width: 100%;
    }

    .mint-field-clear {
      opacity: 0.2;
    }

    .mint-field-state {
      color: inherit;
      margin-left: 20px;

      .mintui {
        font-size: 20px;
      }

      .mintui-field-error {
        color: #f44336;
      }

      .mintui-field-warning {
        color: #ffc107;
      }

      .mintui-field-success {
        color: #4caf50;
      }

      .mintui-field-default {
        margin-left: 0;
      }
    }

    .mintui-field-other {
      position: relative;
    }
  }
  .wx-field.is-notitle {
    .mint-cell-title {
      display: none;
    }
  }
  .wx-field.error-label {
    .mint-cell-label {
      color: red;
    }
  }
  .lineerror {
    background: rgb(255, 105, 127);
    text-align: center;
    padding: 8px;
    color: white;
    position: relative;
    font-weight: 100;
    font-size: 14px;
  }
  .lineerror:before {
    position: absolute;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 9px solid rgb(255, 105, 127);
    content: ' ';
    display: block;
    width: 0;
    height: 0;
    top: -8px;
    right: 30px;
  }
}
</style>
