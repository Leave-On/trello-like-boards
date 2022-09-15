<template>
  <div>
    <nav>
      <img src="#" alt="logo here">
      <div class="button" v-if="authStore.user">
        <div>Logged in as <span>{{user.firstName}}</span> </div>
        <button @click="showDialogStore.showDialog">Create new task</button>
        <button @click="authStore.logout()">Logout</button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useShowDialogStore } from '@/stores';
import { useAuthStore } from '@/stores';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore()
const showDialogStore = useShowDialogStore()
const { user } = storeToRefs(authStore)

</script>

