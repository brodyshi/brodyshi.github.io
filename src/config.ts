export const config = {
  name: 'Brody Shi',
  author: 'Brody Shi',
  url: 'https://brodyshi.github.io',
  language: 'zh-CN',
  locale: 'zh_CN',
  timezone: 'Asia/Shanghai',
  github: 'https://github.com/brodyshi',
  nav: ['home', 'posts', 'tags', 'about'],
  pages: {
    home: {
      href: '/',
      title: '首页',
      description:
        '我是 Brody Shi，在这里记录我的学习过程、项目实践和对技术的思考。',
      greeting: '欢迎来到我的博客',
      about: '关于我',
      recentPosts: '最新文章',
      postLimit: 10,
      allPosts: '查看全部',
    },
    posts: {
      href: '/posts/',
      title: '归档',
      description: '按时间浏览全部文章。',
      postCount: (count: number) => `${count} 篇`,
    },
    post: {
      back: '全部文章',
      published: (date: string) => `发布于 ${date}`,
      updated: (date: string) => `更新于 ${date}`,
      tags: '文章标签',
      toc: '本页目录',
      pagination: '相邻文章',
      newer: '较新一篇',
      older: '较早一篇',
    },
    tags: {
      href: '/tags/',
      title: '标签',
      description: '按标签浏览相关文章。',
      empty: '文章发布后，标签会自动出现在这里。',
      back: '全部标签',
    },
    tag: (name: string) => ({
      title: `${name} · 标签`,
      description: `跟 ${name} 相关的文章。`,
    }),
    about: {
      href: '/about/',
      title: '关于',
      description: '我是 Brody Shi，一名正在探索 AI 的开发者。',
    },
    404: {
      title: '页面未找到',
      heading: '这页笔记还没有写下',
      message: '页面可能已移动，也可能是链接有误。',
      back: '回到首页',
    },
  },
  common: {
    emptyPosts: '作者太懒了，还没有文章。',
    readingTime: (minutes: number) => `${minutes} 分钟`,
    skipToContent: '跳转到正文',
  },
  header: {
    navigation: '主导航',
    switchTheme: '切换主题',
    switchThemeTo: (current: string, next: string) =>
      `当前主题为${current}，切换为${next}`,
    themeOptions: {
      system: '跟随系统',
      light: '浅色',
      dark: '深色',
    },
    github: (name: string) => `${name} 的 GitHub`,
    collapse: '收起导航',
    expand: '展开导航',
  },
  footer: {
    rss: 'RSS 订阅',
    github: 'GitHub',
  },
} as const;
