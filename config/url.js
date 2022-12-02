// 公用地址
const common = {
  // 接口pathname
  apiUrlFilter: '/authnService',
  // 七牛云资源地址
  qiniuUrl: 'https://xres.bnq.com.cn/file',
  // 上传图片接口api
  uploadUrlFilter: '/api',
};

const url = {
  // 本地开发环境 - development
  development: {
    // 本地测试接口地址
    targetUrl: 'https://z-dev.bnq.com.cn',
    uploadUrlDomain: 'https://oss-dev.bnq.com.cn',
    // 本地测试地址
    localUrl: 'http://localhost.bnq.com.cn',
    assetsUrl: 'https://asset-dev.bnq.com.cn/personalAssets/embed',
    // 监听端口
    port: 7000,
    // 是否自动打开浏览器页面
    autoOpenBrowser: false,
    ...common,
  },
  // 测试环境 - dev
  dev: {
    uploadUrlDomain: 'https://oss-dev.bnq.com.cn',
    assetsUrl: 'https://asset-dev.bnq.com.cn/personalAssets/embed',
    ...common,
  },
  // 测试环境 - test
  test: {
    uploadUrlDomain: 'https://oss-test.bnq.com.cn',
    assetsUrl: 'https://asset-test.bnq.com.cn/personalAssets/embed',
    ...common,
  },
  // 生产环境 - prod
  prod: {
    uploadUrlDomain: 'https://oss.bnq.com.cn',
    assetsUrl: 'https://asset.bnq.com.cn/personalAssets/embed',
    ...common,
  },
};

module.exports = url;
