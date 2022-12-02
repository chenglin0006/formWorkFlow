### 本地开发

0. 【建议】修改本地 host: `127.0.0.1 localhost.bnq.com.cn`
1. 修改文件`config\url`中的字段`url.development.targetUrl`为需要对接的后端接口地址
2. 执行命令`npm run start`
3. 浏览器打开本地测试地址，默认为`http://localhost:7000`或`http://localhost.bnq.com.cn:7000`

### 线上构建

- 线上开发环境： `npm run dev`
- 线上测试环境： `npm run test`
- 线上生产环境： `npm run prod`

### 目录结构

```bash
├── build                    # webpack及devserver配置
├── config
│   ├── config.js            # 全局参数配置
│   ├── routers.js           # 路由及菜单配置
│   ├── url.js               # 各环境地址配置
├── public                   # 打包文件目录
├── src
│   ├── app                  # 业务页面入口和常用模板
│   ├── assets               # 本地静态资源
│   ├── components           # 业务通用组件
│   ├── layouts              # 通用布局
│   ├── models               # 全局 model 和入口
│   ├── router               # 路由
│   ├── service              # 全局请求service
│   ├── utils                # 工具库
│   └── index.js             # 全局 JS
├── static                   # 静态文件目录
├── .babelrc                 # babel配置文件
├── .eslintignore            # eslint过滤配置文件
├── .eslintrc                # eslint配置文件
├── .gitattributes
├── .gitignore
├── .prettierignore
├── .prettierrc              # prettier配置文件
├── index.template.html      # index模板入口
├── jsconfig.json            # VSCode
├── package.json
├── postcss.config.js        # postcss配置文件
└── README.md
```

### 主要特点

- 基于 React@17，Antd@4，Webpack@5，Rematch@2，React-Router@5
- 使用 Less，PostCSS，Css Modules 等处理样式，全局样式配置在`config/config.js`中的`theme`，配置方法参考 antd@4 的[定制主题](https://ant.design/docs/react/customize-theme-cn)
- 基于 [Rematch](https://rematchjs.org/) 管理 Redux
  - 业务层 model 在业务文件夹中进行维护，统一出口在`/src/models/index.js`
  - store 中默认附带 loading 插件，通过 rematch 中异步方法的名称自动注入 loading 状态
  - 附带 logger 插件
- 基于 axios 进行网络请求，核心类在`/src/util/Remote`中
- 全局支持引用`import history from '@/router/history'`，利用`history.push()`进行应用内路由跳转，请避免使用`window.location`来实现应用内跳转页面
- 使用插件 AntdDayjsWebpackPlugin 将`moment.js`替换成`day.js`，请避免再次安装`moment.js`
- 引入 eslint + prettier 校验语法和统一代码格式，并利用 husky 在提交代码前进行校验

### 兼容性

支持 IE 11 及最新版本的浏览器，设置文件为`.browserslistrc`，具体支持的浏览器版本可在命令行执行`npx browserslist`

### 多端逻辑

- 登录页根据媒体查询设置不同样式，页面逻辑共用一套代码
- 主页根据设备类型分为 pc 和 h5 两套代码，model 和 service 共用
- 多端可以共用的部分放在每个模块的一级目录下，不能共用部分放在该模块的 pc 或 h5 目录下
