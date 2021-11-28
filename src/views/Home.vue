<template>
  <div class="home">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <div class="recode-wrap">
      <div class="todoitem-creater-wrap">
        <q-input v-model="text" filled type="textarea" />
        <q-btn class="creater-btn" @click="confirm = true">save</q-btn>
      </div>

      <ul class="record-list">
        <li v-for="(todoItem, ind) in todoList" :key="todoItem.id" class="recode-item">
          <div v-if="todoItem.loading">
            <div class="loading-msg"></div>
          </div>
          <div v-else>
            <span class="edit-todoitem">
              <q-btn icon="edit" @click="editer(todoItem, ind)" />
              <q-btn v-show="!todoItem.locked" icon="locked" @click="cleaner(todoItem, ind, todoItem.locked)" />
              <q-btn v-show="todoItem.locked" icon="lock_open" @click="cleaner(todoItem, ind, todoItem.locked)" />
            </span>
            <h5>
              {{ todoItem.title }}
              <q-badge v-show="todoItem.locked" align="middle">已完成</q-badge>
              <q-badge v-show="!todoItem.locked" class="bg-positive" align="middle">待办</q-badge>
            </h5>
            <div class="item-content">{{ todoItem.body }}</div>
            <small>创建时间: {{ new Date(todoItem.created_at) }}</small>
            <br />
            <small>最后一次更新于: {{ new Date(todoItem.updated_at) }}</small>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Confirm</div>
      </q-card-section>
      <q-card-section class="row items-center">
        <q-input outlined v-model="title" label="title" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup @click="cancelAddToDoItem" />
        <q-btn label="Sure" color="primary" v-close-popup @click="confirmCreateToDoItem" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="clear" persistent>
    <q-card>
      <q-card-section>
        <div v-if="isLocked" class="text-h6">是否转为待办</div>
        <div v-else class="text-h6">是否已完成</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup @click="cancelDelToDoItem" />
        <q-btn label="Sure" color="primary" v-close-popup @click="confirmTransLockToDoItem" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="edit" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Edit</div>
      </q-card-section>
      <q-card-section class="row items-center">
        <div>
          <q-input v-model="e_title" filled label="title" /><br />
          <q-input v-model="e_text" filled type="textarea" />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup @click="cancelEditToDoItem" />
        <q-btn label="Sure" color="primary" v-close-popup @click="confirmEditToDoItem" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { getToDoList, createToDoItem, editToDoItem, lockToDoItem, unlockToDoItem } from '@/api/todo'
import { reactive, ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
const todoSys = () => {
  const text = ref('')
  const title = ref('')
  const e_text = ref('')
  const e_title = ref('')
  const edit_id = ref(-1)
  const confirm = ref(false)
  const edit = ref(false)
  const clear = ref(false)
  const isLocked = ref(false)
  const todoList = reactive([
    { id: 1, loading: true },
    { id: 2, loading: true },
    { id: 3, loading: true },
    { id: 4, loading: true },
    { id: 5, loading: true }
  ])
  function queryTodoList() {
    getToDoList().then(data => {
      // if (data.code === 404)
      // return $q.notify({
      //   message: data.msg,
      //   color: 'red'
      // })
      todoList.splice(0, todoList.length, ...data)
    })
  }
  function cancelAddToDoItem() {
    title.value = ''
  }
  function confirmCreateToDoItem() {
    createToDoItem({
      title: title.value || Date.now(),
      body: text.value
    }).then(data => {
      if (!data.id) return
      todoList.unshift(data)
      text.value = ''
      cancelAddToDoItem()
    })
  }
  function editer(item, ind) {
    e_title.value = item.title
    e_text.value = item.body
    edit.value = true
    edit_id.value = item.number + ',' + ind
  }

  function cancelEditToDoItem() {
    e_title.value = ''
    e_text.value = ''
    edit_id.value = -1
  }
  function confirmEditToDoItem() {
    editToDoItem({
      number: edit_id.value.split(',')[0],
      par: {
        title: e_title.value,
        body: e_text.value
      }
    }).then(data => {
      // todoList[edit_id.value.split(',')[1]] = data
      cancelEditToDoItem()
    })
  }
  function cleaner(item, ind, locked) {
    clear.value = true
    edit_id.value = item.number + ',' + ind
    isLocked.value = locked
  }
  function cancelDelToDoItem() {
    edit_id.value = -1
  }
  function confirmTransLockToDoItem() {
    if (isLocked.value) {
      unlockToDoItem({
        number: edit_id.value.split(',')[0]
      }).then(data => {
        // if (data.code)
        //   return $q.notify({
        //     message: data.msg,
        //     color: 'red'
        //   })
        todoList[edit_id.value.split(',')[1]].locked = false
        cancelDelToDoItem()
      })
    } else {
      lockToDoItem({
        number: edit_id.value.split(',')[0]
      }).then(() => {
        todoList[edit_id.value.split(',')[1]].locked = true
        cancelDelToDoItem()
      })
    }
  }
  onMounted(() => {
    queryTodoList()
  })
  return {
    title,
    text,
    e_title,
    e_text,
    confirm,
    edit,
    isLocked,
    clear,
    todoList,
    cancelAddToDoItem,
    confirmCreateToDoItem,
    editer,
    cancelEditToDoItem,
    confirmEditToDoItem,
    cleaner,
    cancelDelToDoItem,
    confirmTransLockToDoItem
  }
}
export default {
  name: 'Home',
  components: {
    // HelloWorld
  },
  setup() {
    return {
      ...todoSys()
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  height: 100%;
  // position: fixed;
  // top: 0;
  // bottom: 0;
  // left: 0;
  // right: 0;
  // padding: 70px 20px 20px 320px;
}
.recode-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}
.todoitem-creater-wrap {
  position: relative;
  width: 100%;
  .creater-btn {
    position: absolute;
    bottom: 16px;
    right: 16px;
  }
}
.record-list {
  flex: 1 1 100%;
  width: 100%;
  max-width: 800px;
  overflow: auto;
}
.recode-item {
  position: relative;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  background-color: #f5f5f5;
  .edit-todoitem {
    position: absolute;
    top: 10px;
    right: 24px;
  }
  .item-content {
    white-space: pre-wrap;
  }
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
</style>
