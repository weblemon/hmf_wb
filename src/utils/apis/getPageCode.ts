import http, {BaseResponsePage, BaseQueryListParams, BaseResponse} from "../http";

export function queryPageCode(params: QueryPageCodeParams) {
    return http.get<BaseResponsePage<QueryPageCodeInfo>>("/qrCodeDistrict/queryPageCode", {params});
}

export function createRegistration(data: QueryPageCodeSaveParams) {
    return http.post<BaseResponse>("/qrCodeDistrict/qrCode", data)
}

/**
 * 地区激活
 * 验证激活码
 * @param registrationCode 激活码
 */
export function registrationCode(registrationCode: number| string) {
    return http.get<BaseResponse>("/qrCodeDistrict/queryCode", {
        params: {registrationCode}
    });
}

export function deleteRegistration(id: string | number) {
    return http.post<BaseResponse>("/qrCodeDistrict/delete", {id})
}

export interface QueryPageCodeInfo {
    deleted: boolean;
    districtId: number;
    districtName: string;
    id: number;
    page: string;
    qrCodeUrl: string;
    rawAddTime: string;
    rawUpdateTime: null| string;
    registrationCode: string;
    scene: string;
    type: 1 | 2;
    userId: string;
}

export interface QueryPageCodeSaveParams {
    // 用户id
    userId?: number;
    // 地区id
    districtId: number;
    // 地区名称
    districtName: string;
    // 小程序码场景
    scene: string;
    // 页面路径
    page: string;
}

export interface QueryPageCodeParams extends BaseQueryListParams{
    current: number;
    size: number;
    order: "asc" | "desc";
    userId?: number | string;
    //1：二维码 2:注册码
    type?: 1 | 2;
}