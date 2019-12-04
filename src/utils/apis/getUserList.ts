import http, { BaseResponse, BaseQueryListParams } from "../http";

export function getUserList(params: QueryUserParams) {
    return http.get<BaseResponse<UserInfoList>>('/users/queryUserPage', {
        params
    });
}


export interface QueryUserParams extends BaseQueryListParams {
    id?: string | number;
    nickName?: string;
    phone?: string;
    realName?: string;
    gender?: string | number | null;
    type?: string | number;
    state?: string;
    search?: string;
    startAddTime?: string;
    endAddTime?: string;
    province?: string;
    city?: string;
    region?: string;
    recommendId?: number;
}


export interface UserInfoList {
    total: number;
    size: number;
    pages: number;
    current: number;
    records: UserInfo[];
}

export interface UserInfo {
    id: number;
    deleted: boolean;
    rawAddTime: string;
    rawUpdateTime?: string;
    userName?: string;
    password?: string;
    openid?: string;
    wechatNumber?: any;
    nickName?: string;
    region?: any;
    phone?: string;
    sparePhone?: string;
    realName?: string;
    gender: number;
    type: number;
    state: number;
    avatarUrl?: string;
    city?: string;
    country?: string;
    language?: string;
    province?: string;
    isNeedCheck: number;
    balance: number;
    parentId: number;
    recommendId: number;
    code?: any;
    sms?: any;
  }

