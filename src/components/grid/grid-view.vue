/*
 * 九宫格
 * @Date: 2018-02-01 15:27:31 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-27 11:08:19
 */
<template>
  <div class="weui-grids">
    <slot name="grid">
      <grid-item v-for="(item, key) in items"
        :key="key"
        :index="key"
        :label="item[labelKey]"
        :label-pattern="labelPattern"
        :sub-label="item[subLabelKey]"
        :sub-label-pattern="subLabelPattern"
        :item-click="gridItemClick"
        :icon="item[iconKey]"
        :link="item[linkKey]" />
    </slot>
  </div>
</template>
<script>
export default {
  name: 'grid-view',
  props: {
    /**
     * 列数
     */
    cols: Number,
    /**
     * 数据列表
     */
    items: {
      type: Array,
      default: () => []
    },
    /**
     * label 标签取值key
     */
    labelKey: {
      type: String,
      default: 'label'
    },
    /**
     * label 展示模式，支持 %s {0}  占位
     */
    labelPattern: {
      type: String
    },
    /**
     * subLabel 副标签取值key
     */
    subLabelKey: {
      type: String,
      default: 'subLabel'
    },
    /**
     * subLabel 展示模式，支持 %s {0}  占位
     */
    subLabelPattern: {
      type: String
    },
    /**
     * icon 标签取值key
     */
    iconKey: {
      type: String,
      default: 'icon'
    },
    /**
     * link 标签取值key
     */
    linkKey: {
      type: String,
      default: 'link'
    },
    /**
     * 子项点击
     */
    itemClick: {
      type: Function
    }
  },
  data() {
    return {
      childrenSize: 3
    };
  },
  computed: {
    /**
     * 列数
     * @returns {Number}
     */
    column() {
      return this.cols || this.childrenSize;
    },
    hasSlot() {
      return this.$slots.grid !== null;
    }
  },
  methods: {
    gridItemClick(index) {
      this.itemClick ?
        this.itemClick(this.items[index]) :
        this.$emit('item-click', this.items[index]);
    }
  },
  components: {
    'grid-item': this.hasSlot ? null : require('./grid-item')
  }
};
</script>
<style lang="scss">
.weui-grids {
  position: relative;
  overflow: hidden;
}
.weui-grids:before {
  content: ' ';
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.weui-grids:after {
  content: ' ';
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  bottom: 0;
  border-left: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleX(0.5);
  transform: scaleX(0.5);
}
</style>


