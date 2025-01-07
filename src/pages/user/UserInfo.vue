<template>
  <div class="profile-page">
    <!-- 背景区域 -->
    <div class="profile-background"></div>
    <!-- 主要内容区域 -->
    <a-card class="profile-card" :bordered="false">
      <div class="profile-header">
        <h2>个人中心</h2>
        <p>完善个人信息，让大家更好地认识你</p>
      </div>

      <!-- Tab区域 -->
      <a-tabs v-model:activeKey="activeTab" centered>
        <!-- 基本信息 Tab -->
        <a-tab-pane key="1" tab="基本信息">
          <a-form :model="formState" layout="vertical" class="profile-form">
            <!-- 头像上传 -->
            <a-form-item class="avatar-upload">
              <a-upload
                list-type="picture-card"
                :show-upload-list="false"
                :custom-request="handleUpload"
                :before-upload="beforeUpload"
                @change="handleAvatarChange"
              >
                <img
                  v-if="formState.userAvatar"
                  :src="formState.userAvatar"
                  alt="avatar"
                  class="avatar"
                />
                <div v-else>
                  <plus-outlined />
                  <div style="margin-top: 8px">上传头像</div>
                </div>
              </a-upload>
            </a-form-item>

            <!-- 用户信息 -->
            <a-form-item label="用户名">
              <a-input v-model:value="formState.userName" placeholder="请输入用户名" />
            </a-form-item>
            <a-form-item label="个人简介">
              <a-textarea
                v-model:value="formState.userProfile"
                rows="4"
                placeholder="请输入个人简介"
              />
            </a-form-item>

            <!-- 保存按钮 -->
            <div class="form-actions">
              <a-button type="primary" @click="handleSubmit">保存修改</a-button>
            </div>
          </a-form>
        </a-tab-pane>

        <!-- 修改密码 Tab -->
        <a-tab-pane key="2" tab="修改密码">
          <a-form
            :model="passwordState"
            layout="vertical"
            class="password-form"
            :rules="passwordRules"
            ref="passwordFormRef"
          >
            <a-form-item label="旧密码" name="oldPassword">
              <a-input-password
                v-model:value="passwordState.oldPassword"
                placeholder="请输入原始密码"
              />
            </a-form-item>
            <a-form-item label="新密码" name="newPassword">
              <a-input-password
                v-model:value="passwordState.newPassword"
                placeholder="请输入新密码"
              />
            </a-form-item>
            <a-form-item label="确认密码" name="checkPassword">
              <a-input-password
                v-model:value="passwordState.checkPassword"
                placeholder="请确认新密码"
              />
            </a-form-item>

            <!-- 保存按钮 -->
            <div class="form-actions">
              <a-button type="primary" @click="handleChangePassword">修改密码</a-button>
            </div>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { type UploadProps } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/user'
import { uploadFileUsingPost } from '@/api/wenjianshangchuan.ts'
import { updateUserInfoUsingPost, updateUserPasswordUsingPost } from '@/api/dengluguanli.ts'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'

const router = useRouter()
const loginUserStore = useLoginUserStore()

const activeTab = ref('1') // Tab 默认选中

const passwordFormRef = ref()

// 表单校验规则
const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原始密码！', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码！', trigger: 'blur' },
    { min: 8, message: '新密码不能少于8个字符！', trigger: 'blur' },
  ],
  checkPassword: [
    { required: true, message: '请确认新密码！', trigger: 'blur' },
    { min: 8, message: '确认密码不能少于8个字符！', trigger: 'blur' },
  ],
}

// 表单状态 - 基本信息
const formState = reactive({
  userAvatar: '', // 用户头像地址
  userName: '', // 用户名
  userProfile: '', // 个人简介
})

// 修改密码表单状态
const passwordState = reactive({
  oldPassword: '', // 原始密码
  newPassword: '', // 新密码
  checkPassword: '', // 确认密码
})

//初始化信息
onMounted(() => {
  initInfo()
})

// 头像上传处理
const handleAvatarChange = (info: any) => {
  if (info.file.status === 'done') {
    formState.avatarUrl = info.file.response.url
    Message.success('头像上传成功！')
  } else if (info.file.status === 'error') {
    Message.error('头像上传失败，请重试！')
  }
}

// 保存基本信息
const handleSubmit = async () => {
  const data = {
    userAvatar: formState.userAvatar,
    userName: formState.userName,
    userProfile: formState.userProfile,
  }
  const res = await updateUserInfoUsingPost(data)
  if (res.data.code === 200 && res.data.data) {
    Message.success('信息修改成功')
    loginUserStore.fetchLoginUser()
  } else {
    Message.error('信息修改失败，' + res.data.message)
  }
}

// 修改密码
const handleChangePassword = () => {
  passwordFormRef.value
    .validate() // 校验表单
    .then(async () => {
      const data = {
        oldPassword: passwordState.oldPassword,
        newPassword: passwordState.newPassword,
        checkPassword: passwordState.checkPassword,
      }

      try {
        const res = await updateUserPasswordUsingPost(data)

        // 检查返回值，确保 code 和 data 存在
        if (res?.data?.code === 200 && res?.data?.data) {
          Message.success('密码修改成功')
          router.push('/user/login') // 跳转到登录页面
        } else {
          Message.error(res?.data?.message || '未知错误')
        }
      } catch (error) {
        console.error('接口调用失败:', error)
        Message.error('系统错误，密码修改失败！')
      }
    })
    .catch((error) => {
      console.log('校验失败:', error)
      Message.error('请检查输入内容是否正确！')
    })
}

// 初始化信息
const initInfo = () => {
  formState.userName = loginUserStore.loginUser.userName
  formState.userProfile = loginUserStore.loginUser.userProfile
  formState.userAvatar = loginUserStore.loginUser.userAvatar
}

// 上传文件之前的校验
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  // 定义支持上传的图片格式类型数组
  const supportedTypes = [
    'image/jpeg', // jpeg格式
    'image/jpg', // jpg格式（部分浏览器可能识别成jpeg，兼容写上）
    'image/png', // png格式
    'image/webp', // webp格式
    'image/heic', // heic格式（需浏览器或前端处理支持）
  ]

  // 检查文件类型是否在支持列表中
  const isSupportedType = supportedTypes.includes(file.type)
  if (!isSupportedType) {
    Message.error('不支持上传该格式的图片，推荐 jpg、jpeg、png、webp、heic 格式')
  }

  // 校验图片大小
  const isLt4M = file.size / 1024 / 1024 < 4
  if (!isLt4M) {
    Message.error('不能上传超过 4M 的图片')
  }

  return isSupportedType && isLt4M
}
const loading = ref<boolean>(false)

// 上传文件
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    const res = await uploadFileUsingPost({}, file)
    if (res.data.code === 200 && res.data.data) {
      Message.success('图片上传成功')
      formState.userAvatar = res.data.data
    } else {
      Message.error('图片上传失败，' + res.data.message)
    }
  } catch (error) {
    Message.error('图片上传失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-page {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 920px;
  background-color: #f0f2f5;
  position: relative;
}

.profile-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  border-bottom-left-radius: 50% 20%;
  border-bottom-right-radius: 50% 20%;
  z-index: 0;
}

.profile-card {
  position: relative;
  width: 100%;
  max-width: 800px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  z-index: 1;
  padding: 24px;
}

.profile-header {
  text-align: center;
  margin-bottom: 20px;
}

.profile-header h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.profile-header p {
  color: #888;
  font-size: 14px;
}

.avatar-upload {
  text-align: center;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-actions {
  text-align: center;
  margin-top: 20px;
}

.form-actions button {
  width: 150px;
}
</style>
