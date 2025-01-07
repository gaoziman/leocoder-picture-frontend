<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header fixed-header">
        <GlobalHeader />
      </a-layout-header>

      <a-layout>
        <!-- 固定侧边栏 -->
        <a-layout-sider
          v-if="!hideSider"
          class="sider fixed-sider"
          width="200"
          breakpoint="lg"
          collapsed-width="0"
        >
          <GlobalSider />
        </a-layout-sider>
        <a-layout-content :class="contentClass">
          <router-view />
        </a-layout-content>
      </a-layout>

      <!-- 动态显示的 footer -->
      <transition name="fade">
        <a-layout-footer v-if="showFooter" class="footer">
          <div class="footer-content">
            <div class="footer-links">
              <a
                href="https://juejin.cn/user/2467719176022094/posts"
                target="_blank"
                class="link-with-icon"
              >
                <icon-font type="icon-yonghu4" />
                站长：程序员Leo
              </a>

              <a href="https://leocoder.cn" target="_blank" class="link-with-icon">
                <icon-font type="icon-zhishiku" />
                知识库
              </a>
            </div>
            <div class="footer-meta">
              <span>© 2025 智云库</span>
              <span>|</span>
              <a href="https://beian.miit.gov.cn/" target="_blank">鄂ICP备2025089543号-1</a>
            </div>
          </div>
        </a-layout-footer>
      </transition>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalSider from '@/components/GlobalSider.vue'
import { UserOutlined, GlobalOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { createFromIconfontCN } from '@ant-design/icons-vue'
import { SCRIPT_URL } from '@/constants/url.ts'
import { useRoute } from 'vue-router'

const IconFont = createFromIconfontCN({
  scriptUrl: SCRIPT_URL,
})

// 是否隐藏侧边栏
const route = useRoute()
const hideSider = computed(() => route.meta.hideSider || false)

// 根据是否显示侧边栏动态设置内容区域样式
const contentClass = computed(() => (hideSider.value ? 'content no-sider' : 'content'))

// 控制 footer 显示的状态
const showFooter = ref(false)

// 滚动事件处理函数
const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  // 当滚动高度超过 200px 时显示 footer
  showFooter.value = scrollTop > 150
}

// 页面加载时监听滚动事件
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

// 页面卸载时移除滚动事件
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
#basicLayout .footer {
  background: #f0f2f5; /* 与主页背景颜色一致 */
  padding: 12px 16px; /* 调整内边距，减少高度 */
  text-align: center; /* 内容居中对齐 */
  border-top: 1px solid #d9d9d9; /* 添加顶部边框 */
  font-size: 14px; /* 调整字体大小 */
  color: #666; /* 字体颜色 */
  box-shadow: 0px -2px 5px rgba(0, 0, 0, 0.05); /* 更轻的顶部阴影 */
  position: fixed; /* 固定底部 */
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* 确保在最上层 */
}

.footer-content {
  display: flex;
  justify-content: space-between; /* 左右分布 */
  align-items: center; /* 垂直居中 */
  flex-wrap: wrap; /* 宽度不足时换行 */
  padding: 0 16px; /* 左右间距 */
}

.footer-links {
  display: flex;
  gap: 12px; /* 调整图标与文字的间距 */
  align-items: center; /* 垂直居中 */
}

.footer-meta {
  font-size: 14px;
  color: #999;
  line-height: 1.6; /* 调整高度一致 */
  display: flex;
  justify-content: center; /* 居中对齐 */
  gap: 8px; /* 增加左右元素间距 */
}

.link-with-icon {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #666;
  gap: 6px; /* 原来是 8px，改为 6px */
}

.link-with-icon:hover {
  color: #7d8185;
}

.footer-links span,
.footer-meta span {
  color: #666;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column; /* 垂直布局 */
    text-align: center;
    gap: 6px;
  }
}

#basicLayout .content {
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 28px;
  padding: 20px;
}

#basicLayout .header {
  padding-inline: 20px;
  margin-bottom: 16px;
  color: unset;
  background: white;
}

#basicLayout .header {
  margin-bottom: 1px;
}

#basicLayout .content {
  padding: 28px;
}

#basicLayout .sider {
  background: #fff;
  padding-top: 20px;
  border-right: 0.5px solid #eee;
}

#basicLayout :deep(.ant-menu-root) {
  border-bottom: none !important;
  border-inline-end: none !important;
}

/* 固定顶部样式 */
.fixed-header {
  position: fixed;
  z-index: 1400;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 固定侧边栏样式 */
.fixed-sider {
  position: fixed;
  z-index: 1000;
  top: 64px; /* 顶部高度 */
  bottom: 0;
  left: 0;
  background: #fff;
  border-right: 1px solid #eee;
}

/* 内容区域样式 */
.content {
  margin: 64px 0 0 200px; /* 默认情况下预留侧边栏宽度 */
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px); /* 减去 header 的高度 */
}

/* 当侧边栏隐藏时，内容区域占据全屏 */
.no-sider {
  margin: 64px 0 0 0; /* 取消左侧边距 */
}

/* 底部样式 */
.footer {
  background: #efefef;
  padding: 16px;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
