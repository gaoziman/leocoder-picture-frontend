<template>
  <div id="homePage">
    <header class="header">
      <img class="logo" src="../assets/logo2.png" alt="Leo哥云图库" />
      <h1>欢迎来到Leo智存协作云图库</h1>
      <p class="subtitle">打造专业的云端资源管理平台，轻松存储、分享与协作，让每一张图片创造更高价值！</p>
    </header>
    <main class="main-content">
      <div class="content feature">
        <h2>🌟 主要功能</h2>
        <ul>
          <li>🔍 快速搜索：快速定位知识点和资源。</li>
          <li>📁 云图库：随时随地访问你的项目资源。</li>
          <li>📘 学习资料：提供高效的学习资源和工具。</li>
          <li>🚀 项目指南：一站式的学习与项目实践方案。</li>
        </ul>
      </div>
      <div class="content benefits">
        <h2>🎯 平台亮点</h2>
        <div class="benefit-list">
          <div class="benefit-item">
            <h3>🌐 高效协作</h3>
            <p>团队成员可以快速协作，分享和管理资源。</p>
          </div>
          <div class="benefit-item">
            <h3>💾 数据安全</h3>
            <p>通过加密技术保护您的数据免受外部威胁。</p>
          </div>
          <div class="benefit-item">
            <h3>📈 高效提升</h3>
            <p>随时随地学习资源，帮助你提升技能，完成目标。</p>
          </div>
        </div>
      </div>
      <div class="cta">
        <p>赶快加入 Leo哥云图库，开启你的知识探索之旅！</p>
        <!--        <router-link to="/user/login">-->
        <!--          <button class="start-button">立即登录</button>-->
        <!--        </router-link>-->
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// 页面逻辑不需要修改，专注于展示
</script>

<style scoped>
/* 页面基础样式 */
#homePage {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: Arial, sans-serif;
}

/* 头部样式 */
.header {
  text-align: center;
  padding: 20px;
  background-color: #f0f4ff;
}

.logo {
  width: 120px;
  margin-bottom: 16px;
}

.subtitle {
  color: #555;
  font-size: 16px;
  margin-top: 8px;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffffff, #e6f7ff);
}

.content {
  max-width: 800px;
  margin-bottom: 40px;
}

.feature ul {
  list-style: none;
  padding: 0;
}

.feature li {
  margin: 10px 0;
  font-size: 16px;
  color: #666;
}

/* 亮点部分 */
.benefits {
  text-align: center;
}

.benefit-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.benefit-item {
  max-width: 200px;
  margin: 10px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.benefit-item h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.benefit-item p {
  font-size: 14px;
  color: #555;
}

/* CTA 区域 */
.cta {
  text-align: center;
  margin-top: 20px;
}

.start-button {
  background-color: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.start-button:hover {
  background-color: #0056b3;
}

/* 页脚 */
.footer {
  text-align: center;
  padding: 10px;
  background-color: #f0f4ff;
  color: #888;
  font-size: 14px;
}
</style>
