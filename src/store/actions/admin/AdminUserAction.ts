import { Action, Dispatch} from "redux";
import { StoreActions} from "../../../pages/constants/StoreActions";
import http, {BaseResponse} from "../../../utils/http";

interface AdminUserLoginAction extends Action{
    type: StoreActions.adminLogin;
    user: AdminUserInfo;
    Authorization: string;
}
interface AdminUserLogoutAction extends Action{
    type: StoreActions.adminLogout;
}

export interface AdminUserLoginResponse extends BaseResponse{
    // token
    Authorization: string;
    // 用户信息
    userIfo: AdminUserInfo;
}
export interface AdminUserInfo {
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
    // 地区
    region: string;
}
export interface AdminUserLoginParams {
    // 用户名
    userName: string;
    // 密码
    password: string;
    // 验证码
    sms: string;
}

/**
 * 管理员登录Action
 * @param data
 */
export function adminUserLoginAction(data: AdminUserLoginParams) {
    return async (dispatch: Dispatch<AdminUserLoginAction>) => {
        const response = await http.post<BaseResponse<AdminUserLoginResponse>>('/login', data);
        if (response.data.success) {
            const { data } = response.data;
            const { userIfo, Authorization } = data;
            localStorage.setItem('authorization', Authorization);
            dispatch({
                type: StoreActions.adminLogin,
                Authorization,
                user: userIfo
            })
        }
        return response;
    }
}
/**
 * 管理员登出Action
 */
export function adminUserLogoutAction() {
    localStorage.removeItem('authorization');
    return (dispatch: Dispatch<AdminUserLogoutAction>) => {
        dispatch({
            type: StoreActions.adminLogout
        })
    }
}

 export type AdminUserAction = AdminUserLoginAction | AdminUserLogoutAction;