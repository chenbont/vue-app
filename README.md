#Vue-App

Vue + Cordova 开发的 App 模板

此项目完整记录并呈现使用 Vue + Cordova 开发 APP 的过程和成果。

## 环境要求
 * node.js
 * npm

## 基本安装
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
## 启动调试
在 Windows 下调试需要安装一个Android 模拟器和　Chrome 浏览器
> 推荐使用“雷电模拟器”
### 启动 Android 调试
```bash
#npm run cordova-serve-android
```
运行后，会生成 app-debug.apk 并安装到模拟器中启动，截图如下：
![](https://github.com/chenbont/vue-app/raw/master/document/images/vue-app.png)
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
