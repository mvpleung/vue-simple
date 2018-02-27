/**Created by delonakc@gmail.com 省市区选择*/
<template>
  <transition name="city-picker-transition">
    <div class="city-picker-container"
      @click="handleWrapper"
      v-show="visible">
      <transition @after-enter="afterEnterAnimation"
        @before-leave="beforeLeaveAnimation"
        name="citypicker-slide">
        <div class="wrapper"
          :style="wrapperHeight"
          v-show="visible">
          <div class="head">
            所在行业
            <!-- <span class="close" @click="close">X</span> -->
          </div>
          <div class="con">
            <div class="tab">
              <span @click="handleTabs(0)"
                :class="curTab === 0 ? 'tabCur' : ''">
                {{ getSelected(0).name || '请选择' }}
              </span>
              <span @click="handleTabs(1)"
                v-show="showTab(1)"
                :class="curTab === 1 ? 'tabCur' : ''">
                {{ getSelected(1).name || '请选择' }}
              </span>
              <span @click="handleTabs(2)"
                v-show="showTab(2)"
                :class="curTab === 2 ? 'tabCur' : ''">
                {{ getSelected(2).name || '请选择' }}
              </span>
            </div>
            <div class="tab-con">
              <div class="area"
                v-show="curTab === 0">
                <span v-for="value in arrays[0]"
                  :key="value.code"
                  @click="handlerClick(value)"
                  :class="getSelected(0, value).select ? 'selected' : ''">
                  {{ value.name }}
                </span>
              </div>
              <div class="area"
                v-show="curTab === 1">
                <span v-for="value in arrays[1]"
                  :key="value.code"
                  @click="handlerClick(value)"
                  :class="getSelected(1, value).select ? 'selected' : ''">
                  {{ value.name }}
                </span>
              </div>
              <div class="area"
                v-show="curTab === 2">
                <span v-for="value in arrays[2]"
                  :key="value.code"
                  @click="handlerClick(value)"
                  :class="getSelected(2, value).select ? 'selected' : ''">
                  {{ value.name }}
                </span>
              </div>
            </div>
            <div class="spinner-area"
              v-show="showLoading">
              <span class="mint-indicator-spin">
                <div class="mint-spinner-triple-bounce">
                  <div class="mint-spinner-triple-bounce-bounce1 spinner-bc"/>
                  <div class="mint-spinner-triple-bounce-bounce2 spinner-bc"/>
                  <div class="mint-spinner-triple-bounce-bounce3 spinner-bc"/>
                </div>
              </span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'city-picker',
  props: {
    default: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      selected: [],
      curTab: 0, //当前选中
      wrapperHeight: {},
      arrays: []
    };
  },
  watch: {
    visible(val) {
      if (val === false) {
        this.$emit('cancel');
      } else {
        this.setDefaultData(this.default);
      }
    }
  },
  computed: {
    showLoading() {
      return this.loading && this.visible;
    }
  },
  created() {
    this.getArrays();
  },
  methods: {
    open() {
      this.selected = [];
      this.visible = true;
      this.default.length === 0 &&
        (this.arrays.length === 0 || !this.arrays[0]) &&
        this.getArrays();
    },
    close() {
      this.selected = [];
      this.curTab = 0;
      this.visible = false;
      this.loading = false;
      this.$emit('cancel');
    },
    /**
     * 获取数据列表
     */
    getArrays(parentCode, callback) {
      this.loading = true;
      this.axios({
        url: '/commonService/getPcregion.do',
        silence: true,
        method: 'post',
        data: {
          parentCode: parentCode || ''
        }
      })
        .then(resp => {
          this.loading = false;
          if (Array.isArray(resp.data)) {
            if (resp.data.length > 0) {
              let item = resp.data[0];
              this.arrays[
                item.code.match(/^\d{2}0000$/) ?
                  0 :
                  item.parentCode.match(/^\d{2}0000$/) ? 1 : 2
              ] =
                resp.data;
            } else {
              this.arrays[this.curTab + 1] = [];
            }
          } else {
            this.arrays[this.curTab + 1] = [];
          }
          callback && callback(parentCode);
        })
        .catch(err => {
          console.error(err);
          this.loading = false;
        });
    },
    /**
     * 点击蒙板关闭
     */
    handleWrapper(e) {
      if (e.target.className === 'city-picker-container') {
        this.close();
      }
    },
    /**
     * 处理点击
     */
    handlerClick(item) {
      if (this.showLoading) return;
      this.selected[this.curTab] = this.selected[this.curTab] || {};
      if (this.selected[this.curTab].code !== item.code) {
        //避免重复点击
        for (let i = this.curTab + 1; i < 3; i++) {
          this.selected[i] = null;
        }
        let tempArray = this.arrays[this.curTab + 1];
        if (
          tempArray &&
          tempArray.length > 0 &&
          tempArray[0].parentCode === item.code
        ) {
          //存在缓存数据，直接赋值
          this.changeTab(item, this.curTab + 1);
        } else {
          this.getArrays(item.code, () => {
            this.changeTab(item, this.curTab + 1);
          });
        }
      } else {
        this.changeTab(item, this.curTab + 1);
      }
    },
    /**
     * 切换Tab
     */
    changeTab(item, index) {
      this.selected[this.curTab] = item;
      // 设置当前tab
      if (this.arrays[index] && this.arrays[index].length > 0) {
        this.curTab = index;
      } else {
        this.finish();
      }
    },
    /**
     * 获取选择项
     */
    getSelected(index, value) {
      let select = this.selected[index] || {};
      if (value) {
        select.select = value.code === select.code;
        select.select === true && (select.name = value.name);
      }
      return select;
    },
    /**
     * 显示Tab
     */
    showTab(index) {
      return (
        this.arrays[index] &&
        this.arrays[index].length > 0 &&
        this.selected[index - 1]
      );
    },
    /**
     * 设置Tab
     */
    handleTabs(index) {
      this.curTab = index;
    },
    /**
     * 选择完成
     */
    finish() {
      if (this.selected.length > 0) {
        let tempSelect = [].concat(this.selected);
        this.close();
        this.$emit('pick', tempSelect);
      }
    },
    /**
     * 设置默认值
     */
    setDefaultData(data) {
      if (!(data && Array.isArray(data) && data.length > 0)) return;
      let curTab = 0,
        validData = true;
      data.forEach((item, i) => {
        if (!validData || !item) {
          validData = false;
          return;
        }
        this.selected[i] = {
          code: item
        };
        let array = this.arrays[i],
          hasData = false;
        if (array && Array.isArray(array)) {
          for (let i = 0; i < array.length; i++) {
            if (array[i].code === item) {
              hasData = true;
              break;
            }
          }
        }

        if (hasData) {
          //存在缓存数据
          curTab = i;
        } else {
          this.getArrays(data[i - 1], parentCode => {
            this.curTab = i; //处理异步回调
          });
        }
      });
      this.curTab = curTab;
      !validData &&
        (this.arrays.length === 0 || !this.arrays[0]) &&
        this.getArrays();
      return true;
    },
    afterEnterAnimation() {
      this.wrapperHeight = {
        height: '60%'
      };
    },
    beforeLeaveAnimation() {
      this.wrapperHeight = {};
    }
  }
};
</script>

<style lang="scss" scoped>
.city-picker-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  z-index: 999;
  .wrapper {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-size: 14px;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    .head {
      flex: 0 0 41px;
      height: 41px;
      line-height: 41px;
      text-align: center;
      border-bottom: 1px solid #e3e3e3;
      .close {
        float: right;
        color: #ccc;
        display: inline-block;
        padding: 0 10px;
      }
    }
    .con {
      flex: 1 1 100%;
      width: 100%;
      position: relative;
      .tab {
        width: 100%;
        height: 31px;
        line-height: 31px;
        padding: 0 5px;
        border-bottom: 1px solid #e3e3e3;
        position: relative;
        z-index: 10;
        white-space: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        span {
          display: inline-block;
          padding: 0 5px;
          line-height: 30px;
          margin-right: 10px;
        }
        .tabCur {
          color: #ff3131; // border-bottom: 2px solid #ff3131;
        }
      }
      .tab-con {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        padding-top: 31px;
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
      }
      .area {
        width: 100%;
        height: 100%;
        padding: 0 10px 10px 10px;
        box-sizing: border-box;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        span {
          display: block;
          line-height: 30px;
        }
        .selected {
          color: #ff3131;
          &:after {
            // font-family: 'iconfont';
            content: '';
            margin-left: 4px;
            font-size: 12px;
            display: inline-block;
            width: 8px;
            height: 14px;
            border-right: 1px solid #ff3131;
            border-bottom: 1px solid #ff3131;
            transform: rotate(45deg); // position: relative;
            // top: 1px;
          }
        }
      }
      .spinner-area {
        width: 100%;
        text-align: center;
        height: 100%;
        line-height: 15rem;
        .spinner-bc {
          width: 10.6667px;
          height: 10.6667px;
          background-color: rgb(177, 175, 175);
        }
      }
    }
  }
}
</style>

<style class="scss">
.city-picker-transition-enter-active,
.city-picker-transition-leave-active {
  transition: opacity 0.3s linear;
}

.city-picker-transition-enter,
.city-picker-transition-leave-to {
  opacity: 0;
}

.citypicker-slide-enter-active,
.citypicker-slide-leave-active {
  height: 60%;
  transition: all 0.3s linear;
}

.citypicker-slide-enter,
.citypicker-slide-leave-to {
  height: 0%;
}
</style>
