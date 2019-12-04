import axios from 'axios';

const http = axios.create({
    timeout: 1000 * 30,
    baseURL: '/proxyapi',
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
});

export const qmap = axios.create({
    timeout: 1000 * 30,
    baseURL: '/qmap'
});

/**
 * 拦截请求配置
 */
http.interceptors.request.use((config) => {
    // config.data  请求体
    // config.params 查询字符串的参数
    config.headers = config.headers = {};
    config.headers['Authorization'] = localStorage.getItem('authorization');
    return config
});

/**
 * 拦截响应内容
 */
http.interceptors.response.use((response) => {
    // 处理收到的响应结果
    // response.data
    return response
});

export interface BaseResponse<T = any> {
    // 响应码
    code: string;
    // 响应数据
    data: T;
    // any
    draw: number;
    // 消息
    message: string;
    // 请求是否成功
    success: boolean;
}

export interface BaseQueryListParams {
    order?: 'asc' | 'desc';
    current?: string | number;
    size?: string | number;
}

export interface BaseResponsePage<T> extends BaseResponse<BasePage<T>>{}

export interface BasePage<T> {
    total: number;
    size: number;
    pages: number;
    current: number;
    records: T[];
}

export default http