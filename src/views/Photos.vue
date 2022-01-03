<template>
  <div class="about">
    <q-uploader :factory="uploader" multiple dark style="width: 100%" />
  </div>
</template>


<script>
import { defineComponent } from 'vue'
import { getPicList, createPic, deletePic } from '@/api/pics'
import { onMounted, ref } from '@vue/runtime-core'
// import Uploader from '@/utils/dropzone'

export default defineComponent({
  setup() {
    const isDev = process.env.NODE_ENV === 'development'
    const token = ref(sessionStorage.token)
    function usePicList() {
      getPicList().then(res => {
        console.log(res)
      })
    }
    function uploader(files) {
      // returning a Promise
      return new Promise(resolve => {
        var image = files[0] //获取文件域中选中的图片
        var reader = new FileReader() //实例化文件读取对象
        reader.readAsDataURL(image) //将文件读取为 DataURL,也就是base64编码
        reader.onload = function(ev) {
          //文件读取成功完成时触发
          var dataURL = ev.target.result.split(',')[1] //获得文件读取成功后的DataURL,也就是base64编码
          console.log(encodeURIComponent(dataURL.slice(0, 12)))
          resolve({
            url: isDev ? 'http://localhost:3000/pics/create' : '/pics/create',
            formFields: [
              {
                name: 'name',
                value: 'pic' + Date.now() + '.' + image.name.split('.').reverse()[0]
              },
              { name: 'content', value: dataURL },
              { name: 'message', value: 'upload img' }
            ],
            headers: [
              // { name: 'Content-Type', value: 'application/json' },
              { name: 'token', value: sessionStorage.token || 'powerfultoken' },
              { name: 'githubtoken', value: sessionStorage.githubToken },
              { name: 'accept', value: 'application/vnd.github.v3+json' }
            ]
          })
        }
        // simulating a delay of 2 seconds
      })
    }
    onMounted(() => {
      usePicList()
    })
    return {
      uploader,
      token
    }
  }
})
</script>

<style scoped>
</style>

