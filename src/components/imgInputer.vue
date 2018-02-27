<template>
  <div :class="[sizeClass, 'img-inputer-area']">
    <i v-if="showRemove"
      class="iconfont icon-shanchu1 remove-icon"
      @click="remove" />
    <div class="img-inputer"
      :class="[themeClass, sizeClass, nhe ? 'nhe': '', 
      showRemove ? 'img-inputer-margin' : '']"
      ref="box">
      <!--<i class="iconfont img-inputer__icon" v-html="iconUnicode"></i>-->
      <i class="iconfont img-inputer__icon"
        style="color: white;">+</i>
      <p class="img-inputer__placeholder">{{ placeholder }}</p>
      <div class="icon-background" />
      <div class="img-inputer__preview-box"
        v-if="imgSelected || imgShow">
        <img :src="mydataUrl"
          class="img-inputer__preview-img">
      </div>
      <label :for="readonly ? '' : inputId"
        class="img-inputer__label" />
      <!-- 图片或文件选择后鼠标移入的提示-->
      <div class="img-inputer__mask"
        v-if="imgSelected && !noMask">
        <p class="img-inputer__file-name">{{ fileName }}</p>
        <p class="img-inputer__change"
          v-if="readonly">{{ readonlyTipText }}</p>
        <p class="img-inputer__change"
          v-else>{{ bottomText }}</p>
      </div>
      <!-- input主体-->
      <input ref="inputer"
        v-if="capture"
        type="file"
        :name="name"
        :id="inputId"
        :accept="accept"
        capture="video"
        class="img-inputer__inputer"
        @change="handleFileChange">
      <input ref="inputer"
        v-else
        type="file"
        :name="name"
        :id="inputId"
        :accept="accept"
        class="img-inputer__inputer"
        @change="handleFileChange">
      <transition name="fade">
        <div class="img-inputer__err"
          v-if="errText.length">{{ errText }}</div>
      </transition>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
/* eslint-disable */
export default {
  name: 'vue-img-inputer',
  props: {
    type: {
      default: 'img',
      type: String
    },
    // 默认情况下可能会导致选择框弹出慢的问题，请针对具体化图片类型即可解决
    accept: {
      default: 'image/*,video/*;',
      type: String
    },
    capture: {
      default: true,
      type: Boolean
    },
    id: {
      default: '',
      type: String
    },
    onChange: {
      default: null,
      type: Function
    },
    readonly: {
      type: Boolean,
      default: false
    },
    readonlyTipText: {
      default: '不可更改',
      type: String
    },
    bottomText: {
      default: '点击或拖拽图片以修改',
      type: String
    },
    placeholder: {
      default: '点击或拖拽选择图片',
      type: String
    },
    value: {
      default: undefined
    },
    icon: {
      default: '',
      type: String
    },
    customerIcon: {
      default: '',
      type: String
    },
    maxSize: {
      default: 10240,
      type: Number
    },
    size: {
      default: '',
      type: String
    },
    imgSrc: {
      default: '',
      type: String
    },
    nhe: {
      type: Boolean,
      default: false
    },
    noMask: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'file'
    },
    imgShow: {
      type: Boolean,
      default: false
    },
    dataUrl: {
      type: String,
      default: ''
    },
    fileKey: '',
    index: {
      //索引
      type: Number,
      default: 0
    },
    showRemove: {
      //显示移除
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputId: '',
      file: [],
      mydataUrl: this.dataUrl,
      fileName: '',
      errText: ''
    };
  },
  computed: {
    imgSelected() {
      return !!this.mydataUrl || !!this.fileName;
    },
    sizeHumanRead() {
      let rst = 0;
      if (this.maxSize < 1024) {
        rst = this.maxSize + 'K';
      } else {
        rst =
          (this.maxSize / 1024).toFixed(this.maxSize % 1024 > 0 ? 2 : 0) + 'M';
      }
      return rst;
    },
    sizeClass() {
      if (this.size) {
        return `img-inputer--${this.size}`;
      }
    },
    themeClass() {
      return `img-inputer--${this.theme}`;
    },
    ICON() {
      let rst = '';
      if (this.icon) {
        rst = this.icon;
      } else {
        rst = this.theme == 'light' ? 'img' : 'clip';
      }
      return rst;
    },
    iconUnicode() {
      let iconMap = {
        img: '&#xe624;',
        clip: '&#xe62d;',
        img2: '&#xe62f;'
      };
      return this.customerIcon || iconMap[this.ICON];
    }
  },
  mounted() {
    if (!window.lrz) {
      require('lrz/dist/lrz.all.bundle');
    }
    this.inputId = this.id || this.gengerateID();
    if (this.imgSrc) {
      this.mydataUrl = this.imgSrc;
    }
    // 阻止浏览器默认的拖拽时事件
    ['dragleave', 'drop', 'dragenter', 'dragover'].forEach(e => {
      this.preventDefaultEvent(e);
    });
    // 绑定拖拽时间
    this.addDropSupport();
  },
  methods: {
    preventDefaultEvent(eventName) {
      document.addEventListener(
        eventName,
        function(e) {
          e.preventDefault();
        },
        false
      );
    },
    addDropSupport() {
      let BOX = this.$refs.box;
      BOX.addEventListener('drop', e => {
        e.preventDefault();
        if (this.readonly) return false;
        this.errText = '';
        let fileList = e.dataTransfer.files;

        if (fileList.length === 0) {
          return false;
        }
        /**
         * TODO
         * 未来打算支持多文件
         * Intend to support muti-file
         */
        if (fileList.length > 1) {
          this.errText = '暂不支持多文件';
          return false;
        }
        this.handleFileChange(fileList);
      });
    },
    gengerateID() {
      let nonstr = Math.random()
        .toString(36)
        .substring(3, 8);
      if (!document.getElementById(nonstr)) {
        return nonstr;
      } else {
        return this.gengerateID();
      }
    },
    handleFileChange(e) {
      if (typeof e.target === 'undefined') this.file = e[0];
      else this.file = e.target.files[0];

      this.errText = '';
      //      let size = Math.floor(this.file.size / 1024);
      //      if (size > this.maxSize) {
      //        this.errText = `文件大小不能超过${this.sizeHumanRead}`;
      //        return false
      //      }

      // 双向绑定
      //      this.$emit('input', this.file);
      let that = this;
      this.$indicator.open({ spinnerType: 'fading-circle', text: '压缩中' });
      lrz(this.file, { width: 2048 })
        .then(function(rst) {
          // 处理成功会执行
          // 文件选择回调 && 两种绑定方式
          that.onChange && that.onChange(that.file, that.file.name);
          that.$emit('fileChange', rst, that.fileKey, that.index);

          that.imgPreview(that.file);

          that.fileName = that.file.name;

          that.resetInput();
          console.log(
            that.fileName,
            '压缩前：',
            (that.file.size / 1024).toFixed(2),
            'KB'
          );
          console.log(
            that.fileName,
            '压缩后：',
            (rst.fileLen / 1024).toFixed(2),
            'KB'
          );
          if (rst.fileLen / 1024 > 1024) {
            //大于 1M
            that.$toast('图片太大，请重新选择');
          }
        })
        .catch(function(err) {
          // 处理失败会执行
          console.log('fail' + err);
        })
        .always(function() {
          that.$indicator.close();
          // 不管是成功失败，都会执行
        });
    },
    imgPreview(file) {
      let self = this;

      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function() {
          self.mydataUrl = this.result;
        };
      }
    },
    resetInput() {
      let input = document.getElementById(this.inputId);
      let form = document.createElement('form');

      document.body.appendChild(form);

      let parentNode = input.parentNode;
      // 判断input 是否为最后一个节点
      let isLastNode = parentNode.lastChild === input;
      let nextSibling;
      // 如果后面还有节点，则记录下一个node，做位置标志
      // 如果本身已经是最后一个节点，则直接通过parentNode appendChild即可
      if (!isLastNode) {
        nextSibling = input.nextSibling;
      }

      form.appendChild(input);
      form.reset();

      isLastNode
        ? parentNode.appendChild(input)
        : parentNode.insertBefore(input, nextSibling);

      document.body.removeChild(form);
    },
    /**
     * 移除控件
     */
    remove() {
      this.file = [];
      this.mydataUrl = '';
      this.errText = '';
      this.fileName = '';
      this.resetInput();
      this.$emit('remove', this.fileKey, this.index);
    },
    /**
     * 重置缓存
     */
    reset() {
      this.file = [];
      this.mydataUrl = '';
      this.errText = '';
      this.fileName = '';
    }
  },
  watch: {
    imgSrc(newval, oldval) {
      if (newval) {
        this.mydataUrl = newval;
      }
    },
    value(newval, oldval) {
      // 重置逻辑
      if (oldval && !newval) {
        this.file = [];
        this.mydataUrl = '';
        this.errText = '';
        this.fileName = '';
      }
    }
  }
};
</script>

<style lang="scss" scoped="scoped">
.remove-icon {
  color: red;
  position: absolute;
  padding: 0 15px 15px 0;
  z-index: 1001;
}
.img-inputer {
  position: relative;
  display: inline-block;
  width: 260px;
  height: 150px;
  border-radius: 5px;
  /*background: #f0f0f0;*/
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.117647),
    0 1px 4px rgba(0, 0, 0, 0.117647);
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &--small {
    width: 150px;
    height: 100px;

    .img-inputer__placeholder {
      font-size: 12px;
      /*top: 65%;*/
      top: 75%;
    }
    .img-inputer__icon {
      font-size: 28px !important;
      top: 38%;
    }
  }

  &--large {
    width: 460px;
    height: 250px;
  }

  &:hover {
    transform: scale(1.015);
    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
      0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  }
  &.nhe:hover {
    transform: scale(1);
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.117647),
      0 1px 4px rgba(0, 0, 0, 0.117647);
  }

  &--light {
    background: #fbfdff;
    border: 1px solid #97a8be;
    box-shadow: none;

    .img-inputer__icon {
      color: #97a8be;
    }

    &:hover {
      transform: scale(1);
      box-shadow: none;
      border-color: #20a0ff;
    }
  }

  &__icon {
    position: absolute;
    font-size: 34px !important;
    left: 50%;
    top: 40%;
    color: #757575;
    transform: translate(-50%, -50%);
  }

  &__placeholder {
    position: absolute;
    margin: 0;
    font-size: 14px;
    width: 100%;
    color: #aaa;
    top: 62%;
    text-align: center;
  }

  &__preview-box {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 5px;
    overflow: hidden;
    background: #333;
  }

  &__preview-img {
    position: relative;
    top: 0;
    /*z-index: 2;*/
    width: 100%;
  }

  &__label {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    cursor: pointer;
    margin-bottom: 0;
    &:hover {
      ~ .img-inputer__mask {
        display: block;
      }
    }
  }

  &__inputer {
    position: absolute;
    left: -9999px;
  }

  &__mask {
    display: none;
    position: absolute;
    z-index: 9;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 5px;
    text-align: center;
    background: rgba(0, 0, 0, 0.22);
  }

  &__file-name {
    color: white;
    font-size: 13px;
    padding-top: 10px;
    margin: 0;
    display: inline-block;
    max-width: 90%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  &__change {
    position: absolute;
    bottom: 0;
    margin: 0;
    font-size: 12px;
    border-radius: 0 0 5px 5px;
    background: rgba(0, 0, 0, 0.7);
    text-align: center;
    color: white;
    width: 100%;
    padding: 9px 0;
  }

  &__err {
    color: #e55;
    font-size: 12px;
    position: absolute;
    bottom: -28px;
    width: 100%;
  }
}

.img-inputer-margin {
  margin-top: 5px;
  margin-left: 5px;
}

.fade {
  &-enter-active,
  &-leave-active {
    transition: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: trnsform;
  }
  &-enter,
  &-leave-active {
    opacity: 0;
    transform: translateX(30%);
  }
}
.icon-background {
  width: 60px;
  height: 60px;
  background: rgba(251, 0, 0, 0.2);
  margin: 8px auto;
  border-radius: 30px;
}
</style>