import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "interview-notes",
  description: "interview-notes",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
    ],

    sidebar: [
      {
        text: '问题描述',
        items: [
          { text: '函数式弹窗', link: '/总结/函数式弹窗.md' },
          { text: '模拟登录浏览器插件', link: '/总结/模拟登录浏览器插件' },
          { text: '本地项目管理工具', link: '/总结/本地项目管理工具' },
          { text: '组件化设计思想有深入理解', link: '/总结/组件化设计思想有深入理解' },
          { text: 'Vite与Webpack性能优化构建加速', link: '/总结/Vite与Webpack性能优化构建加速' },
          { text: '前端工程化实践经验', link: '/总结/前端工程化实践经验' },
        ]
      }
    ],


  }
})
