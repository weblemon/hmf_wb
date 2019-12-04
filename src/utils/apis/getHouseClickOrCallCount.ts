

import http from "../http";
import { AxiosResponse, AxiosPromise } from "axios";


/**
 * 根据用户id 获取电话拨打统计和点击量统计
 * @param params 
 */
function queryCountForUserId(params: QueryCountParams): AxiosPromise<queryCountResponseData> {
    return http.get<queryCountResponseData>('/record/queryCount', {
        params
    })
}

/**
 * 查询用户的电话拨打和点击量统计
 * @param userId 用户ID
 * @returns { Promise<queryCountResponseData[]> }
 * 数组 0 所有点击统计总数
 * 数组 1 今日点击总数
 * 数组 2 所有电话拨打统计总数
 * 数组 3 今日电话拨打总数
 */
export function getHouseClickOrCallCount(userId: string | number): Promise<AxiosResponse<queryCountResponseData>[]> {
    const date = new Date()
    let M: number | string = date.getMonth() + 1
    let D: number | string = date.getDate()

    if (M < 10) M = `0${M}`
    if (D < 10) D = `0${D}`

    const dateTime = `${date.getFullYear()}-${M}-${D}`;
    // 查询条件
    const query: QueryCountParams[] = [
        {
            userId,
            type: 1
        },
        {
            userId,
            type: 1,
            dateTime
        },
        {
            userId,
            type: 2,
            dateTime
        },
        {
            userId,
            type: 2,
            dateTime
        }
    ]
    return Promise.all(query.map(item => queryCountForUserId(item)))
}

export interface QueryCountParams {
    userId: string | number;
    type: '1' | '2' | 1 | 2;
    dateTime?: string;
}

export interface queryCountResponseData {
  success: boolean;
  code: string;
  message?: any;
  draw: number;
  data: number;
}