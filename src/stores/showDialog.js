import { defineStore } from 'pinia'

export const useShowDialogStore = defineStore({
  id: 'showDialog',
  state: () => {
    return {
      dialogVisible: false,
    }
  },
  actions: {
    showDialog() {
      this.dialogVisible = true
    },
    hideDialog() {
      this.dialogVisible = false
    }
  },
  getters: {
    isVisible: (state) => {
      return state.dialogVisible
    }
  }
})
