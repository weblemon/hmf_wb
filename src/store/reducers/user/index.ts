import { AdminActionTypes, AdminActions } from './action';

const initState: UserState = {
    user: null,
    Authorization: localStorage.getItem('authorization')
}

export function userReducer(state = initState, action: AdminActions) {
    switch (action.type) {
        case AdminActionTypes.SET_ADMIN_USER:
        return { ...state, user: action.user }

        case AdminActionTypes.SET_AUTHORIZATION:
        return { ...state, Authorization: action.Authorization }
        
        default:
        return state;
    }
}

export interface UserState {
    // 用户
    user: UserInfo | null;
    // 登录凭证
    Authorization: string | null;
}

export interface UserInfo {
    // 乡村
    country: string;
    // 性别
    gender: number;
    // 头像
    avatarUrl: string;
    // 城市
    city: string;
    // 昵称
    nickName: string;
    // 微信id
    openid: string;
    // 语言
    language: string;
    // 微信账号
    wechatNumber: string;
    // 用户类型 1为房东 2为中介 3为管理员
    type: number;
    // 备用手机
    sparePhone: string;
    // 真实姓名
    realName: string;
    // 省
    province: string;
    // 手机
    phone: string;
    // 用户id
    id: number;
    // 用户状态
    state: number;
    // ...
    region: string;
}