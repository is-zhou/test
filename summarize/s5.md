# vite

## 默认开启的 TreeShaking

只支持 esm 语法模式（编译时就能确认依赖关系），require (cjs) 语法不支持（运行时才能确认依赖关系）

```ts
import { x, y } from "z";
x();
//这里从z中导入了 x 和 y 但是只使用了x 哪末打包的时候就只会打包 x 相关代码 ，不会打包 y
```

## 动态导入与懒加载

比如路由组件里面的动态导入 `()=>import('../views/**.vue')` 就会单独形成一个包文件。以减少主包的文件大小

## 打包分析

使用 `rollup-plugin-visualizer` 插件来生成依赖体积报告,配置完打包后项目根目录下会多一个 stats.html 的文件，打开就能可视化的分析 bundle 尺寸，进行分析然后看下一步的优化策略

```ts
import { defineConfig } from "vite";
import { visualizer } from 'rollup-plugin-visualizer'
export default defineConfig({
  plugins: [
    visualizer();
  ],
});
```

## 打包压缩

使用`vite-plugin-compression`插件来压缩代码

```ts
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: "gzip", //压缩算法
      ext: ".gz", // 压缩文件的文件扩展名
      threshold: 10240, // 仅压缩大于10KB的文件
      deleteOriginFile: false, // 是否保留原始文件
      compressionOptions: {
        level: 9, //压缩等级 (1-9)
      },
      filter: /\.(js|css|json|html|ico|svg)$/i, // 要压缩的文件类型
    }),
  ],
});
```

还需要服务器配合使用比如 nginx 配置

```
http:{
    // 开启或关闭gzip模块 on | off
    gzip_static on;
    // gzip 压缩比 1 压缩比最小处理速度越快，9压缩比最大但处理最慢（传输快但比较消耗cpu）
    gzip_comp_level 2;
};
```

## 配置打包后删除打印语句和 debugger 语句

```ts
import { defineConfig } from "vite";
export default defineConfig({
  esBuild: {
    drop: ["console", "debugger"], //删除console和debugger
  },
});
```

## 依赖预构建

Vite 在 dev 时会对部分 node_modules 做 esbuild 预构建以加速模块加载，但如果依赖是运行时才被发现就会触发二次预构建，导致打开页面时卡顿。我的做法是先通过日志定位具体包，把它们放到 optimizeDeps.include 中让 Vite 在启动阶段就预构建，必要时把超大可选库改为按需或 CDN 引入；对 monorepo 我会配合 resolve.dedupe 与清理 .vite 缓存来避免重复实例化或缓存失效。最终 cold start 从 ~40s 降到 ~15–20s，且消除了页面打开时的二次预构建。

optimizeDeps.include：强制把指定包在启动时预先包含到预构建列表（即在 dev server 启动前就处理）。适用于那些 Vite 无法静态发现但会被动态 import 或由插件引入的依赖。

optimizeDeps.exclude：从预构建中排除指定包（Vite 将不会对其做预构建并会按原始方式由浏览器/服务器处理）。适用于那些预构建会失败或不兼容转换（有些 CJS 包在预构建时会问题）。

```ts
import { defineConfig } from "vite";
export default defineConfig({
  optimizeDeps: {
    include: ["lodash-es", "dayjs"],
    exclude: ["@my/custom-lib"],
  },
});
```

## 手动分包

手动分包后再次打包没有改动的代码的分包文件指纹是不会变的，只会改变对应改动过代码的 chunk 包，便于资源缓存

```ts
import { defineConfig } from "vite";
export default defineConfig({
  build: {
    rollupOptions: {
      //“自动合并过小的 chunk”，达到一个平衡点：分包够细，又不碎,减少资源请求
      experimentalMinChunkSize: 20 * 1024, // 20kb
      //手动分包 id其实是资源路径，返回的字符串就是包的名称，也可以写成对象形式 manualChunks:{'axios':['axios']}
      manualChunks(id) {
        if (id.includes("node_modules")) {
          return id
            .toString()
            .split("node_modules/")[1]
            .split("/")[0]
            .toString();
        }
      },
    },
  },
});
```

## 构建优化与性能加速实战

在大型前端项目中遇到构建速度慢与打包体积过大的问题，首次冷启动需近 40 秒、打包产物达 12MB，严重影响开发体验与上线效率。
针对问题进行逐步定位与优化：

依赖扫描耗时过长：通过分析 vite --debug 日志，发现部分第三方依赖（如 element-plus、echarts）被频繁重新构建。
👉 采用 Vite 依赖预构建优化（optimizeDeps.include/exclude），并利用缓存目录 (cacheDir) 加速二次启动，启动时间从 40s 降至约 18s。

打包体积过大：使用 rollup-plugin-visualizer 与 webpack-bundle-analyzer 分析依赖构成，发现公共库与业务代码混杂。
👉 手动配置 rollup manualChunks / Webpack SplitChunksPlugin，将基础库（Vue、Pinia、Axios）拆分为独立 vendor 包，同时启用 Tree Shaking + 按需引入，打包体积减少约 35%。

构建压缩耗时过长：针对生产环境压缩阶段，使用 TerserPlugin 多进程并行压缩 与 ESBuild 替代 Babel 压缩，构建时间缩短约 50%。

首屏加载慢：分析 network 面板后发现初始包过大。
👉 实施 路由懒加载 与 组件动态导入，并将体积较大的可选依赖（Monaco Editor、ECharts）迁移至 CDN 加载，首屏加载体积从 3.8MB 降至 1.9MB。

最终实现：
✅ 本地开发冷启动时间缩短约 55%；
✅ 构建产物总体积减少约 40%；
✅ 首屏加载速度显著提升，性能指标达到核心 Web Vitals 要求。

这些优化方案在团队内形成了一套可复用的构建优化模板，后续项目能快速复用 Vite/Webpack 的最佳实践配置，显著提升交付效率与性能一致性。
