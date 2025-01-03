<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header fixed-header">
        <GlobalHeader />
      </a-layout-header>

      <a-layout>
        <!-- 固定侧边栏 -->
        <a-layout-sider
          class="sider fixed-sider"
          width="200"
          breakpoint="lg"
          collapsed-width="0"
        >
          <GlobalSider />
        </a-layout-sider>
        <a-layout-content class="content">
          <router-view />
        </a-layout-content>
      </a-layout>

      <a-layout-footer class="footer">
        <a href="https://gaoziman.github.io/toLeoJavaer/" target="_blank">
          编程学习 by 程序员Leo
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalSider from '@/components/GlobalSider.vue'
</script>

<style scoped>
#basicLayout .footer {
  background: #efefef;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
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
  z-index: 1000;
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
  margin: 64px 0 0 200px; /* 顶部和左侧分别留出 header 和 sider 的空间 */
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px); /* 减去 header 的高度 */
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
