## Fileupload 文件上传

用于上传文件：图片、excel等，可以对其进行封装实现图片上传功能等。

### 基础用法

:::demo 具体请看[vue-upload-component](https://github.com/lian-yue/vue-upload-component/)

```html
    <d-upload action="//jsonplaceholder.typicode.com/posts/">
        <d-button>上传文件</d-button>
    </d-upload>
```
:::

### 多文件上传

:::demo

```html
    <d-upload action="//jsonplaceholder.typicode.com/posts/"
    multiple
    >
        <d-button>上传文件</d-button>
    </d-upload>
```
:::
