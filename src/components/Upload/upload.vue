<template>
    <div :class="[prefixCls]">
        <div
            :class="classes"
            @click="handleClick"
            @drop.prevent="onDrop"
            @dragover.prevent="dragOver = true"
            @dragleave.prevent="dragOver = false">
            <input
                ref="input"
                type="file"
                :class="[prefixCls + '-input']"
                @change="handleChange"
                :multiple="multiple"
                :accept="accept">
            <slot></slot>
        </div>
        <slot name="tip"></slot>
        <upload-list
            v-if="showUploadList"
            :files="fileList"
            @on-file-remove="handleRemove"
            @on-file-preview="handlePreview"></upload-list>
    </div>
</template>
<script>
import uploadList from './upload-list.vue';
import ajax from './ajax';
import { oneOf } from '../../utils/assist';
import Emitter from '../../mixins/emitter';

const prefixCls = 'd-upload';

export default {
  name: 'd-upload',
  mixins: [ Emitter ],
  components: { uploadList },
  props: {
    action: {
      type: String,
      required: true
    },
    headers: {
      type: Object,
      default() {
        return {};
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    name: {
      type: String,
      default: 'file'
    },
    withCredentials: {
      type: Boolean,
      default: false
    },
    showUploadList: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      validator(value) {
        return oneOf(value, ['select', 'drag']);
      },
      default: 'select'
    },
    format: {
      type: Array,
      default() {
        return [];
      }
    },
    accept: {
      type: String
    },
    maxSize: {
      type: Number
    },
    beforeUpload: Function,
    onProgress: {
      type: Function,
      default() {
        return {};
      }
    },
    onSuccess: {
      type: Function,
      default() {
        return {};
      }
    },
    onError: {
      type: Function,
      default() {
        return {};
      }
    },
    onRemove: {
      type: Function,
      default() {
        return {};
      }
    },
    onPreview: {
      type: Function,
      default() {
        return {};
      }
    },
    onExceededSize: {
      type: Function,
      default() {
        return {};
      }
    },
    onFormatError: {
      type: Function,
      default() {
        return {};
      }
    },
    defaultFileList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      dragOver: false,
      fileList: [],
      tempIndex: 1
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-select`]: this.type === 'select',
          [`${prefixCls}-drag`]: this.type === 'drag',
          [`${prefixCls}-dragOver`]: this.type === 'drag' && this.dragOver
        }
      ];
    }

  },
  methods: {
    handleClick() {
      this.$refs.input.click();
    },
    handleChange(e) {
      console.log(e);
      const files = e.target.files;

      if (!files) {
        return;
      }
      this.uploadFiles(files);
      this.$refs.input.value = null;
    },
    onDrop(e) {
      this.dragOver = false;
      this.uploadFiles(e.dataTransfer.files);
    },
    uploadFiles(files) {
      let postFiles = Array.prototype.slice.call(files);
      if (!this.multiple) postFiles = postFiles.slice(0, 1);

      if (postFiles.length === 0) return;

      postFiles.forEach(file => {
        this.upload(file);
      });
    },
    upload(file) {
      if (!this.beforeUpload) {
        return this.post(file);
      }

      const before = this.beforeUpload(file);
      if (before && before.then) {
        before.then(processedFile => {
          if (Object.prototype.toString.call(processedFile) === '[object File]') {
            this.post(processedFile);
          } else {
            this.post(file);
          }
        }, () => {
          // this.$emit('cancel', file);
        });
      } else if (before !== false) {
        this.post(file);
      } else {
        // this.$emit('cancel', file);
      }
    },
    post(file) {
      // check format
      if (this.format.length) {
        const fileFormat = file.name.split('.').pop().toLocaleLowerCase();
        const checked = this.format.some(item => item.toLocaleLowerCase() === fileFormat);
        if (!checked) {
          this.onFormatError(file, this.fileList);
          return false;
        }
      }

      // check maxSize
      if (this.maxSize) {
        if (file.size > this.maxSize * 1024) {
          this.onExceededSize(file, this.fileList);
          return false;
        }
      }

      this.handleStart(file);
      let formData = new window.FormData();
      formData.append(this.name, file);

      ajax({
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: file,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: e => {
          this.handleProgress(e, file);
        },
        onSuccess: res => {
          this.handleSuccess(res, file);
        },
        onError: (err, response) => {
          this.handleError(err, response, file);
        }
      });
    },
    handleStart(file) {
      file.uid = Date.now() + this.tempIndex++;
      const _file = {
        status: 'uploading',
        name: file.name,
        size: file.size,
        percentage: 0,
        uid: file.uid,
        showProgress: true
      };

      this.fileList.push(_file);
    },
    getFile(file) {
      const fileList = this.fileList;
      let target;
      fileList.every(item => {
        target = file.uid === item.uid ? item : null;
        return !target;
      });
      return target;
    },
    handleProgress(e, file) {
      const _file = this.getFile(file);
      this.onProgress(e, _file, this.fileList);
      _file.percentage = e.percent || 0;
    },
    handleSuccess(res, file) {
      const _file = this.getFile(file);

      if (_file) {
        _file.status = 'finished';
        _file.response = res;

        this.dispatch('FormItem', 'on-form-change', _file);
        this.onSuccess(res, _file, this.fileList);

        setTimeout(() => {
          _file.showProgress = false;
        }, 1000);
      }
    },
    handleError(err, response, file) {
      const _file = this.getFile(file);
      const fileList = this.fileList;

      _file.status = 'fail';

      fileList.splice(fileList.indexOf(_file), 1);

      this.onError(err, response, file);
    },
    handleRemove(file) {
      const fileList = this.fileList;
      fileList.splice(fileList.indexOf(file), 1);
      this.onRemove(file, fileList);
    },
    handlePreview(file) {
      if (file.status === 'finished') {
        this.onPreview(file);
      }
    },
    clearFiles() {
      this.fileList = [];
    }
  },
  watch: {
    defaultFileList: {
      immediate: true,
      handler(fileList) {
        this.fileList = fileList.map(item => {
          item.status = 'finished';
          item.percentage = 100;
          item.uid = Date.now() + this.tempIndex++;
          return item;
        });
      }
    }
  }
};
</script>
<style lang="less">
@upload-prefix-cls: d-upload;

.@{upload-prefix-cls} {
    input[type="file"]{
        display: none;
    }
    &-input {
      display: none;
    }
    &-list{
        margin-top: 8px;

        &-file{
            padding: 4px;
            color: #444;
            border-radius: 4px;
            transition: background-color 0.2s ease-in-out;
            overflow: hidden;
            position: relative;

            & > span{
                cursor: pointer;
                transition: color 0.2 ease-in-out;
                i{
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    color: #444;
                    text-align: center;
                }
            }

            &:hover{
                background: #f3f3f3;
                & > span{
                    color: #2d8cf0;
                    i{
                        color: #444;
                    }
                }
                .@{upload-prefix-cls}-list-remove{
                    opacity: 1;
                }
            }
        }
        &-remove{
            opacity: 0;
            font-size: 18px;
            cursor: pointer;
            float: right;
            margin-right: 4px;
            color: #999;
            transition: all 0.2s ease;
            &:hover{
                color: #444;
            }
        }
    }

     &-select {
        display: inline-block;
    }
    
    &-drag{
        background: #fff;
        border: 1px dashed #dddee1;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: border-color 0.2s ease;

        &:hover{
            border: 1px dashed #2d8cf0;
        }
    }
    &-dragOver{
        border: 2px dashed #2d8cf0;
    }
}
</style>