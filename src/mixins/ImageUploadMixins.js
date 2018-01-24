import fileupload from '../components/FileUpload';

export default {
  components: {
    fileupload
  },

  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: [Number, String],
      default: 'auto'
    },
    size: {
      type: Number,
      default: 1024 * 1024
    },
    extensions: {
      type: String,
      default: 'jpg,png,jpeg'
    },
    errorTip: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      errortip: this.errorTip
    };
  },
  computed: {
    accept: function() {
      let str = [];
      if (this.extensions.indexOf('jpg') !== -1) {
        str.push('image/jpg');
      }
      if (this.extensions.indexOf('jpeg') !== -1) {
        str.push('image/jpeg');
      }
      if (this.extensions.indexOf('png') !== -1) {
        str.push('image/png');
      }
      if (this.extensions.indexOf('gif') !== -1) {
        str.push('image/gif');
      }
      return str.join(',');
    }
  },

  // events: {
  //   addFileUpload: 'addFileUpload',
  //   afterFileUpload: 'afterFileUpload'
  // },

  methods: {
    addFileUpload: function(file, component) {
      console.log('afterFileUpload', file);
      this.errortip = '';
      let nameType = false;
      let extArray = this.extensions.split(',');
      extArray.forEach((item) => {
        if (file.name.indexOf(item) !== -1 && !nameType) {
          nameType = true;
        }
      });
      if (!nameType) {
        this.errortip = '上传的图片格式不符合要求';
        return;
      }

      if (file.size > this.size) {
        this.errortip = '图片大小超过上传大小';
        return;
      }
      if ((this.width && +file.width !== +this.width) || (this.height && this.height !== 'auto' && +file.height !== +this.height)) {
        this.errortip = '上传的图片尺寸不符合要求';
        return;
      }
      this.$emit('update:errorTip', this.errortip);
      // 设置component.active = true;
      console.log(this.$refs.fileupload);
      this.$refs.fileupload.active = true;
    }
  }
};
