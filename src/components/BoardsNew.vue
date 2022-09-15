<template>
  <transition>
    <div v-if="showDialogStore.dialogVisible" class="modal"
      @click.self="hideDialog">
      <div class="modal-content">
        <form @submit.prevent="handleSubmit">
          <input 
            type="text"  
            placeholder="ah...  what now?" 
            required
            v-model="title" 
            @keyup.enter="handleSubmit" 
            ref="taskInput">
          <button>Execute order!</button>
        </form>
      </div>
    </div>
  </transition>
  <div class="task-manager">
    <div class="unsorted">
      <div class="unsorted-content">
        <transition-group name="unsorted">
          <div 
            class="new-task" 
            v-for="task in boards[0].tasks" 
            :key="task.id"
            draggable="true"
            @dragstart="onDragStart($event, boards[0], task)"
            @dragend="onDragEnd($event)"
            >
            <h3>{{ task.title }}</h3>
          </div>
        </transition-group>

      </div>
    </div>
  </div>
  <div class="boards-wrapper">
    <div class=" drop-zone"
      v-for="board in boards.filter(el => boards.indexOf(el) > 0)"
      :key="board.id" 
      @dragover.prevent
      @drop.self="dropTaskHandler($event, board)"
      >
      <h3>{{ board.title }}  <span>{{ board.tasks.length }}</span> </h3>
      <div 
        class="drag-el" 
        v-for="task in board.tasks" 
        :key="task.id"
        @dblclick="deleteTask(task, board)"
        @dragstart="onDragStart($event, board, task)"
        @dragend="onDragEnd($event)" draggable="true"
        @drop.prevent="onDrop($event, board, task)"
        @dragover.self.prevent="onDragOver($event)"
        @dragleave="onDragLeave($event)">
        <div>{{ task.title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useShowDialogStore, useAuthStore } from '@/stores'
import { ref, watch, onMounted, watchEffect } from 'vue'

const authStore = useAuthStore()
const showDialogStore = useShowDialogStore()
const title = ref('')

const boards = ref([
  { id: 1, title: 'unsorted', tasks: [] },
  { id: 2, title: 'On hold', tasks: [] },
  { id: 3, title: 'Ongoing', tasks: [] },
  { id: 4, title: 'Done', tasks: [] },
  { id: 5, title: 'Approved', tasks: [] }
])

const hideDialog = () => {
  showDialogStore.hideDialog()
  title.value = ''
}

const handleSubmit = () => {
  showDialogStore.hideDialog()
  const newTask = {
    title: title.value,
    author: authStore.user.firstName,
    id: Date.now()
  }
    if (newTask.title) {
      boards.value[0].tasks.push(newTask)
    }
  title.value = ''
}

const deleteTask = (task, board) => {
  const deleteIndex = board.tasks.indexOf(task)
  board.tasks.splice(deleteIndex, 1)
}

const currentTask = ref(null)
const currentBoard = ref(null)
const taskInput = ref(null)

watchEffect(() => {
  if (taskInput.value) {
    taskInput.value.focus()
  }
})

onMounted(() => {
  if (localStorage.getItem('boards')) {
    try {
      boards.value = JSON.parse(localStorage.getItem('boards'))
    } catch (e) {
      console.log(e.message);
    }
  }
})

watch(
  boards,
  boards => localStorage.setItem('boards', JSON.stringify(boards)),
  { deep: true }
)

const onDragStart = (e, board, task) => {
  currentTask.value = task
  currentBoard.value = board
  setTimeout(() => { e.target.style.display = 'none' }, 0)
}

const onDrop = (e, board, task) => {
  e.target.style.boxShadow = 'none'

  const currentIndex = currentBoard.value.tasks.indexOf(currentTask.value)
  currentBoard.value.tasks.splice(currentIndex, 1)

  const dropIndex = board.tasks.indexOf(task)
  board.tasks.splice(dropIndex + 1, 0, currentTask.value)
}

const dropTaskHandler = (e, board) => {
  board.tasks.push(currentTask.value)
  const currentIndex = currentBoard.value.tasks.indexOf(currentTask.value)
  currentBoard.value.tasks.splice(currentIndex, 1)
}

const onDragOver = (e) => {
  e.preventDefault()
  if (e.target.className = 'drag-el') e.target.style.boxShadow = '0 4px 3px gray'
}

const onDragLeave = (e) => e.target.style.boxShadow = 'none'

const onDragEnd = (e) => {
  e.target.style.boxShadow = 'none'
  setTimeout(() => { e.target.style.display = 'inline-flex' }, 0)
}


</script>

<style>
.v-enter-active {
  transition: all 0.3s ease-out;
}

.v-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.v-enter-from {
  opacity: 0;
}
.v-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.unsorted-enter-active {
  transition: all 0.5s ease;
}

.unsorted-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.unsorted-leave-active {
  position: absolute;
}
</style>