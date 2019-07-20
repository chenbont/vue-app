import axios from 'axios'; // 引入axios
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据，后面会提到
import Config from '../config.js'
const ax = axios.create(Config.ax);
//请求拦截器
ax.interceptors.request.use(function (config) {
    //这里判断是否为第三方API，如果是则清除 baseURL 设置（因为第三方不需要前缀 baseURL)
    if (config.url.indexOf("/v1")!=0) {
        config.baseURL = '';
    }
    let token = localStorage.getItem('token')
    if (token) {
        config.headers.authorization =  'Bearer ' + token
    }
    config.data = QS.stringify(config.data);

    return config
}, function (error) {
    // 请求错误时弹框提示，或做些其他事

    return Promise.reject(error)
})
// 响应拦截器
ax.interceptors.response.use(
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
        ax.get(url, {params:params}).then(res => {
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
 * 直接get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function origGet(url, params){
    return new Promise((resolve, reject) =>{
        axios.get(url, {params:params}).then(res => {
            resolve(res);
        }).catch(err =>{
            reject(err)
        })
    });
}

/**
 * 直接post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function origPost(url, params) {
    return new Promise((resolve, reject) => {//相当于授权
        axios.post(url, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err =>{
                reject(err)
            })
    });
}
