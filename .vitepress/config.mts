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
          { text: '函数式弹窗', link: '/summarize/s1' },
          { text: '模拟登录浏览器插件', link: '/summarize/s2' },
          { text: '本地项目管理工具', link: '/summarize/s3' },
          { text: '组件化设计思想有深入理解', link: '/summarize/s4' },
          { text: 'Vite与Webpack性能构建', link: '/summarize/s5' },
          { text: '前端工程化实践经验', link: '/summarize/s6' },
          { text: 'git', link: '/summarize/s7' },
        ]
      }
    ],


  }
})
