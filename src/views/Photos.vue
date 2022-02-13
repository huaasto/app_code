<template>
  <div class="photo-wrap">
    <q-uploader :factory="uploader" multiple dark style="width: 100%" @finish="completeUpload" />
    <div class="photo-list-wrap">
      <div v-for="(photoDate, i) in picArr" :key="i">
        <div class="date-with-line">
          <span class="date">{{ photoDate }}</span>
        </div>
        <div class="pic-items-wrap">
          <div v-for="(photo, j) in photos[photoDate]" class="pic-item-wrap" :key="photo.sha">
            <span class="material-icons delete-btn" @click="uesDeletePic(photo, photoDate)"> delete </span>
            <q-img :src="photo.download_url" class="pic-item" @click="showPics(photos[photoDate], j)">
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-dark text-white">
                  <div class="loading-msg"></div>
                </div>
              </template>
            </q-img>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center">
      <span v-if="!noRefresh" class="material-icons refresh-btn" @click="usePicList"> refresh </span>
    </div>
    <q-dialog v-model="showImg" full-width full-height class="pic_banner">
      <q-card style="height: 100%" dark class="bg-transparent no-shadow card_pos">
        <q-card-section class="item-center" style="text-align: center">
          <div style="position: fixed; right: 23px; top: 10px; z-index: 20">
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
          <q-carousel v-model="currentPic" animated arrows height="100vh" infinite class="bg-transparent">
            <q-img
              v-for="(pic, i) in currentPics"
              :key="i"
              :name="i"
              class="cal_img-item"
              fit="contain"
              loading="lazy"
              :src="pic.download_url"
            >
              <!-- <q-img
              v-for="(pic, i) in currentPics"
              :key="i"
              :name="i"
              class="cal_img-item"
              fit="contain"
              loading="lazy"
              src="https://scpic.chinaz.net/files/pic/pic9/202003/zzpic23859.jpg"
            > -->
              <template v-slot:loading>
                <q-spinner-gears color="white" />
              </template>
            </q-img>

            <!-- <q-carousel-slide v-for="(pic, i) in currentPics" :key="i" :name="i" :img-src="pic.download_url" /> -->
          </q-carousel>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>


<script>
import { defineComponent } from 'vue'
import { getPicList, createPic, deletePic } from '@/api/pics'
import { computed, onMounted, reactive, ref } from '@vue/runtime-core'
import moment from 'moment'
import { useQuasar } from 'quasar'
// import Uploader from '@/utils/dropzone'

export default defineComponent({
  setup() {
    const $q = useQuasar()
    const isDev = process.env.NODE_ENV === 'development'
    const noRefresh = ref(false)
    const token = ref(sessionStorage.token)
    const photos = reactive({})
    const currentDay = ref(Date.now())
    const folders = reactive([])
    const picDateIndex = ref(0)
    const showImg = ref(false)
    const currentPics = reactive([])
    const picArr = computed(() => {
      return Object.keys(photos)
        .sort()
        .reverse()
    })
    const currentPic = ref(0)
    function todaysPics(Date) {
      getPicList({
        path: '/' + moment(Date).format('YYYY_MM_DD')
      }).then(res => {
        res.length ? (photos[moment(Date).format('YYYY_MM_DD')] = res) : (noRefresh.value = true)
      })
    }
    function usePicList(i) {
      typeof i === 'number' || (i = picDateIndex.value)
      console.log(i)
      getPicList({
        path: '/' + folders[i].path
      }).then(pics => {
        pics.length && (photos[folders[i].name] = pics)
      })
      picDateIndex.value++
      noRefresh.value = picDateIndex.value > folders.length - 1
    }
    function getPicFolders() {
      getPicList({
        path: ''
      }).then(res => {
        folders.splice(0, folders.length, ...res.reverse())
        console.log(folders)
        for (let i = 0; i < 3; i++) {
          usePicList(i)
        }
      })
    }
    function showPics(pics, index) {
      currentPics.splice(0, currentPics.length, ...pics)
      currentPic.value = index
      showImg.value = true
    }
    // function usePicList() {
    //   currentDay.value -= 24 * 60 * 60 * 1000
    //   todaysPics(currentDay.value)
    // }

    function uesDeletePic(photo, date) {
      console.log(photo.path)
      deletePic({
        path: photo.path ? '/' + photo.path : '',
        sha: photo.sha,
        message: 'delete img'
      }).then(res => {
        if (res.content === null) {
          $q.notify({
            message: '删除成功',
            color: 'info'
          })
        }
        date && todaysPics(date.replace(/_/g, '-'))
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
                value: 'pic' + Date.now() + String(Math.random()).slice(4, 7) + '.' + image.name.split('.').reverse()[0]
              },
              {
                name: 'path',
                value: '/' + moment().format('YYYY_MM_DD') + '/'
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
    function completeUpload() {
      todaysPics(Date.now())
    }
    onMounted(() => {
      // todaysPics()
      // for (let i = 0; i < 3; i++) {
      //   usePicList()
      // }
      getPicFolders()
    })
    return {
      uploader,
      usePicList,
      uesDeletePic,
      completeUpload,
      showPics,
      picArr,
      token,
      photos,
      noRefresh,
      showImg,
      currentPics,
      currentPic
    }
  }
})
</script>

<style lang="scss" scoped>
.photo-wrap {
  padding: 10px;
}

.photo-list-wrap {
  margin: 10px auto;
}

.date-with-line {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #ddd;
  line-height: 1.5;
}

.date-with-line .date {
  margin: 0 20px;
}
.photo-wrap {
  ::v-deep .q-uploader__list {
    display: flex;
  }
  ::v-deep .q-uploader__file {
    max-width: 160px;
    min-width: unset;
    margin: 10px;
  }
}

.date-with-line::after {
  content: '';
  height: 1px;
  background-color: #ddd;
  flex: 1;
}

.pic-items-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.pic-item-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 80px;
  height: 80px;
  background-color: #f5f5f5;
  margin: 10px;
  text-align: center;
  white-space: pre-line;
  word-break: break-all;
}

.pic-item {
  max-width: 80px;
  max-height: 80px;
}

.cal_img-item {
  text-align: center;
  max-height: 100vh;
  max-width: 100vw;
}

.refresh-btn,
.delete-btn {
  font-size: 24px;
  font-weight: bold;
  color: #bbb;
}

.material-icons:hover {
  color: #0c80e4;
  cursor: pointer;
}

.delete-btn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: -1;
}

.pic-item-wrap:hover .delete-btn {
  z-index: 10;
}

.loading-msg {
  width: 80px;
  height: 80px;
  border: 24px solid #b5b5b5;
  border-bottom: none;
  border-radius: 50%;
  margin: 20px auto;
  animation: rotate 1.2s infinite linear;
}

.card_pos {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  50% {
    transform: rotate(180deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.pic_banner .q-card__section {
  padding: 0;
}
</style>

