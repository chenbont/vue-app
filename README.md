# Vue-App

Vue + Cordova 开发的 App 模板

此项目完整记录并呈现使用 Vue + Cordova 开发 APP 的过程和成果。

**建议：**不要直接 clone 此项目，按此文档自行安装配置能更好的理解开发过程。

## 环境要求
 * node.js
 * npm

## 安装过程
### 安装基础包
 * vue-cli3
```bash
npm install -g @vue/cli
```
 * cordova
```bash
npm install -g cordova
```

### 创建项目

```bash
#vue create vue-app
#cd vue-app
```
### 安装 vue-cordova 插件
```bash
#npm install --save vue-cordova
```
### 添加 cordova 到项目中
```bash
#vue add cordova
```
## 调试
在 Windows 下调试需要安装一个Android 模拟器和　Chrome 浏览器
> 推荐使用“雷电模拟器”
### Android 调试
```bash
#npm run cordova-serve-android
```
运行后，会生成 app-debug.apk 并安装到模拟器中启动，截图如下：
![](https://github.com/chenbont/vue-app/raw/master/document/images/vue-app.png)
#### 在浏览器中调试
在 chrome 浏览器中访问
```js
chrome://inspect/#devices
```
会列出连接调试的 app，点 inspect 弹出调试窗口。
> 注意：调试窗口白屏的话，可能需要翻墙对 chrome devtools 进行初始化安装，建议使用“瓦力加速器”
#### 在 webstorm 中配置运行环境
程序有以下启动命令
```bash
# 启动 android 调试
$ npm run cordova-serve-android
# 生成 android 发布包
$ npm run cordova-build-android 
# 启动 ios 调试
$ npm run cordova-serve-ios
# 生成 ios 发布包
$ npm run cordova-build-ios # Build IOS 
# 启动浏览器调试
$ npm run cordova-serve-browser
# 生成浏览器发布包
$ npm run cordova-build-browser
# 预创建
$ npm run cordova-prepare
```
 1. 在 webstorm 右上角点“Add Configuration”，打开 Run/Debug Configurations 对话框。
 2. 然后点左上角的 “+” 号，在弹出菜单中选择“npm”
 3. 在 scrpits 中填上面命令中的 cordova-serve-* 部分，即可添加相应的启动配置。
 4. 添加好后，即可通过点击上面的 Run 按钮（绿色三角形）来启动相应的命令。
 
除了不再需要在Terminal面板中输入命令运行外，webstorm 会在下方出现一个 RUN 面板运行，Terminal 中仍可以运行其他命令。

现在，一个简单的 vue app 就生成了，你可以试着生成一个发布包安装到自己的手机上体验一下。

**这玩具都不算，还需要更多功能**
### 功能模块安装与配置
#### 1. axios 网络访问组件
App 免不了访问远程API接口，我们使用 axios 来完成它。下面，我们帮安装并完成它的跨域配置和API接口封装。

##### 安装 axios 和 qs
```bash
npm install --save axios vue-axios
npm install --save qs
```
##### 封装 http.js 作为请求管理器
1. 在 /src/functions/http.js

此组件导出 get、post、nGet、nPost 方法，其中：
 * get/post 方法封装项目定义API接口协议，对API返回的错误信息做异常处理。
 > 项目接口协议为：
 > 1. 所有 API 都返回 http 状态码 200，不得以 http 状态码来区分。
 > 2. 所有 API 必须返回 {code=0,msg='sucess'}字段，如果有业务数据返回时全部放在data字段中。
 * nGet/nPost 方法直接返回API数据。
```js
import axios from 'axios'; // 引入axios
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据，后面会提到
//请求拦截器
axios.interceptors.request.use(function (config) {
    config.headers ["Content-type"] = "application/x-www-form-urlencoded"
    let token = localStorage.getItem('token')

    if (token) {
        config.headers.authorization =  'Bearer ' + token
    }
    axios.defaults.headers.common["Content-type"] = "application/x-www-form-urlencoded"

    return config
}, function (error) {
    // 请求错误时弹框提示，或做些其他事

    return Promise.reject(error)
})
// 响应拦截器
axios.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    }
);
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params){
    return new Promise((resolve, reject) =>{
        axios.get(url, params).then(res => {
            if (res.data.code==0) {
                resolve(res.data);
            } else {
                reject(res.data)
            }
        }).catch(err =>{
            reject(err)
        })
    });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {//相当于授权
        axios.post(url, QS.stringify(params))
            .then(res => {
                console.log(res.data.code);
                if (res.data.code==0)
                    resolve(res.data);
                else
                    reject(res.data)
            })
            .catch(err =>{
                reject(err)
            })
    });
}

/**
 * 原始 get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function nGet(url, params){
    return new Promise((resolve, reject) =>{
        axios.get(url, {params:params}).then(res => {
             resolve(res);
        }).catch(err =>{
            reject(err)
        })
    });
}

/**
 * 原始 post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function nPost(url, params) {
    return new Promise((resolve, reject) => {//相当于授权
        axios.post(url, QS.stringify(params))
            .then(res => {
                resolve(res.data);
            })
            .catch(err =>{
                reject(err)
            })
    });
}

```
