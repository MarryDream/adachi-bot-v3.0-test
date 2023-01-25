# v2 to v3

## feature

### 新的插件配置项

```ts
interface PluginSetting {
	pluginName: string;
	cfgList: cmd.ConfigType[];
	aliases?: string[];
	// 加个开关，dir 默认 views
	render?: {
		dirname?: string
	};
	server?: {
		routers?: Record<string, Router>
	};
	repo?: string | {
		owner: string;// 仓库拥有者名称
		repoName: string;// 仓库名称
		ref?: string;// 分支名称
	}; // 设置为非必须兼容低版本插件
}
```

### 公共 vue-router

前端渲染页已整合至一个公共 vite 项目，共享 vue-router 配置。通过 `PluginSetting.render.dirname` 指定插件渲染页面存放目录，框架将会从该目录下按一定的规则加载 route 配置。

加载规则：对于 `.vue` 文件，直接按文件名加载路由；对于目录，加载目录内的 `index.vue`，按目录名加载路由。加载的路由路径将以**插件名称**即 `PluginSetting.pluginName` 起始。

**示例**

存在如下目录结构：

```text
- test-plugin
  - views
    - main.vue
    - test
      - app.vue
      - index.vue
  - init.ts
```

test-plugin/init.ts：

```ts
export async function init( bot: BOT ): Promise<PluginSetting> {
    return {
        pluginName: "test-plugin",
        cfgList: [],
        render: {
            dirname: "views"
        }
    }
}
```

加载后的路由结果为：

```ts
[
    {
        path: "/test-plugin/main",
        component: () => import("#/test-plugin/views/main.vue")
    },
    {
        path: "/test-plugin/test",
        component: () => import("#/test-plugin/views/test/index.vue")
    }
]
```

> 仅指定目录下的第一级 .vue 文件与第一级文件中存在 index.vue 的目录进行加载，不会对不符合加载条件的文件/目录进行处理。

### 公共 express-server

框架现已集成一个公共 express-server，插件无需再自行监听端口开启，配置 `PluginSetting.server.routers`  即可使用公共 express-server。

**示例**

```ts
const serverRouters: Record<string, Router> = {
    "/api/info": express.Router().get( "/", async ( req, res ) => {
        res.send( true );
    } )
}

export async function init( bot: BOT ): Promise<PluginSetting> {
    return {
        pluginName: "genshin",
        cfgList: [],
        server: {
            routers: serverRouters
        }
    }
}
```

### 静态资源服务器

框架集成的公共 express-server 为插件目录注册了静态资源服务器，可通过 `localhost:port/插件目录名/资源路径` 访问。如果你不希望使用 vue 编写渲染页面，可通过此支持来使用类似 v2 的渲染方式。

## brake change

`renderer.asCqCode` 更名为 `renderer.asSegment`，调用方式不变;

`redis` 下的 `addSetMember`, `delSetMember` 方法输入类型由 `...value: any[]` 限制为 `...value: string[]`，`existSetMember` 方法由 `value: any` 限制为 `string`。

路径别名变更，`@` 与 `#` 后追加 `/`，防止语义不明。即 `@modules` 变为 `@/modules`，`#genshin` 变为 `#/genshin`。

升级 `redis` 版本，至少为 `v4+`，windows 下载地址：https://github.com/tporadowski/redis/releases