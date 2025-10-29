```ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import legacy from "@vitejs/plugin-legacy";
import jhmConfig from "./jhm.config";
import AutoImport from "unplugin-auto-import/vite";
// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  let base = jhmConfig.publicPath;
  if (jhmConfig.isOpenCDN && command === "build") {
    cleanDist();
    base = "https://cdn.jiahuaming.com/web" + jhmConfig.publicPath;
  }

  return {
    base,
    plugins: [
      vue(),
      vueJsx(),
      Components({
        resolvers: [VantResolver()],
      }),
      legacy({
        targets: ["defaults", "not IE 11", "chrome 55"],
      }),
      AutoImport({
        imports: [
          "vue",
          "vue-router",
          {
            from: "jhm_api",
            imports: [
              {
                name: "Area",
                type: true,
              },
              {
                name: "GoodsDetails",
                type: true,
              },
              {
                name: "RechargeTypeDetails",
                type: true,
              },
              {
                name: "Procedure",
                type: true,
              },
              {
                name: "ActivityDetails",
                type: true,
              },
              {
                name: "ActivitySort",
                type: true,
              },
              {
                name: "Activity",
                type: true,
              },
            ],
          },
          {
            from: "@/stores/projectConfig",
            imports: ["useProjectConfigStore"],
          },
        ],
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
        ],
        dts: true,
        eslintrc: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      emptyOutDir: false,
    },
    server: {
      proxy: {
        "/apiv4": {
          target: "http://gdecard.jiahuaming.com",
          changeOrigin: true,
        },
        "/api": {
          target: "http://gdecard.jiahuaming.com",
          changeOrigin: true,
        },
      },
    },
  };
});

function cleanDist() {
  const path = require("path");
  const fs = require("fs");
  const rootPath = path.join(__dirname, "dist");

  const stat = fs.statSync(rootPath, { throwIfNoEntry: false });
  if (stat) {
    const list = fs.readdirSync(rootPath);
    for (const fileName of list) {
      if (![".svn"].includes(fileName)) {
        fs.rmSync(path.join(rootPath, fileName), { recursive: true });
      }
    }
  }
}
```
