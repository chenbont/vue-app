import { get, post,origGet,origPost } from './http'
import CryptoJS from 'crypto-js'
export default {

    /**
     * 用户登录
     * @param mobile  手机号
     * @param password  密码
     * @constructor
     */
    Login(username,password,code) {
        let params={
            username: username,
            code: code,
            password:CryptoJS.MD5(password).toString()
        }
        //console.log(params)
        return post("/api/login",params)
    },
}