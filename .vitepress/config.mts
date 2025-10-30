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
          { text: '函数式弹窗', link: '/summarize/函数式弹窗.md' },
          { text: '模拟登录浏览器插件', link: '/summarize/模拟登录浏览器插件' },
          { text: '本地项目管理工具', link: '/summarize/本地项目管理工具' },
          { text: '组件化设计思想有深入理解', link: '/summarize/组件化设计思想有深入理解' },
          { text: 'Vite与Webpack性能优化构建加速', link: '/summarize/Vite与Webpack性能优化构建加速' },
          { text: '前端工程化实践经验', link: '/summarize/前端工程化实践经验' },
        ]
      }
    ],


  }
})
