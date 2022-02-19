<template>
  <div class="photo-wrap">
    <q-uploader :factory="uploader" multiple dark style="width: 100%" @start="startUpload" @finish="completeUpload" />
    <div style="position: relative">
      <div class="photo-list-wrap">
        <div v-for="photoDate in picArr" :key="photoDate">
          <div class="date-with-line">
            <span class="date">{{ photoDate }}</span>
          </div>
          <div class="pic-items-wrap">
            <div v-for="(photo, j) in tmpPics[photoDate]" class="pic-item-wrap" :key="photo.sha">
              <span class="material-icons delete-btn" @click.stop="uesDeletePic(photo, photoDate, j)"> delete </span>
              <div class="pic-item-click-wrap" @click.stop="showPics(photoDate, j)">
                <q-img :src="photo.download_url" class="pic-item">
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-dark text-white">
                      <div class="loading-msg"></div>
                    </div>
                  </template>
                </q-img>
              </div>

              <!-- <img :src="photo.download_url" class="pic-item" /> -->
            </div>
          </div>
          <div v-if="isShowMore(photoDate)" class="refresh-btn" @click="getAnotherPics(photoDate)">
            <span class="material-icons"> more_horiz </span>
          </div>
        </div>
      </div>
      <div class="text-center">
        <span v-if="!noRefresh" class="material-icons refresh-btn" @click="usePicList"> refresh </span>
      </div>
      <div v-if="uploading" class="loading-mask">
        <q-spinner-puff color="white" size="128px" />
      </div>
    </div>
    <!-- <img :src="testImg" alt="" style="width: 80px" /> -->

    <q-dialog v-model="showImg" full-width full-height class="pic_banner">
      <q-card style="height: 100%" dark class="bg-transparent no-shadow card_pos">
        <q-card-section class="item-center" style="text-align: center">
          <div style="position: fixed; right: 23px; top: 10px; z-index: 20">
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
          <q-carousel
            v-model="currentPic"
            arrows
            height="100vh"
            infinite
            class="bg-transparent"
            @before-transition="switchBanner"
          >
            <q-img
              v-for="(pic, i) in currentPics"
              :key="pic.sha"
              :name="i"
              class="cal_img-item"
              fit="contain"
              loading="lazy"
              :src="pic.download_url"
            >
              <template v-slot:loading>
                <div
                  v-if="tmpPics[currentDay][i]"
                  :src="pic.download_url"
                  class="bgImg_wrap"
                  :style="{ backgroundImage: 'url(\'' + miniPhotos[currentDay][i].download_url + '\')' }"
                />
                <q-spinner-gears style="position: absolute" color="white" />
              </template>
            </q-img>
            <!-- <img
              v-for="(pic, i) in currentPics"
              :key="pic.sha"
              :src="pic.download_url"
              :name="i"
              class="cal_img-item"
              :alt="pic.path"
            /> -->

            <!-- <q-img
              v-for="(pic, i) in currentPics"
              :key="i"
              :name="i"
              class="cal_img-item"
              fit="contain"
              loading="lazy"
              src="https://scpic.chinaz.net/files/pic/pic9/202003/zzpic23859.jpg"
            > 
              <template v-slot:loading>
                <q-spinner-gears color="white" />
              </template>
            </q-img>
            -->

            <!-- <q-carousel-slide v-for="(pic, i) in currentPics" :key="i" :name="i" :img-src="pic.download_url" /> -->
          </q-carousel>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>


<script>
import { defineComponent } from 'vue'
import { getPicList, createPic, deletePic, createMiniPic, getMiniPicList, getPicItem, deleteMiniPic } from '@/api/pics'
import { computed, onMounted, reactive, ref } from '@vue/runtime-core'
import moment from 'moment'
import Compressor from '@/utils/compressor.js'
import { useQuasar } from 'quasar'
// import Uploader from '@/utils/dropzone'

export default defineComponent({
  setup() {
    const $q = useQuasar()
    const isDev = process.env.NODE_ENV === 'development'
    const noRefresh = ref(false)
    const token = ref(sessionStorage.token)
    const miniPhotos = reactive({})
    const tmpPics = reactive({})
    const currentDay = ref('')
    const folders = reactive([])
    const picDateIndex = ref(0)
    const showImg = ref(false)
    const currentPics = reactive([])
    const uploading = ref(false)
    const testImg = ref('')
    const timer = ref('')
    const picArr = computed(() => {
      return Object.keys(miniPhotos)
        .sort()
        .reverse()
    })
    let uploadImgLength = 0
    const currentPic = ref(0)
    function todaysPics(Date) {
      getMiniPicList({
        path: '/' + moment(Date).format('YYYY_MM_DD')
      }).then(res => {
        const oldLength = miniPhotos[moment(Date).format('YYYY_MM_DD')]?.length || 0
        miniPhotos[moment(Date).format('YYYY_MM_DD')] || (miniPhotos[moment(Date).format('YYYY_MM_DD')] = [])
        tmpPics[moment(Date).format('YYYY_MM_DD')] || (tmpPics[moment(Date).format('YYYY_MM_DD')] = [])
        if (res.length) {
          miniPhotos[moment(Date).format('YYYY_MM_DD')].unshift(
            ...(res
              ?.sort((a, b) => a.name > b.name)
              .reverse()
              .slice(0, res.length - oldLength) || [])
          )
          tmpPics[moment(Date).format('YYYY_MM_DD')].unshift(
            ...miniPhotos[moment(Date).format('YYYY_MM_DD')].slice(0, uploadImgLength)
          )
        }
        uploadImgLength = 0
      })
    }
    const isShowMore = computed(() => {
      return photoDate => miniPhotos[photoDate]?.length > tmpPics[photoDate]?.length
    })
    function usePicList(i) {
      typeof i === 'number' || (i = picDateIndex.value)
      getMiniPicList({
        path: '/' + folders[i].path
      }).then(pics => {
        miniPhotos[folders[i].name] || (miniPhotos[folders[i].name] = [])
        if (pics.length) {
          miniPhotos[folders[i].name] = pics?.sort((a, b) => a.name > b.name).reverse() || []
          tmpPics[folders[i].name] = miniPhotos[folders[i].name].slice(0, 10)
        }
      })
      picDateIndex.value++
      noRefresh.value = picDateIndex.value > folders.length - 1
    }
    function getPicFolders() {
      getPicList({
        path: ''
      }).then(res => {
        folders.splice(0, folders.length, ...res.reverse())
        for (let i = 0; i < 1; i++) {
          usePicList(i)
        }
      })
    }
    function showPics(date, index) {
      currentPics.splice(0, currentPics.length, ...miniPhotos[date].map(pic => Object.assign({ mini: true }, pic)))
      currentPic.value = index
      currentDay.value = date
      showImg.value = true
      queryOriginPic(index)
    }
    async function queryOriginPic(index) {
      console.log(currentPics, index, currentPics[index].mini)
      if (!currentPics[index].mini) {
        const { status } = await fetch(currentPics[index].download_url, { methos: 'GET' })
        if (status === 200) return
        getPicItem({ path: currentPics[index].path }).then(res => {
          console.log(index)
          currentPics[index] = res
          currentPics[index].mini = false
          clearTimeout(timer.value)
          timer.value = null
        })
      } else {
        getPicItem({ path: currentPics[index].path }).then(res => {
          currentPics[index] = res
          currentPics[index].mini = false
          clearTimeout(timer.value)
          timer.value = null
        })
      }
    }
    function switchBanner(val, old) {
      currentPic.value = val
      clearTimeout(timer.value)
      timer.value = setTimeout(() => {
        queryOriginPic(val)
      }, 400)
    }
    function getAnotherPics(date) {
      getMiniPicList({
        path: '/' + date
      }).then(pics => {
        miniPhotos[date].splice(
          tmpPics[date].length,
          10,
          ...(pics
            ?.sort((a, b) => a.name > b.name)
            .reverse()
            .slice(tmpPics[date].length, tmpPics[date].length + 10) || [])
        )
        tmpPics[date].push(...miniPhotos[date].slice(tmpPics[date].length, tmpPics[date].length + 10))
      })
    }
    // function usePicList() {
    //   currentDay.value -= 24 * 60 * 60 * 1000
    //   todaysPics(currentDay.value)
    // }

    async function uesDeletePic(photo, date, ind) {
      console.log(photo.path)
      const item = await getPicItem({ path: photo.path })
      deleteMiniPic({
        path: photo.path ? '/' + photo.path : '',
        sha: photo.sha,
        message: 'delete Mini img'
      }).then(res => {
        if (res.content === null) {
          $q.notify({
            message: '删除成功',
            color: 'info'
          })
          if (date) {
            tmpPics[date].splice(ind, 1)
            getMiniPicList({
              path: '/' + date
            }).then(pics => {
              miniPhotos[date] = pics?.sort((a, b) => a.name > b.name).reverse() || []
            })
          }
        } else {
          $q.notify({
            message: '删除失败',
            color: 'error'
          })
        }
      })
      deletePic({
        path: item.path ? '/' + item.path : '',
        sha: item.sha,
        message: 'delete img'
      })
    }
    function useCompressor(file, option) {
      return new Promise(res => {
        new Compressor(
          file,
          Object.assign(
            {
              success(result) {
                console.log(result)
                res(result)
              },
              error(err) {
                console.log(err.message)
              }
            },
            option
          )
        )
      })
    }
    function uploader(files) {
      // returning a Promise
      return new Promise(async resolve => {
        uploadImgLength++
        var image = files[0] //获取文件域中选中的图片
        let properImage = {}
        let miniImg = {}
        if (image.size > 400 * 1024 && !image.type.match('gif')) {
          const quality =
            (600 * 1024) / image.size > 1
              ? +((600 * 1024) / image.size / 2).toFixed(1)
              : +((600 * 1024) / image.size).toFixed(1)
          properImage = await useCompressor(image, { quality: quality })
        } else {
          properImage = image
        }
        miniImg = await useCompressor(image, { quality: 0.1, width: 500 })
        var reader = new FileReader() //实例化文件读取对象
        var readermini = new FileReader() //实例化文件读取对象
        readermini.readAsDataURL(miniImg) //将文件读取为 DataURL,也就是base64编码
        const par = {
          name: 'pic' + Date.now() + String(Math.random()).slice(4, 7) + '.' + image.name.split('.').reverse()[0],
          path: moment().format('YYYY_MM_DD')
        }
        readermini.onload = async function(ev) {
          var dataURL = ev.target.result.split(',')[1] //获得文件读取成功后的DataURL,也就是base64编码
          testImg.value = ev.target.result
          await createMiniPic({
            path: '/' + par.path + '/',
            name: par.name,
            content: dataURL,
            message: 'create mini img'
          })
          reader.readAsDataURL(properImage) //将文件读取为 DataURL,也就是base64编码
        }
        reader.onload = function(ev) {
          //文件读取成功完成时触发
          var dataURL = ev.target.result.split(',')[1] //获得文件读取成功后的DataURL,也就是base64编码
          // resolve({
          //   url: 'https://baidu.com'
          // })

          resolve({
            url: isDev ? 'http://localhost:3000/pics/create' : '/pics/create',
            formFields: [
              {
                name: 'name',
                value: par.name
              },
              {
                name: 'path',
                value: '/' + par.path + '/'
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
    function startUpload() {
      uploading.value = true
    }
    function completeUpload() {
      uploading.value = false
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
      startUpload,
      completeUpload,
      showPics,
      getAnotherPics,
      switchBanner,
      testImg,
      currentDay,
      isShowMore,
      tmpPics,
      miniPhotos,
      uploading,
      picArr,
      token,
      noRefresh,
      showImg,
      currentPics,
      currentPic
    }
  }
})
</script>

<style lang="scss" scoped>
.loading-mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-mask::after {
  content: '';
  position: absolute;
  width: 100%;
  background-color: rgba(200, 200, 200, 0.2);
  height: 100%;
  filter: blur(24px);
}
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
    flex-wrap: wrap;
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
  width: 80px;
  height: 80px;
  background-color: #f5f5f5;
  margin: 10px;
  text-align: center;
  white-space: pre-line;
  word-break: break-all;
}
.pic-item-click-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.pic-item {
  max-width: 100%;
  max-height: 100%;
}

.cal_img-item {
  text-align: center;
  max-height: 100vh;
  max-width: 100vw;
}
.bgImg_wrap {
  width: 100%;
  height: 100%;
  background: center / contain no-repeat;
}

.refresh-btn,
.delete-btn {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #bbb;
}
.refresh-btn:hover {
  color: #0c80e4;
  cursor: pointer;
  background-color: #bbb;
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

