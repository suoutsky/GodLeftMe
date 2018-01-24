<script>
    import MessageBox from 'src/components/MessageBox.js';
    export default {
        data () {
            return {
                defaultList: [
                    {
                        'name': 'a42bdcc1178e62b4694c830f028db5c0',
                        'url': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512728213457&di=8acfec44cf5de7f4577a0aee1241296f&imgtype=0&src=http%3A%2F%2Fimg.25pp.com%2Fuploadfile%2Fsoft%2Fimages%2F2014%2F0406%2F20140406111647880.jpg'
                    },
                    {
                        'name': 'bc7521e033abdd1e92222d733590f104',
                        'url': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512728213457&di=8acfec44cf5de7f4577a0aee1241296f&imgtype=0&src=http%3A%2F%2Fimg.25pp.com%2Fuploadfile%2Fsoft%2Fimages%2F2014%2F0406%2F20140406111647880.jpg'
                    }
                ],
                imgName: '',
                uploadList: []
            }
        },
        computed: {
//            uploadList () {
//                return this.$refs.upload ? this.$refs.upload.fileList : [];
//            }
        },
        watch: {

        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
//            console.log(this.$refs.upload.fileList)
        },
        methods: {
            handleRemove (file) {
                // 从 upload 实例删除数据
                console.log(file);
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {
                // 因为上传过程为实例，这里模拟添加 url
                file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
                file.name = '7eb99afb9d5f317c912f08b5212fd69a';
            },
            handleFormatError (file) {
                MessageBox({
                    title: '文件格式不正确',
                    type: 'error',
                    description: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
            },
            handleMaxSize (file) {
                MessageBox({
                    title: '超出文件大小限制',
                    type: 'message',
                    description: '文件 ' + file.name + '太大，不能超过 2M。'
                });
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < 5;
                if (!check) {
                  MessageBox({
                    title: '最多只能上传 5 张图片。'
                  });
                }
                return check;
            },
            handleProgress (s) {
              console.log(s)
            }
        }
    }
</script>
<style>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
        color: #fff;
        cursor: pointer;
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>

## ImageUpload 图片上传

用于图片上传。

### 基础用法

图片上传的用法。

:::demo
```html

<template>
    <div>
        <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover" @click="handleRemove(item)">
                    删除
                </div>
            </template>
            <template v-else>
                <d-progress v-if="item.showProgress" :percent="item.percentage" :status="'success'" hide-info></d-progress>
            </template>
        </div>
        <d-upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                @on-progress="handleProgress"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                action="//jsonplaceholder.typicode.com/posts/"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    +
                </div>
        </d-upload>
    </div>
</template>
```
:::
### ImageUpload Attributes

| 参数 | 说明 | 类型  | 可选值  | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| uploadUrl | 图片上传接口地址 | String | — | - |
| value | 上传的图片url | String | — | - |
| width | 上传的图片宽度 | Number | — | - |
| height | 上传的图片高度 | Number | — | - |
| size | 上传的图片大小（单位为：B） | Number | — | 1024 * 1024 |
| extensions | 允许上传的图片格式 | String | — | jpg,png,jpeg |
| errorTip | 错误提示 | String | — | - |


### MultiImageUpload Attributes

| 参数 | 说明 | 类型  | 可选值  | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| values | 上传的图片 | Array | — | - |
