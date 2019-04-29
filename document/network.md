# 网络与API

App 免不了访问远程API接口，我们使用 axios 来完成它。

下面，我们安装并完成它的跨域配置和API接口封装与模拟。

## 安装 axios 和 qs
```bash
npm install --save axios vue-axios
npm install --save qs
```
## axios 跨域设置
在 [/src/vue.config.js](https://github.com/chenbont/vue-app/blob/master/vue.config.js)(如果没有就创建一个) 中配置 devServer 字段
```js
  devServer: {
      proxy: { // 配置跨域
        'client':{
            target: 'http://192.168.0.199:9002',
        },
          'amap':{
              target: 'https://restapi.amap.com/v3',
              pathRewrite: {
                  '^/amap': ''
              },
          },
          'qqmap':{
              target: 'https://apis.map.qq.com/ws',
              pathRewrite: {
                  '^/qqmap': ''
              },

          },
      }
    }
```
添加后，axios 请求时实际地址为：
>/client/v1/getInfo  ====> http://192.168.0.199:9002/client/v1/getInfo
>
>/amap/getInfo  ====> https://restapi.amap.com/v3/getInfo
>
>/qqmap/getInfo  ====> https://apis.map.qq.com/ws/getInfo
## 封装 http.js 作为请求管理器
[/src/functions/http.js](https://github.com/chenbont/vue-app/blob/master/src/functions/http.js)

此组件导出 get、post、origGet、origPost 方法，其中：
 * get/post 方法封装项目定义API接口协议，对API返回的错误信息做异常处理。
 > 项目接口协议为：
 > 1. 所有 API 都返回 http 状态码 200，不得以 http 状态码来区分。
 > 2. 所有 API 必须返回 {code=0,msg='sucess'}字段，如果有业务数据返回时全部放在data字段中。
 * origGet/origPost 方法直接返回API数据。

## 封装 api.js 作为 API 服务接口
[/src/functions/api.js](https://github.com/chenbont/vue-app/blob/master/src/functions/api.js)
这个组件封装 app 所有的 API 接口（当然你也可以在实际项目中拆分成多个）。
### 封装要点
 * 此文件引入 http.js，调用并直接返回 get、post、origGet、origPost 方法。
 > 注意：*必须* 直接返回 http.js 中的 get、post、origGet、origPost 等请求方法，才能让页面接收到回调。
 * 前端加密方法，通常我们会对用户密码等字段进行前端加密（没多大用，只是显得高大上一些），推荐使用 crypto-js 进行加密。
 > 安装 crypto-js
 > ```js
 > npm i --save crypto-js
 > ```
 * 不要在 api.js 中处理业务逻辑，业务应放在相应的页面。
 
 API定义例子如：
 ```js
    /**
     * 用户登录
     * @param mobile  手机号
     * @param password  密码
     * @param code  验证码
     * @constructor
     */
    Login(username,password,code) {
        let params={
            username: username,
            code: code,
            password:CryptoJS.MD5(password).toString()
        }
        return post("/api/login",params)
    },
```
### API 的调用
#### 将 api.js 注册为 Vue 对象
在 [/src/main.js](https://github.com/chenbont/vue-app/blob/master/src/main.js) 中添加：
```js
import api from "./functions/api";
Vue.prototype.$api = api
```
之后，所有vue页面就都可以使用 this.$api 来调用API了。
#### 在页面中调用 API
以 @click="login" 方法为例：
```js
    login(){
        let that =this
        that.$api.Login(this.username,this.password,this.code).then(function (res) {
            console.log(res)
        }).catch(function (err) {
            message.error(err.msg)
            //这里使用了 ui 调用一个消息框显示出错信息，以后会在此项目的 ui 框架部分详细讲解。
            if (err.code==2005) {
                // 验证码出错时，刷新验证码
                that.refreshCode()
            }
        })
    }
```
按 Promise 的方式进行调用，then 是正常返回要执行的函数，catch 是错误时要执行的函数。

## API 模拟
在项目开发中，通常是前端和后端同时开发的，前端不可能等后端实现API接口再来对接业务逻辑。所以我们需要在前端进行API的模拟，不要让后端影响到前端的进度。

使用 mockjs 进行API模拟。

### 1.安装
```bash
npm install --save-dev mockjs
```
### 2.编写API规则
在 [/src/mock.js](https://github.com/chenbont/vue-app/blob/master/src/mock.js) 中编写 API 本地接口规则，
接口地址要和实际需要请求的一致，如：
```js
import Mock from "mockjs";

Mock.setup({
    timeout: '10-250' //设置随机超时
})

Mock.mock("/api/login","post", {
    "code": 0,
    "msg": "success",
    "data": {
    "server": "mock"
    }
})

```
mockjs 可以随机生成API返回结果，例如姓名、手机号、身份证号、地址等，详细规则参阅[mockjs官网](http://mockjs.com/)

### 3.模拟与现实的切换
当 App 需要模拟时，在 [/src/main.js](https://github.com/chenbont/vue-app/blob/master/src/main.js) 中添加：
```js
/**
 * 使用本地数据模拟
 */
require('./mock.js')
```
这样，系统就会使用模拟接口运行了。

当你不需要模拟时，注释掉上面的 require 语句即可。
