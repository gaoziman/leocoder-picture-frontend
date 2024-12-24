<template>
  <div id="app">
    <ConfigProvider :locale="locale">
      <BasicLayout />
    </ConfigProvider>
  </div>
</template>

<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

const locale = zhCN; // 设置为中文
</script>
