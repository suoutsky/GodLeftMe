<template>
  <div v-show="visible" class="d-alert">
    <i v-show="closable" class="iconhandle close" @click="close">&#xe609;</i>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'd-alert',

  props: {
    closable: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: true,
      twoWay: true
    },
    type: {
      type: String,
      default: 'info'
    }
  },
  data() {
    return {
      visible: this.show
    };
  },
  methods: {
    close() {
      this.visible = false;
      this.$emit('update:show', false);
      this.$emit('close');
    }
  }
};
</script>

<style lang="less">
.d-alert {
  border: 1px solid #d2f0f0;
  line-height: 1.5;
  background: #f6fdfd;
  position: relative;
  padding: 6px 30px 6px 15px;
  box-sizing: border-box;
  font-size: 14px;

  .close {
    position: absolute;
    right: 10px;
    cursor: pointer;
    font-size: 12px;
    color: #d8d8d8;

    &:hover {
      color: #444;
    }
  }

  a {
    color: #29b6b0;
    text-decoration: underline;
  }
}
</style>
