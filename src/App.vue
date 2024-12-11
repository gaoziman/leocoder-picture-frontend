<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <BasicLayout />
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import locale from 'ant-design-vue/es/vc-picker/locale/zh_CN'

</script>
