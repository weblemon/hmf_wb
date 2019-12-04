import http, { BaseResponse } from "../http";

/**
 * 查询房源电话拨打数量
 * @param bizId 
 */
export function getHouseCallCount(bizId: number | string) {
    return http.get<BaseResponse<number>>('/record/querySum', {
        params: {
            type: 2,
            bizId
        }
    })
}