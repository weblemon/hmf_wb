import http, {BaseResponse, BaseResponsePage} from "../http";

/**
 * 获取地区分页接口
 * @type api
 * @param params
 */
export function getDistrictPage(params: QueryDistrictPageParams) {
    return http.get<BaseResponsePage<DistrictInfo>>('/district/queryDistrictPage', {
        params
    });
}

/**
 * 保存地区设置
 * @type api
 * @param data
 */
export function districtSave(data: SaveDistrictParams) {
    return http.post<BaseResponse<DistrictInfo>>('/district/save', data);
}

/**
 * 删除地区设置
 * @type api
 * @param data
 */
export function districtDelete(data: DeleteDistrictParams) {
    return http.post<BaseResponse<boolean>>('/district/delete', data);
}

export interface SaveDistrictParams {
    // 地区名称
    fullname: 'string';
    // 地区编码
    id: number;
    // 经度
    'lat': string;
    // 纬度
    'lng': string;
}
export interface DeleteDistrictParams {
    id: number;
}
export interface QueryDistrictPageParams {
    currentPage?: number;
    pageSize?: number;
}

export interface DistrictInfo extends SaveDistrictParams {
    deleted: boolean;
    rawAddTime: string | null;
    rawUpdateTime: string | null;
}
