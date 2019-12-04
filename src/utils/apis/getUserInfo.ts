import http, { BaseResponse } from "../http";
import { UserInfo } from "./getUserList";

/**
 * 根据id查询用户
 * @param id
 */
export function getUserInfo(id: number | string) {
    return http.get<BaseResponse<UserInfo>>('/users/queryUser', {
        params: {
            id
        }
    })
}