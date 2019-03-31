import axios from 'axios'

const http = axios.create({
    timeout: 1000 * 30,
    baseURL: '/proxyapi',
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
})

/**
 * 拦截请求配置
 */
http.interceptors.request.use((config) => {
    // config.data  请求体
    // config.params 查询字符串的参数
    config.headers = config.headers = {}
    config.headers['Authorization'] = localStorage.getItem('authorization')
    return config
})


/**
 * 拦截响应内容
 */
http.interceptors.response.use((response) => {
    // 处理收到的响应结果
    // response.data
    return response
})

export interface BaseResponse<T = any> {
    code: string;
    data: T;
    draw: number;
    message: string;
    success: boolean;
}

export default http