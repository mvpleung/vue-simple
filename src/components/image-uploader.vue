<template>
  <div ref="imageUploader"
    class="image-uploader">
    <mt-cell :title="title"
      v-model="value">
      <span v-show="readOnly"
        class="mint-cell-value"
        @click="preview(true)">{{ placeholder }}
        <i class="iconfont icon-tupianyulan red" />
      </span>
      <template v-if="!readOnly">
        <mt-button v-show="showPreview"
          @click.native="preview(true)"
          class="preview-button"
          size="small">预览</mt-button>
        <input :id="clickId"
          type="file"
          :accept="accept"
          class="hide"
          @change="fileChange">
        <span class="mint-cell-value is-link"
          @click="chooseImg">{{ placeholder }}
          <i class="mint-cell-allow-right" />
        </span>
      </template>
    </mt-cell>
    <mt-popup class="preview-pop"
      v-model="previewVisible"
      position="bottom">
      <span class="img-area"
        @click="preview(false)">
        <h1>点击屏幕关闭预览</h1>
        <img v-if="imgDataArray.length <= 0"
          :src="base64 || value">
        <mt-swipe :auto="0"
          v-if="imgDataArray.length > 0">
          <mt-swipe-item v-for="(imgInfo, index) in imgDataArray"
            :key="index">
            <img :src="$utils.is('String', imgInfo) ? 
            imgInfo : (imgInfo.base64 || imgInfo.fileAddress)">
          </mt-swipe-item>
        </mt-swipe>
      </span>
    </mt-popup>
  </div>
</template>
<script type="text/babel">
export default {
  name: 'image-uploader',
  props: {
    title: {
      type: String,
      default: '选择图片'
    },
    placeholder: {
      type: String,
      default: '上传图片'
    },
    value: {
      type: String,
      default: null
    },
    imgData: {
      type: String,
      default: null
    },
    imgDataArray: {
      type: Array,
      default: () => []
    },
    accept: {
      default: 'image/*;',
      type: String
    },
    autoUpload: {
      //是否自动上传
      type: Boolean,
      default: false
    },
    readOnly: {
      //是否只读（仅预览）
      type: Boolean,
      default: false
    },
    error: {
      //是否自动动处理错误
      type: Boolean,
      default: true
    },
    tips: {
      type: Object,
      default: () => {
        return {};
      }
    },
    uploadUrl: {
      type: String,
      default: ''
    },
    uploadParams: {
      type: Object,
      default: () => {
        return {};
      }
    },
    fileKey: {
      //上传base64对应的键名
      type: String,
      default: 'file'
    },
    extra: {
      //额外参数，回回调
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      file: Object,
      base64: '',
      clickId: '',
      previewVisible: false
    };
  },
  created() {
    if (!window.lrz) {
      require('lrz/dist/lrz.all.bundle');
    }
    this.clickId = this.gengerateID();
    this.base64 = this.imgData;
  },
  computed: {
    showPreview() {
      return (
        !this.$utils.isEmpty(this.base64) || !this.$utils.isEmpty(this.value)
      );
    }
  },
  methods: {
    /**
     * 预览
     */
    preview(visible) {
      this.previewVisible = visible;
    },
    /**
     * 选择图片
     */
    chooseImg() {
      if (!this.readOnly) {
        let evObj = document.createEvent('MouseEvents');
        evObj.initEvent('click', true, false);
        document.getElementById(this.clickId).dispatchEvent(evObj);
      }
    },
    /**
     * 图片内容切换
     */
    fileChange(e) {
      if (typeof e.target === 'undefined') this.file = e[0];
      else this.file = e.target.files[0];
      if (!this.file) return;
      this.resetInput(e);
      let fileType = this.file.type;
      this.extra.fileName = this.file.name;
      // 如果没有文件类型，则通过后缀名判断（解决微信及360浏览器无法获取图片类型问题）
      if (!fileType) {
        let mime = {
            png: 'image/png',
            jpg: 'image/jpg',
            jpeg: 'image/jpeg',
            bmp: 'image/bmp'
          },
          fileName = this.file.name ?
            this.file.name.indexOf('.') !== -1 ?
              this.file.name :
              e.target.value :
            '';
        matchs = fileName.match(/\.([^\.]+)$/i);
        fileType = matchs && isArray(matchs) ? mime[matchs[1]] : '';
      }
      if (
        fileType &&
        fileType !== '' &&
        fileType !== null &&
        !/image.(png|PNG|jpg|JPG|jpeg|JPEG|bmp|BMP|TIFF|tiff|PCX|pcx)/.test(
          fileType
        )
      ) {
        //针对微信Android客户端无法获取文件后缀的忽略校验，改为压缩后校验
        this.$messagebox.alert('不支持的文件类型：' + fileType);
        return;
      }
      //			if(file.size > this.maxSize) {
      //				this.$messagebox.alert('选择文件大于' + this.maxSize / 1024 / 1024 + 'M，请重新选择');
      //				return;
      //			}
      if (window.lrz) {
        let that = this;
        that.$indicator.open(that.autoUpload ? '上传中...' : '正在压缩...');
        lrz(this.file, { width: 1024 })
          .then(function(rst) {
            fileType =
              that.file.type ||
              ((rst.base64 || '').split(';')[0] || '').split(':')[1];
            that.$indicator.close();
            if (
              !/image.(png|PNG|jpg|JPG|jpeg|JPEG|bmp|BMP|TIFF|tiff|PCX|pcx)/.test(
                fileType
              )
            ) {
              this.$messagebox.alert('不支持的文件类型：' + fileType);
              return;
            }
            rst.formData.append('fileType', (fileType || '').split('/')[1]);
            console.log('压缩前：', (that.file.size / 1024).toFixed(2), 'KB');
            console.log('压缩后：', (rst.fileLen / 1024).toFixed(2), 'KB');
            if (that.autoUpload) {
              that.uploadImg(rst);
            } else {
              that.$emit('pick', rst);
            }
            return rst;
          })
          .catch(function(err) {
            that.$indicator.close();
            console.error(err);
            that.error &&
              that.$messagebox.alert(
                (that.autoUpload ?
                  that.tips.upload || '上传图片失败' :
                  '压缩图片失败') + '：',
                err
              );
            !that.error && that.$emit('fail', err.message || err, that.tips);
          });
      } else {
        this.$messagebox.alert('缺少图片压缩组件');
      }
    },
    /**
     * 获取ID
     */
    gengerateID() {
      let nonstr = Math.random()
        .toString(36)
        .substring(3, 8);
      if (!document.getElementById(nonstr)) {
        return nonstr;
      }
      return this.gengerateID();
    },
    /**
     * 重置input
     */
    resetInput(e) {
      let input = e.target;
      let parentNode = input.parentNode;
      parentNode.removeChild(input);
      input = document.createElement('input');
      input.className = 'hide';
      input.setAttribute('type', 'file');
      input.setAttribute('accept', this.accept);
      this.clickId = this.gengerateID();
      input.setAttribute('id', this.clickId);
      input.addEventListener('change', this.fileChange, false);
      parentNode.appendChild(input);
    },
    /**
     * 上传图片
     */
    uploadImg(rst) {
      this.uploadParams = this.uploadParams || {};
      this.uploadParams[this.fileKey] = rst.base64;
      this.$indicator.open('上传中...');
      this.axios({
        url: this.uploadUrl,
        timeout: 60000,
        method: 'post',
        silence: !this.error,
        data: this.uploadParams
      })
        .then(resp => {
          this.base64 = rst.base64;
          this.extra.tips = this.tips;
          delete this.uploadParams[this.fileKey];
          this.extra.params = this.uploadParams;
          this.extra.rst = rst;
          this.$emit('success', resp, this.extra);
        })
        .catch(err => {
          console.error(err);
          !this.error && this.$emit('fail', err, this.tips);
        });
    }
  }
};
</script>
<style lang="scss">
.image-uploader {
  .preview-button {
    margin-right: 20px;
    height: 30px;
    border: 1px solid #ccc;
  }
  .preview-pop {
    width: 100%;
    height: 561px;
    display: table;
    text-align: center;
    background-color: transparent;
    .img-area {
      display: table-cell;
      vertical-align: middle;
      h1 {
        color: white;
        padding: 10px;
        position: absolute;
        top: 0;
        width: 100%;
      }
      img {
        width: 100%;
      }
      .mint-swipe {
        height: 80%;
        .mint-swipe-indicators {
          .mint-swipe-indicator {
            opacity: 0.6;
          }
        }
      }
    }
  }
  .red {
    font-size: 25px;
    color: red;
    margin-top: 3px;
  }
}
</style>
