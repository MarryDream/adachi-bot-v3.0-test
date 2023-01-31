# v2 to v3

## feature

### 新的插件配置项

```ts
interface PluginSetting {
    pluginName: string;
    cfgList: cmd.ConfigType[];
    aliases?: string[];
    render?: boolean | {
        dirname?: string;
        mainFiles?: string[];
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

**render**

是否启用框架的 vue-router 前端路由服务，默认不启用。传入 `true` 或配置对象后开启。

| 属性名       | 说明                                                   | 类型       | 默认值          |
|-----------|------------------------------------------------------|----------|--------------|
| dirname   | 从插件目录下的第一级子文件中，指定插件渲染页面存放目录                          | string   | views        |
| mainFiles | 从指定 dirname 下的第一级子目录内，自动查找的 .vue 文件名称列表，将以左往右的顺序依次尝试 | string[] | \[ "index" ] |

### 公共 vue-router

前端渲染页已整合至一个公共 vite 项目，共享 vue-router 配置。通过 `PluginSetting.render` 配置项进行配置，框架将会从该目录下按一定的规则加载 route 配置。

加载规则：

1、对于 `.vue` 文件，直接按文件名加载路由。  
2、对于目录，按照配置项 `render -> mainFiles` 给出的列表，以从左到右的优先级在目录的第一级文件内查找并加载。例如对于配置项默认值 `[ "index" ]`，将会加载目录内的 `index.vue`。加载的路由路径将以**插件名称**即 `PluginSetting.pluginName` 起始。

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

同时，当你希望在前端页面中引入本地资源时，则可以利用静态资源服务器来进行访问。

**示例**

存在如下目录结构：

```text
- test-plugin
  - assets
    - test.png
```

你可以在代码中通过如下方式加载 `test.png`。

```css
.test {
    background: url("/test-plugin/assets/test.png");
}
```

## 注册插件配置文件

新增 `bot.config.register` 方法，该方法会自动创建配置文件，或与已存在的配置文件对比更新新增的配置项。返回处理后的配置项数据。

### 示例

```ts
/* test-plugin 插件 */
export async function init( { file, config }: BOT ): Promise<PluginSetting> {
    // 创建 test-plugin.yml 配置文件 或是与已存在的 test-plugin.yml 进行对比，返回更新后的配置项内容
	const configData = config.register( file, "test-plugin", { setting1: true, setting2: false } );
    console.log( configData ); // { setting1: true, setting2: false }
}
```

## brake change

### renderer.asCqCode 方法名称变更

`renderer.asCqCode` 更名为 `renderer.asSegment`，调用方式不变;

### renderer.register 方法参数变更

不再需要传递 `name` 与 `port`（内部自动使用 `bot.config.renderPort`） 参数。

对于 `route` 参数，分为两种情况：

- 当使用框架集成的 vue-router 时，建议传递**插件名称**
- 当使用框架集成的静态资源服务器时，建议传递以 `plugins` 目录为基准的页面所在的目录路径，如 `/genshin/views`

### redis 类工具方法 ts 类型变更

`redis` 下的 `addSetMember`, `delSetMember` 方法输入类型由 `...value: any[]` 限制为 `...value: string[]`，`existSetMember` 方法由 `value: any` 限制为 `string`。

### 路径别名变更

`@` 与 `#` 后追加 `/`，防止语义不明。即 `@modules` 变为 `@/modules`，`#genshin` 变为 `#/genshin`。

### redis 所需版本升级

升级 `redis` 版本，至少为 `v4+`，windows 下载地址：https://github.com/tporadowski/redis/releases

### 前端页面本地静态资源引入路径变更

由于使用了 `vue-router`，相对路径不再准确，建议使用绝对路径，参考上文 **静态资源服务器**