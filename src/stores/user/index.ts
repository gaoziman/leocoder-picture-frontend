import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLoginUserUsingGet } from '@/api/dengluguanli.ts'

export const useLoginUserStore = defineStore(
  'loginUser',
  () => {
    const loginUser = ref<any>({
      userName: '未登录',
    })

    async function fetchLoginUser() {
      const res = await getLoginUserUsingGet()
      if (res.data.code === 200 && res.data.data) {
        loginUser.value = res.data.data
      }
    }

    function setLoginUser(newLoginUser: any) {
      loginUser.value = newLoginUser
    }

    return { loginUser, setLoginUser, fetchLoginUser }
  },
  {
    persist: {
      key: 'loginUser', // 存储在 localStorage 中的 key
      storage: window.localStorage, // 使用 localStorage 持久化
    },
  },
)
