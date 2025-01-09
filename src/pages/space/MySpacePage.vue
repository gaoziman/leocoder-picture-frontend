<template>
  <div id="mySpace">
    <p>正在跳转，请稍候...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/user'
import { listSpaceVoByPageUsingPost } from '@/api/kongjianguanli.ts'
import { Message } from '@arco-design/web-vue'

const router = useRouter()
const loginUserStore = useLoginUserStore()

// 在页面加载时检查用户空间
onMounted(() => {
  checkUserSpace()
})

// 检查用户是否有个人空间
const checkUserSpace = async () => {
  const loginUser = loginUserStore.loginUser
  if (!loginUser?.id) {
    router.replace('/user/login')
    return
  }
  // 获取用户空间信息
  const res = await listSpaceVoByPageUsingPost({
    userId: loginUser.id,
    pageNum: 1,
    pageSize: 1,
  })
  if (res.data.code === 200) {
    if (res.data.data?.records?.length > 0) {
      const space = res.data.data.records[0]
      router.replace(`/space/${space.id}`)
    } else {
      router.replace('/add_space')
      Message.warning('请先创建空间')
    }
  } else {
    Message.error('加载我的空间失败，' + res.data.message)
  }
}
</script>

<style scoped></style>
