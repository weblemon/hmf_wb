import http, { BaseResponse } from "../http";

/**
 * 查询房源点击量
 * @param bizId 
 */
export function getHouseClickCount(bizId: number | string) {
    return http.get<BaseResponse<number>>('/record/querySum', {
        params: {
            type: 1,
            bizId
        }
    })
}